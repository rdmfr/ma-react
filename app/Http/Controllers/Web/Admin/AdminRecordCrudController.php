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

        $p = $query->paginate(20)->withQueryString();
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
                'import' => $type === 'students' ? route('admin.students.import') : null,
                'export' => $type === 'students' ? route('admin.students.export') : null,
            ],
            'q' => $q,
            'filters' => $filters,
            'rows' => $page,
        ]);
    }

    public function importStudents(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');
        $header = fgetcsv($handle);

        $count = 0;
        while (($row = fgetcsv($handle)) !== false) {
            if (count($header) !== count($row)) continue;
            $data = array_combine($header, $row);
            
            Record::query()->create([
                'type' => 'students',
                'data' => $data,
            ]);
            $count++;
        }
        fclose($handle);

        return redirect()->back()->with('success', "$count data siswa berhasil diimpor.");
    }

    public function exportStudents()
    {
        $records = Record::where('type', 'students')->get();
        $filename = "students_" . date('Ymd_His') . ".csv";
        
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $columns = ['nis', 'name', 'class', 'jurusan', 'status'];

        $callback = function() use($records, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($records as $r) {
                $row = [];
                foreach ($columns as $col) {
                    $row[] = $r->data[$col] ?? '';
                }
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
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
                'description' => 'Kelola data guru & staff.',
                'icon' => 'graduation-cap',
                'search' => ['name', 'subject'],
                'table' => [
                    ['key' => 'name', 'label' => 'Nama'],
                    ['key' => 'subject', 'label' => 'Mata Pelajaran'],
                    ['key' => 'status', 'label' => 'Status', 'badge' => ['approved' => 'emerald', 'pending' => 'amber', 'draft' => 'slate']],
                ],
                'fields' => [
                    ['key' => 'name', 'label' => 'Nama', 'input' => 'text', 'required' => true],
                    ['key' => 'slug', 'label' => 'Slug', 'input' => 'text', 'required' => true],
                    ['key' => 'subject', 'label' => 'Mata Pelajaran', 'input' => 'text', 'required' => true],
                    ['key' => 'photo', 'label' => 'Foto', 'input' => 'image'],
                    ['key' => 'bio', 'label' => 'Bio Singkat', 'input' => 'textarea'],
                    ['key' => 'is_featured', 'label' => 'Tampilkan di Beranda', 'input' => 'select', 'options' => [
                        ['value' => 'true', 'label' => 'Ya'],
                        ['value' => 'false', 'label' => 'Tidak'],
                    ]],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'draft', 'label' => 'Draft'],
                    ]],
                ],
            ],
            'students' => [
                'title' => 'Manajemen Siswa',
                'description' => 'Kelola data siswa, jurusan, dan kelas.',
                'icon' => 'user-plus',
                'search' => ['nis', 'name'],
                'filters' => [
                    ['key' => 'class', 'label' => 'Kelas', 'options' => ['X', 'XI', 'XII']],
                    ['key' => 'jurusan', 'label' => 'Jurusan', 'options' => ['IPA', 'IAI']],
                ],
                'table' => [
                    ['key' => 'nis', 'label' => 'NIS'],
                    ['key' => 'name', 'label' => 'Nama'],
                    ['key' => 'class', 'label' => 'Kelas'],
                    ['key' => 'jurusan', 'label' => 'Jurusan'],
                    ['key' => 'status', 'label' => 'Status', 'badge' => ['Aktif' => 'emerald', 'Lulus' => 'blue', 'Pindah' => 'amber']],
                ],
                'fields' => [
                    ['key' => 'nis', 'label' => 'NIS', 'input' => 'text', 'required' => true],
                    ['key' => 'name', 'label' => 'Nama Lengkap', 'input' => 'text', 'required' => true],
                    ['key' => 'class', 'label' => 'Kelas', 'input' => 'select', 'options' => [
                        ['value' => 'X', 'label' => 'X'],
                        ['value' => 'XI', 'label' => 'XI'],
                        ['value' => 'XII', 'label' => 'XII'],
                    ], 'required' => true],
                    ['key' => 'jurusan', 'label' => 'Jurusan', 'input' => 'select', 'options' => [
                        ['value' => 'IPA', 'label' => 'IPA'],
                        ['value' => 'IAI', 'label' => 'IAI (Agama)'],
                    ], 'required' => true],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'Aktif', 'label' => 'Aktif'],
                        ['value' => 'Lulus', 'label' => 'Lulus'],
                        ['value' => 'Pindah', 'label' => 'Pindah'],
                    ], 'default' => 'Aktif'],
                ],
            ],
            'subjects' => [
                'title' => 'Mata Pelajaran',
                'description' => 'Kelola mata pelajaran dan pengampu.',
                'icon' => 'book',
                'table' => [
                    ['key' => 'code', 'label' => 'Kode'],
                    ['key' => 'name', 'label' => 'Nama Mapel'],
                    ['key' => 'jurusan', 'label' => 'Jurusan'],
                ],
                'fields' => [
                    ['key' => 'code', 'label' => 'Kode Mapel', 'input' => 'text', 'required' => true],
                    ['key' => 'name', 'label' => 'Nama Mapel', 'input' => 'text', 'required' => true],
                    ['key' => 'jurusan', 'label' => 'Jurusan', 'input' => 'select', 'options' => [
                        ['value' => 'Umum', 'label' => 'Umum'],
                        ['value' => 'IPA', 'label' => 'IPA'],
                        ['value' => 'IAI', 'label' => 'IAI (Agama)'],
                    ]],
                    ['key' => 'teacher_id', 'label' => 'ID Guru Pengampu', 'input' => 'text'],
                ],
            ],
            'academicYears' => [
                'title' => 'Tahun Ajaran',
                'description' => 'Kelola periode akademik aktif.',
                'icon' => 'calendar',
                'table' => [
                    ['key' => 'year', 'label' => 'Tahun'],
                    ['key' => 'semester', 'label' => 'Semester'],
                    ['key' => 'is_active', 'label' => 'Status', 'badge' => ['Aktif' => 'emerald', 'Nonaktif' => 'slate']],
                ],
                'fields' => [
                    ['key' => 'year', 'label' => 'Tahun Ajaran', 'input' => 'text', 'placeholder' => '2026/2027', 'required' => true],
                    ['key' => 'semester', 'label' => 'Semester', 'input' => 'select', 'options' => [
                        ['value' => 'Ganjil', 'label' => 'Ganjil'],
                        ['value' => 'Genap', 'label' => 'Genap'],
                    ]],
                    ['key' => 'is_active', 'label' => 'Status Aktif', 'input' => 'select', 'options' => [
                        ['value' => 'Aktif', 'label' => 'Aktif'],
                        ['value' => 'Nonaktif', 'label' => 'Nonaktif'],
                    ]],
                ],
            ],
            'news' => [
                'title' => 'Berita',
                'description' => 'Kelola berita dan artikel sekolah.',
                'icon' => 'newspaper',
                'search' => ['title', 'author'],
                'table' => [
                    ['key' => 'title', 'label' => 'Judul'],
                    ['key' => 'author', 'label' => 'Penulis'],
                    ['key' => 'status', 'label' => 'Status', 'badge' => ['approved' => 'emerald', 'pending' => 'amber', 'draft' => 'slate']],
                ],
                'fields' => [
                    ['key' => 'title', 'label' => 'Judul', 'input' => 'text', 'required' => true],
                    ['key' => 'slug', 'label' => 'Slug', 'input' => 'text', 'required' => true],
                    ['key' => 'author', 'label' => 'Penulis', 'input' => 'text', 'required' => true],
                    ['key' => 'category', 'label' => 'Kategori', 'input' => 'select', 'options' => array_map(fn ($c) => ['value' => $c, 'label' => $c], $categories)],
                    ['key' => 'image', 'label' => 'Gambar', 'input' => 'image'],
                    ['key' => 'content', 'label' => 'Konten', 'input' => 'richtext'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'draft', 'label' => 'Draft'],
                    ]],
                ],
            ],
            'scores' => [
                'title' => 'Nilai Siswa',
                'description' => 'Kelola nilai mata pelajaran siswa.',
                'icon' => 'award',
                'search' => ['nis', 'subject'],
                'table' => [
                    ['key' => 'nis', 'label' => 'NIS'],
                    ['key' => 'subject', 'label' => 'Mapel'],
                    ['key' => 'score', 'label' => 'Nilai'],
                    ['key' => 'semester', 'label' => 'Semester'],
                ],
                'fields' => [
                    ['key' => 'nis', 'label' => 'NIS Siswa', 'input' => 'text', 'required' => true],
                    ['key' => 'subject', 'label' => 'Mata Pelajaran', 'input' => 'text', 'required' => true],
                    ['key' => 'score', 'label' => 'Nilai (0-100)', 'input' => 'text', 'required' => true],
                    ['key' => 'semester', 'label' => 'Semester', 'input' => 'select', 'options' => [
                        ['value' => 'Ganjil', 'label' => 'Ganjil'],
                        ['value' => 'Genap', 'label' => 'Genap'],
                    ]],
                    ['key' => 'academic_year', 'label' => 'Tahun Ajaran', 'input' => 'text', 'placeholder' => '2026/2027'],
                ],
            ],
            'galleries' => [
                'title' => 'Galeri',
                'description' => 'Kelola album foto kegiatan.',
                'icon' => 'image',
                'table' => [
                    ['key' => 'title', 'label' => 'Judul'],
                    ['key' => 'category', 'label' => 'Kategori'],
                    ['key' => 'status', 'label' => 'Status', 'badge' => ['approved' => 'emerald', 'pending' => 'amber']],
                ],
                'fields' => [
                    ['key' => 'title', 'label' => 'Judul Album', 'input' => 'text', 'required' => true],
                    ['key' => 'category', 'label' => 'Kategori', 'input' => 'select', 'options' => $extraCats],
                    ['key' => 'cover', 'label' => 'Cover Album', 'input' => 'image'],
                    ['key' => 'images', 'label' => 'Foto-foto', 'input' => 'multifile'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
                    ]],
                ],
            ],
            'studentWorks' => [
                'title' => 'Karya Siswa',
                'description' => 'Kelola portofolio karya siswa.',
                'icon' => 'sparkles',
                'table' => [
                    ['key' => 'title', 'label' => 'Judul'],
                    ['key' => 'author', 'label' => 'Siswa'],
                    ['key' => 'status', 'label' => 'Status', 'badge' => ['approved' => 'emerald', 'pending' => 'amber']],
                ],
                'fields' => [
                    ['key' => 'title', 'label' => 'Judul Karya', 'input' => 'text', 'required' => true],
                    ['key' => 'author', 'label' => 'Nama Siswa', 'input' => 'text', 'required' => true],
                    ['key' => 'image', 'label' => 'Foto Karya', 'input' => 'image'],
                    ['key' => 'description', 'label' => 'Deskripsi', 'input' => 'textarea'],
                    ['key' => 'status', 'label' => 'Status', 'input' => 'select', 'options' => [
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'pending', 'label' => 'Pending'],
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
