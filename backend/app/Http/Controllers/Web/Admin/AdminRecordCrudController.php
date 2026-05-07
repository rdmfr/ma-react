<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Record;
use App\Support\HtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class AdminRecordCrudController extends Controller
{
    public function index(Request $request, string $type)
    {
        $module = $this->moduleConfig($type);
        if (!$module) {
            abort(404);
        }

        $q = trim((string) $request->query('q', ''));
        $filters = [];
        foreach (($module['filters'] ?? []) as $f) {
            $filters[$f['key']] = (string) $request->query($f['key'], '');
        }

        $query = Record::query()->where('type', $type)->orderByDesc('updated_at');

        if ($q !== '') {
            $searchFields = $module['search'] ?? [];
            if (count($searchFields) > 0) {
                $query->where(function ($sub) use ($searchFields, $q) {
                    foreach ($searchFields as $sf) {
                        $sub->orWhere('data->' . $sf, 'like', '%' . $q . '%');
                    }
                });
            }
        }

        foreach (($module['filters'] ?? []) as $f) {
            $val = (string) ($filters[$f['key']] ?? '');
            if ($val === '' || $val === 'Semua') {
                continue;
            }
            $query->where('data->' . $f['key'], $val);
        }

        $p = $query->paginate(12)->withQueryString();
        $rows = collect($p->items())->map(function (Record $r) {
            $data = is_array($r->data) ? $r->data : [];
            return array_merge(['id' => $r->id, 'created_at' => $r->created_at, 'updated_at' => $r->updated_at], $data);
        })->values();

        $page = new LengthAwarePaginator($rows, $p->total(), $p->perPage(), $p->currentPage(), [
            'path' => $request->url(),
            'query' => $request->query(),
        ]);

        $section = (string) $request->route('section', 'Admin');
        $routeBase = (string) $request->route('routeBase', 'admin.records');

        return view('dashboard.records.index', [
            'module' => $module,
            'type' => $type,
            'section' => $section,
            'routes' => [
                'upload' => route($routeBase . '.upload', ['type' => $type]),
                'store' => route($routeBase . '.store', ['type' => $type]),
                'updateBase' => route($routeBase . '.update', ['type' => $type, 'record' => 'RECORD_ID']),
                'deleteBase' => route($routeBase . '.destroy', ['type' => $type, 'record' => 'RECORD_ID']),
            ],
            'q' => $q,
            'filters' => $filters,
            'rows' => $page,
        ]);
    }

    public function store(Request $request, string $type)
    {
        $module = $this->moduleConfig($type);
        if (!$module) {
            abort(404);
        }

        $data = $this->extractDataFromRequest($request, $module);
        $data = $this->sanitizeRichText($data, $module);
        $data = $this->handleUploads($request, $type, $data, $module);
        $data = $this->enforceSubmissionStatus($request, $data, $module);

        Record::query()->create([
            'type' => $type,
            'data' => $data,
        ]);

        return redirect()->back()->with('success', 'Data berhasil ditambahkan.');
    }

    public function update(Request $request, string $type, Record $record)
    {
        if ($record->type !== $type) {
            abort(404);
        }
        $module = $this->moduleConfig($type);
        if (!$module) {
            abort(404);
        }

        $data = $this->extractDataFromRequest($request, $module);
        $data = $this->sanitizeRichText($data, $module);
        $data = $this->handleUploads($request, $type, array_merge($record->data ?? [], $data), $module);
        $data = $this->enforceSubmissionStatus($request, $data, $module);

        $record->forceFill(['data' => $data])->save();

        return redirect()->back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request, string $type, Record $record)
    {
        if ($record->type !== $type) {
            abort(404);
        }
        $record->delete();
        return redirect()->back()->with('success', 'Data berhasil dihapus.');
    }

    public function upload(Request $request, string $type)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:5120'],
        ]);

        $file = $request->file('file');
        $path = Storage::disk('public')->putFile('uploads/' . $type, $file);
        $url = $this->absolutePublicUrl(Storage::url($path));

        return response()->json([
            'url' => $url,
        ]);
    }

    private function absolutePublicUrl(string $url): string
    {
        if ($url === '') {
            return $url;
        }
        if (preg_match('/^https?:\/\//i', $url)) {
            return $url;
        }
        if (str_starts_with($url, '/')) {
            return rtrim((string) config('app.url', ''), '/') . $url;
        }
        return $url;
    }

    private function extractDataFromRequest(Request $request, array $module): array
    {
        $keys = collect($module['fields'] ?? [])->pluck('key')->values()->all();
        $raw = $request->only($keys);

        $out = [];
        foreach ($keys as $k) {
            if (!array_key_exists($k, $raw)) {
                continue;
            }
            $v = $raw[$k];
            if (is_string($v)) {
                $v = trim($v);
            }
            if ($v === null || $v === '') {
                continue;
            }
            $out[$k] = $v;
        }

        return $out;
    }

    private function sanitizeRichText(array $data, array $module): array
    {
        $richKeys = collect($module['fields'] ?? [])
            ->filter(fn ($f) => ($f['input'] ?? '') === 'richtext')
            ->pluck('key')
            ->values()
            ->all();

        foreach ($richKeys as $k) {
            if (!array_key_exists($k, $data)) {
                continue;
            }
            $data[$k] = HtmlSanitizer::sanitize((string) $data[$k]);
        }
        return $data;
    }

    private function enforceSubmissionStatus(Request $request, array $data, array $module): array
    {
        $role = (string) ($request->user()?->role ?? '');
        if ($role === 'admin') {
            return $data;
        }

        $hasStatusField = collect($module['fields'] ?? [])->contains(function ($f) {
            return is_array($f) && (($f['key'] ?? null) === 'status');
        });

        if (!$hasStatusField) {
            return $data;
        }

        $data['status'] = 'pending';
        return $data;
    }

    private function handleUploads(Request $request, string $type, array $data, array $module): array
    {
        foreach (($module['fields'] ?? []) as $field) {
            $input = (string) ($field['input'] ?? 'text');
            if (!in_array($input, ['image', 'file', 'multifile'], true)) {
                continue;
            }
            $key = (string) ($field['key'] ?? '');
            if ($key === '') {
                continue;
            }

            if ($input === 'multifile') {
                $files = $request->file($key);
                if (!is_array($files) || count($files) === 0) {
                    continue;
                }
                $existing = [];
                if (array_key_exists($key, $data) && is_array($data[$key])) {
                    $existing = $data[$key];
                }
                $uploaded = [];
                foreach ($files as $f) {
                    if (!$f) {
                        continue;
                    }
                    $path = Storage::disk('public')->putFile('uploads/' . $type, $f);
                    $uploaded[] = $this->absolutePublicUrl(Storage::url($path));
                }
                $merged = array_values(array_filter(array_merge($existing, $uploaded), fn ($x) => is_string($x) && $x !== ''));
                $data[$key] = $merged;
                if ($type === 'galleries') {
                    $data['count'] = count($merged);
                }
                continue;
            }

            $file = $request->file($key);
            if (!$file) {
                continue;
            }
            $path = Storage::disk('public')->putFile('uploads/' . $type, $file);
            $data[$key] = $this->absolutePublicUrl(Storage::url($path));
        }
        return $data;
    }

    private function moduleConfig(string $type): ?array
    {
        $categories = ['Akademik', 'Prestasi', 'Kegiatan', 'Pengumuman'];
        $extraCats = [
            ['value' => 'multimedia', 'label' => 'Multimedia'],
            ['value' => 'pmr', 'label' => 'PMR'],
            ['value' => 'pramuka', 'label' => 'Pramuka'],
            ['value' => 'marawiss', 'label' => 'Marawis'],
            ['value' => 'hadroh', 'label' => 'Hadroh'],
            ['value' => 'olahraga', 'label' => 'Olahraga'],
            ['value' => 'kesenian', 'label' => 'Kesenian'],
        ];

        $modules = [
            'teachers' => [
                'title' => 'Manajemen Guru',
                'subtitle' => 'Kelola data guru & staff.',
                'search' => ['name', 'subject'],
                'columns' => [
                    ['key' => 'name', 'label' => 'Nama'],
                    ['key' => 'subject', 'label' => 'Mapel'],
                    ['key' => 'status', 'label' => 'Status'],
                ],
                'fields' => [
                    ['key' => 'name', 'label' => 'Nama', 'input' => 'text'],
                    ['key' => 'slug', 'label' => 'Slug', 'input' => 'text'],
                    ['key' => 'subject', 'label' => 'Mata Pelajaran', 'input' => 'text'],
                    ['key' => 'bio', 'label' => 'Bio', 'input' => 'textarea'],
                    ['key' => 'photo', 'label' => 'Foto', 'input' => 'image'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'draft', 'label' => 'Draft'],
                    ]],
                ],
            ],
            'students' => [
                'title' => 'Manajemen Siswa',
                'subtitle' => 'Kelola data siswa.',
                'search' => ['name', 'nis', 'class'],
                'columns' => [
                    ['key' => 'nis', 'label' => 'NIS'],
                    ['key' => 'name', 'label' => 'Nama'],
                    ['key' => 'class', 'label' => 'Kelas'],
                ],
                'fields' => [
                    ['key' => 'nis', 'label' => 'NIS', 'input' => 'text'],
                    ['key' => 'name', 'label' => 'Nama', 'input' => 'text'],
                    ['key' => 'class', 'label' => 'Kelas', 'input' => 'text'],
                    ['key' => 'photo', 'label' => 'Foto', 'input' => 'image'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'draft', 'label' => 'Draft'],
                    ]],
                ],
            ],
            'subjects' => [
                'title' => 'Mata Pelajaran',
                'subtitle' => 'Kelola daftar mata pelajaran.',
                'search' => ['name', 'group'],
                'columns' => [
                    ['key' => 'name', 'label' => 'Nama'],
                    ['key' => 'group', 'label' => 'Kelompok'],
                ],
                'fields' => [
                    ['key' => 'name', 'label' => 'Nama', 'input' => 'text'],
                    ['key' => 'group', 'label' => 'Kelompok', 'input' => 'text'],
                ],
            ],
            'academicYears' => [
                'title' => 'Tahun Ajaran',
                'subtitle' => 'Kelola tahun ajaran.',
                'search' => ['label'],
                'columns' => [
                    ['key' => 'label', 'label' => 'Tahun Ajaran'],
                    ['key' => 'active', 'label' => 'Aktif'],
                ],
                'fields' => [
                    ['key' => 'label', 'label' => 'Label', 'input' => 'text'],
                    ['key' => 'active', 'label' => 'Aktif', 'input' => 'select', 'options' => [
                        ['value' => 'true', 'label' => 'Ya'],
                        ['value' => 'false', 'label' => 'Tidak'],
                    ]],
                ],
            ],
            'classes' => [
                'title' => 'Kelas',
                'subtitle' => 'Kelola kelas.',
                'search' => ['name', 'grade', 'homeroom'],
                'columns' => [
                    ['key' => 'name', 'label' => 'Nama'],
                    ['key' => 'grade', 'label' => 'Tingkat'],
                    ['key' => 'homeroom', 'label' => 'Wali Kelas'],
                ],
                'fields' => [
                    ['key' => 'name', 'label' => 'Nama', 'input' => 'text'],
                    ['key' => 'grade', 'label' => 'Tingkat', 'input' => 'text'],
                    ['key' => 'homeroom', 'label' => 'Wali Kelas', 'input' => 'text'],
                ],
            ],
            'scores' => [
                'title' => 'Nilai',
                'subtitle' => 'Kelola atau lihat data nilai.',
                'search' => ['student', 'subject', 'class'],
                'columns' => [
                    ['key' => 'student', 'label' => 'Siswa'],
                    ['key' => 'class', 'label' => 'Kelas'],
                    ['key' => 'subject', 'label' => 'Mapel'],
                    ['key' => 'score', 'label' => 'Nilai'],
                ],
                'fields' => [
                    ['key' => 'student', 'label' => 'Siswa', 'input' => 'text'],
                    ['key' => 'class', 'label' => 'Kelas', 'input' => 'text'],
                    ['key' => 'subject', 'label' => 'Mapel', 'input' => 'text'],
                    ['key' => 'score', 'label' => 'Nilai', 'input' => 'text'],
                    ['key' => 'note', 'label' => 'Catatan', 'input' => 'textarea'],
                ],
            ],
            'modules' => [
                'title' => 'Modul',
                'subtitle' => 'Kelola modul pembelajaran.',
                'search' => ['title', 'subject', 'grade'],
                'filters' => [
                    ['key' => 'grade', 'label' => 'Tingkat'],
                ],
                'columns' => [
                    ['key' => 'title', 'label' => 'Judul'],
                    ['key' => 'subject', 'label' => 'Mapel'],
                    ['key' => 'grade', 'label' => 'Tingkat'],
                    ['key' => 'downloads', 'label' => 'Unduhan'],
                    ['key' => 'status', 'label' => 'Status'],
                ],
                'fields' => [
                    ['key' => 'title', 'label' => 'Judul', 'input' => 'text'],
                    ['key' => 'subject', 'label' => 'Mata Pelajaran', 'input' => 'text'],
                    ['key' => 'grade', 'label' => 'Tingkat', 'input' => 'text'],
                    ['key' => 'url', 'label' => 'File Modul (PDF/DOC)', 'input' => 'file'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'draft', 'label' => 'Draft'],
                    ]],
                ],
            ],
            'news' => [
                'title' => 'Berita',
                'subtitle' => 'Kelola berita publik.',
                'search' => ['title', 'category', 'author'],
                'filters' => [
                    ['key' => 'category', 'label' => 'Kategori', 'options' => array_map(fn ($c) => ['value' => $c, 'label' => $c], $categories)],
                ],
                'columns' => [
                    ['key' => 'title', 'label' => 'Judul'],
                    ['key' => 'category', 'label' => 'Kategori'],
                    ['key' => 'views', 'label' => 'Views'],
                    ['key' => 'status', 'label' => 'Status'],
                ],
                'fields' => [
                    ['key' => 'title', 'label' => 'Judul', 'input' => 'text'],
                    ['key' => 'slug', 'label' => 'Slug', 'input' => 'text'],
                    ['key' => 'category', 'label' => 'Kategori', 'input' => 'select', 'options' => array_map(fn ($c) => ['value' => $c, 'label' => $c], $categories)],
                    ['key' => 'excerpt', 'label' => 'Ringkasan', 'input' => 'textarea'],
                    ['key' => 'content', 'label' => 'Konten', 'input' => 'richtext'],
                    ['key' => 'image', 'label' => 'Gambar Utama', 'input' => 'image'],
                    ['key' => 'author', 'label' => 'Penulis', 'input' => 'text'],
                    ['key' => 'date', 'label' => 'Tanggal', 'input' => 'date'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'draft', 'label' => 'Draft'],
                    ]],
                ],
            ],
            'reflections' => [
                'title' => 'Refleksi',
                'subtitle' => 'Kelola refleksi publik.',
                'search' => ['title', 'author'],
                'columns' => [
                    ['key' => 'title', 'label' => 'Judul'],
                    ['key' => 'author', 'label' => 'Penulis'],
                    ['key' => 'status', 'label' => 'Status'],
                ],
                'fields' => [
                    ['key' => 'title', 'label' => 'Judul', 'input' => 'text'],
                    ['key' => 'slug', 'label' => 'Slug', 'input' => 'text'],
                    ['key' => 'author', 'label' => 'Penulis', 'input' => 'text'],
                    ['key' => 'date', 'label' => 'Tanggal', 'input' => 'date'],
                    ['key' => 'image', 'label' => 'Gambar', 'input' => 'image'],
                    ['key' => 'excerpt', 'label' => 'Ringkasan', 'input' => 'textarea'],
                    ['key' => 'content', 'label' => 'Konten', 'input' => 'richtext'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'draft', 'label' => 'Draft'],
                    ]],
                ],
            ],
            'announcements' => [
                'title' => 'Pengumuman',
                'subtitle' => 'Kelola pengumuman publik.',
                'search' => ['title', 'content'],
                'columns' => [
                    ['key' => 'title', 'label' => 'Judul'],
                    ['key' => 'pinned', 'label' => 'Pinned'],
                    ['key' => 'status', 'label' => 'Status'],
                ],
                'fields' => [
                    ['key' => 'title', 'label' => 'Judul', 'input' => 'text'],
                    ['key' => 'date', 'label' => 'Tanggal', 'input' => 'date'],
                    ['key' => 'pinned', 'label' => 'Pinned', 'input' => 'select', 'options' => [
                        ['value' => 'true', 'label' => 'Ya'],
                        ['value' => 'false', 'label' => 'Tidak'],
                    ]],
                    ['key' => 'content', 'label' => 'Konten', 'input' => 'richtext'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'draft', 'label' => 'Draft'],
                    ]],
                ],
            ],
            'events' => [
                'title' => 'Agenda',
                'subtitle' => 'Kelola agenda/events.',
                'search' => ['title', 'location', 'type'],
                'filters' => [
                    ['key' => 'type', 'label' => 'Tipe'],
                ],
                'columns' => [
                    ['key' => 'title', 'label' => 'Judul'],
                    ['key' => 'date', 'label' => 'Tanggal'],
                    ['key' => 'location', 'label' => 'Lokasi'],
                    ['key' => 'status', 'label' => 'Status'],
                ],
                'fields' => [
                    ['key' => 'title', 'label' => 'Judul', 'input' => 'text'],
                    ['key' => 'date', 'label' => 'Tanggal', 'input' => 'date'],
                    ['key' => 'time', 'label' => 'Jam', 'input' => 'text'],
                    ['key' => 'location', 'label' => 'Lokasi', 'input' => 'text'],
                    ['key' => 'type', 'label' => 'Tipe', 'input' => 'text'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'draft', 'label' => 'Draft'],
                    ]],
                ],
            ],
            'galleries' => [
                'title' => 'Galeri',
                'subtitle' => 'Kelola galeri kegiatan.',
                'search' => ['title', 'category'],
                'filters' => [
                    ['key' => 'category', 'label' => 'Kategori', 'options' => $extraCats],
                ],
                'columns' => [
                    ['key' => 'title', 'label' => 'Judul'],
                    ['key' => 'category', 'label' => 'Kategori'],
                    ['key' => 'count', 'label' => 'Foto'],
                    ['key' => 'status', 'label' => 'Status'],
                ],
                'fields' => [
                    ['key' => 'title', 'label' => 'Judul', 'input' => 'text'],
                    ['key' => 'category', 'label' => 'Kategori', 'input' => 'select', 'options' => $extraCats],
                    ['key' => 'date', 'label' => 'Tanggal', 'input' => 'date'],
                    ['key' => 'cover', 'label' => 'Cover', 'input' => 'image'],
                    ['key' => 'photos', 'label' => 'Foto Album', 'input' => 'multifile'],
                    ['key' => 'count', 'label' => 'Jumlah Foto', 'input' => 'text'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'draft', 'label' => 'Draft'],
                    ]],
                ],
            ],
            'studentWorks' => [
                'title' => 'Karya Siswa',
                'subtitle' => 'Kelola karya siswa.',
                'search' => ['title', 'author', 'category'],
                'filters' => [
                    ['key' => 'category', 'label' => 'Kategori'],
                ],
                'columns' => [
                    ['key' => 'title', 'label' => 'Judul'],
                    ['key' => 'author', 'label' => 'Author'],
                    ['key' => 'downloads', 'label' => 'Unduhan'],
                    ['key' => 'status', 'label' => 'Status'],
                ],
                'fields' => [
                    ['key' => 'title', 'label' => 'Judul', 'input' => 'text'],
                    ['key' => 'author', 'label' => 'Author', 'input' => 'text'],
                    ['key' => 'category', 'label' => 'Kategori', 'input' => 'text'],
                    ['key' => 'image', 'label' => 'Gambar', 'input' => 'image'],
                    ['key' => 'url', 'label' => 'File Karya', 'input' => 'file'],
                    ['key' => 'downloads', 'label' => 'Unduhan', 'input' => 'text'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'draft', 'label' => 'Draft'],
                    ]],
                ],
            ],
            'faqs' => [
                'title' => 'FAQ',
                'subtitle' => 'Kelola pertanyaan dan jawaban.',
                'search' => ['q', 'a', 'category'],
                'filters' => [
                    ['key' => 'category', 'label' => 'Kategori'],
                ],
                'columns' => [
                    ['key' => 'category', 'label' => 'Kategori'],
                    ['key' => 'q', 'label' => 'Pertanyaan'],
                    ['key' => 'status', 'label' => 'Status'],
                ],
                'fields' => [
                    ['key' => 'category', 'label' => 'Kategori', 'input' => 'text'],
                    ['key' => 'q', 'label' => 'Pertanyaan', 'input' => 'text'],
                    ['key' => 'a', 'label' => 'Jawaban', 'input' => 'richtext'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'draft', 'label' => 'Draft'],
                    ]],
                ],
            ],
            'ppdbRegistrants' => [
                'title' => 'PPDB',
                'subtitle' => 'Kelola pendaftar PPDB.',
                'search' => ['name', 'phone', 'status'],
                'columns' => [
                    ['key' => 'name', 'label' => 'Nama'],
                    ['key' => 'phone', 'label' => 'HP'],
                    ['key' => 'status', 'label' => 'Status'],
                ],
                'fields' => [
                    ['key' => 'name', 'label' => 'Nama', 'input' => 'text'],
                    ['key' => 'phone', 'label' => 'HP', 'input' => 'text'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'text'],
                    ['key' => 'note', 'label' => 'Catatan', 'input' => 'textarea'],
                ],
            ],
            'contactMessages' => [
                'title' => 'Pesan Masuk',
                'subtitle' => 'Kelola pesan dari formulir kontak.',
                'search' => ['name', 'email', 'message'],
                'columns' => [
                    ['key' => 'name', 'label' => 'Nama'],
                    ['key' => 'email', 'label' => 'Email'],
                    ['key' => 'status', 'label' => 'Status'],
                ],
                'fields' => [
                    ['key' => 'name', 'label' => 'Nama', 'input' => 'text'],
                    ['key' => 'email', 'label' => 'Email', 'input' => 'text'],
                    ['key' => 'message', 'label' => 'Pesan', 'input' => 'textarea'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'text'],
                ],
            ],
            'notifications' => [
                'title' => 'Notifikasi',
                'subtitle' => 'Kelola notifikasi internal.',
                'search' => ['title', 'body', 'status'],
                'columns' => [
                    ['key' => 'title', 'label' => 'Judul'],
                    ['key' => 'status', 'label' => 'Status'],
                ],
                'fields' => [
                    ['key' => 'title', 'label' => 'Judul', 'input' => 'text'],
                    ['key' => 'body', 'label' => 'Isi', 'input' => 'textarea'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'text'],
                ],
            ],
            'activityLog' => [
                'title' => 'Log Aktivitas',
                'subtitle' => 'Riwayat aktivitas perubahan data.',
                'search' => ['user', 'action', 'target'],
                'columns' => [
                    ['key' => 'date', 'label' => 'Tanggal'],
                    ['key' => 'user', 'label' => 'User'],
                    ['key' => 'action', 'label' => 'Aksi'],
                    ['key' => 'target', 'label' => 'Target'],
                ],
                'fields' => [
                    ['key' => 'date', 'label' => 'Tanggal', 'input' => 'text'],
                    ['key' => 'user', 'label' => 'User', 'input' => 'text'],
                    ['key' => 'action', 'label' => 'Aksi', 'input' => 'text'],
                    ['key' => 'target', 'label' => 'Target', 'input' => 'text'],
                ],
            ],
            'approvalQueue' => [
                'title' => 'Antrian Persetujuan',
                'subtitle' => 'Kelola approval untuk konten yang diajukan.',
                'search' => ['type', 'title', 'by', 'status'],
                'columns' => [
                    ['key' => 'type', 'label' => 'Tipe'],
                    ['key' => 'title', 'label' => 'Judul'],
                    ['key' => 'by', 'label' => 'Pengaju'],
                    ['key' => 'status', 'label' => 'Status'],
                ],
                'fields' => [
                    ['key' => 'type', 'label' => 'Tipe', 'input' => 'text'],
                    ['key' => 'title', 'label' => 'Judul', 'input' => 'text'],
                    ['key' => 'targetId', 'label' => 'Target ID', 'input' => 'text'],
                    ['key' => 'by', 'label' => 'Pengaju', 'input' => 'text'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'text'],
                ],
            ],
            'extracurriculars' => [
                'title' => 'Ekstrakurikuler',
                'subtitle' => 'Kelola ekstrakurikuler.',
                'search' => ['name', 'slug'],
                'columns' => [
                    ['key' => 'name', 'label' => 'Nama'],
                    ['key' => 'slug', 'label' => 'Kategori'],
                    ['key' => 'status', 'label' => 'Status'],
                ],
                'fields' => [
                    ['key' => 'name', 'label' => 'Nama', 'input' => 'text'],
                    ['key' => 'slug', 'label' => 'Slug', 'input' => 'select', 'options' => $extraCats],
                    ['key' => 'description', 'label' => 'Deskripsi', 'input' => 'textarea'],
                    ['key' => 'photo', 'label' => 'Foto', 'input' => 'image'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'draft', 'label' => 'Draft'],
                    ]],
                ],
            ],
            'evaluations' => [
                'title' => 'Evaluasi',
                'subtitle' => 'Kelola jadwal evaluasi.',
                'search' => ['title', 'class', 'date'],
                'columns' => [
                    ['key' => 'title', 'label' => 'Judul'],
                    ['key' => 'class', 'label' => 'Kelas'],
                    ['key' => 'date', 'label' => 'Tanggal'],
                ],
                'fields' => [
                    ['key' => 'title', 'label' => 'Judul', 'input' => 'text'],
                    ['key' => 'class', 'label' => 'Kelas', 'input' => 'text'],
                    ['key' => 'date', 'label' => 'Tanggal', 'input' => 'date'],
                    ['key' => 'note', 'label' => 'Catatan', 'input' => 'textarea'],
                ],
            ],
        ];

        return $modules[$type] ?? null;
    }
}
