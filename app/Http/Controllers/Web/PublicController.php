<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class PublicController extends Controller
{
    private const EXTRACURRICULAR_CATEGORIES = [
        ['value' => 'multimedia', 'label' => 'Multimedia'],
        ['value' => 'pmr', 'label' => 'PMR'],
        ['value' => 'pramuka', 'label' => 'Pramuka'],
        ['value' => 'marawiss', 'label' => 'Marawis'],
        ['value' => 'hadroh', 'label' => 'Hadroh'],
        ['value' => 'olahraga', 'label' => 'Olahraga'],
        ['value' => 'kesenian', 'label' => 'Kesenian'],
    ];

    private function isApproved(array $it): bool
    {
        if (!array_key_exists('status', $it) || $it['status'] === null || $it['status'] === '') return true;
        return $it['status'] === 'approved';
    }

    private function fetchRecords(string $type): Collection
    {
        return Record::query()
            ->where('type', $type)
            ->orderByDesc('updated_at')
            ->get()
            ->map(function (Record $r) {
                $data = is_array($r->data) ? $r->data : [];
                return array_merge(['id' => $r->id], $data);
            })
            ->filter(function ($it) {
                return is_array($it) && $this->isApproved($it);
            })
            ->values();
    }

    private function findBySlug(string $type, string $slug): ?array
    {
        $r = Record::query()
            ->where('type', $type)
            ->where('data->slug', $slug)
            ->orderByDesc('updated_at')
            ->first();

        if (!$r) return null;
        $data = is_array($r->data) ? $r->data : [];
        $out = array_merge(['id' => $r->id], $data);
        if (!$this->isApproved($out)) return null;
        return $out;
    }

    private function normalizeRecord(Record $r): ?array
    {
        $data = is_array($r->data) ? $r->data : [];
        $out = array_merge(['id' => $r->id], $data);
        if (!$this->isApproved($out)) return null;
        return $out;
    }

    public function profil()
    {
        $teachers = $this->fetchRecords('teachers');
        $featuredOrg = $teachers
            ->filter(fn ($t) => is_array($t) && (($t['is_featured'] ?? false) === true))
            ->take(8)
            ->values();

        return view('public.profil', [
            'featuredOrg' => $featuredOrg,
        ]);
    }

    public function beritaIndex(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $cat = (string) $request->query('cat', 'Semua');
        $categories = ['Akademik', 'Prestasi', 'Kegiatan', 'Pengumuman'];

        $all = $this->fetchRecords('news');
        $filtered = $all
            ->filter(function ($n) use ($q, $cat) {
                if (!is_array($n)) return false;
                if ($cat !== 'Semua' && ($n['category'] ?? null) !== $cat) return false;
                if ($q === '') return true;
                $title = strtolower((string) ($n['title'] ?? ''));
                return str_contains($title, strtolower($q));
            })
            ->values();

        return view('public.berita.index', [
            'news' => $filtered,
            'q' => $q,
            'cat' => $cat,
            'categories' => $categories,
        ]);
    }

    public function beritaShow(string $slug)
    {
        $record = Record::query()
            ->where('type', 'news')
            ->where('data->slug', $slug)
            ->orderByDesc('updated_at')
            ->first();

        if (!$record) abort(404);

        $data = is_array($record->data) ? $record->data : [];
        $out = array_merge(['id' => $record->id], $data);
        if (!$this->isApproved($out)) abort(404);

        $views = (int) ($data['views'] ?? 0);
        $data['views'] = $views + 1;
        $record->forceFill(['data' => $data])->save();
        $n = array_merge(['id' => $record->id], $data);

        $related = $this->fetchRecords('news')
            ->filter(fn ($x) => is_array($x) && ($x['id'] ?? null) !== ($n['id'] ?? null))
            ->take(3)
            ->values();

        return view('public.berita.show', [
            'n' => $n,
            'related' => $related,
        ]);
    }

    public function guruIndex(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $sub = (string) $request->query('sub', 'Semua');
        $cat = (string) $request->query('cat', 'Semua');

        $visible = $this->fetchRecords('teachers');
        $subjects = $visible
            ->flatMap(function ($t) {
                if (!is_array($t)) return [];
                $arr = $t['subjects'] ?? null;
                if (is_array($arr) && count($arr) > 0) return $arr;
                $s = $t['subject'] ?? null;
                return is_string($s) && trim($s) !== '' ? [$s] : [];
            })
            ->filter(fn ($s) => is_string($s) && trim($s) !== '')
            ->unique()
            ->sort()
            ->values();

        $categories = $visible
            ->map(fn ($t) => is_array($t) ? ($t['category'] ?? null) : null)
            ->filter(fn ($c) => is_string($c) && trim($c) !== '')
            ->unique()
            ->sort()
            ->values();

        $filtered = $visible
            ->filter(function ($t) use ($q, $sub, $cat) {
                if (!is_array($t)) return false;
                if ($cat !== 'Semua' && (string) ($t['category'] ?? '') !== $cat) return false;
                if ($sub !== 'Semua') {
                    $arr = $t['subjects'] ?? null;
                    if (is_array($arr) && count($arr) > 0) {
                        if (!in_array($sub, $arr, true)) return false;
                    } else {
                        if (($t['subject'] ?? null) !== $sub) return false;
                    }
                }
                if ($q === '') return true;
                $name = strtolower((string) ($t['name'] ?? ''));
                $subject = strtolower((string) ($t['subject'] ?? ''));
                $pos = strtolower((string) ($t['position'] ?? ''));
                $category = strtolower((string) ($t['category'] ?? ''));
                $needle = strtolower($q);
                return str_contains($name, $needle) || str_contains($subject, $needle) || str_contains($pos, $needle) || str_contains($category, $needle);
            })
            ->values();

        return view('public.guru.index', [
            'teachers' => $filtered,
            'q' => $q,
            'sub' => $sub,
            'cat' => $cat,
            'subjects' => $subjects,
            'categories' => $categories,
        ]);
    }

    public function guruShow(string $slug)
    {
        $t = $this->findBySlug('teachers', $slug);
        if (!$t) abort(404);

        return view('public.guru.show', [
            't' => $t,
        ]);
    }

    public function programStudi()
    {
        return view('public.program-studi', [
            'programs' => $this->fetchRecords('programStudies'),
        ]);
    }

    public function alumni(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $all = $this->fetchRecords('alumni');
        $filtered = $all
            ->filter(function ($a) use ($q) {
                if (!is_array($a)) return false;
                if ($q === '') return true;
                $needle = strtolower($q);
                $hay = strtolower(implode(' ', array_filter([
                    (string) ($a['name'] ?? ''),
                    (string) ($a['year'] ?? ''),
                    (string) ($a['major'] ?? ''),
                    (string) ($a['current'] ?? ''),
                    (string) ($a['quote'] ?? ''),
                ])));
                return str_contains($hay, $needle);
            })
            ->values();

        return view('public.alumni', [
            'alumni' => $filtered,
            'q' => $q,
        ]);
    }

    public function ekstrakurikuler(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $cat = (string) $request->query('cat', 'Semua');
        $all = $this->fetchRecords('extracurriculars');
        $cats = collect(self::EXTRACURRICULAR_CATEGORIES)->map(fn ($c) => $c['value'])->values()->all();

        $filtered = $all
            ->filter(function ($e) use ($q, $cat) {
                if (!is_array($e)) return false;
                if ($cat !== 'Semua' && ($e['slug'] ?? null) !== $cat) return false;
                if ($q === '') return true;
                $needle = strtolower($q);
                $name = strtolower((string) ($e['name'] ?? ''));
                $desc = strtolower((string) ($e['description'] ?? ''));
                return str_contains($name, $needle) || str_contains($desc, $needle);
            })
            ->values();

        return view('public.ekstrakurikuler', [
            'items' => $filtered,
            'q' => $q,
            'cat' => $cat,
            'categories' => $cats,
            'categoryMeta' => self::EXTRACURRICULAR_CATEGORIES,
        ]);
    }

    public function karyaSiswa(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $cat = (string) $request->query('cat', 'Semua');
        $all = $this->fetchRecords('studentWorks');
        $cats = $all
            ->map(fn ($w) => is_array($w) ? ($w['category'] ?? null) : null)
            ->filter(fn ($c) => is_string($c) && trim($c) !== '')
            ->unique()
            ->sort()
            ->values()
            ->all();

        $filtered = $all
            ->filter(function ($w) use ($q, $cat) {
                if (!is_array($w)) return false;
                if ($cat !== 'Semua' && ($w['category'] ?? null) !== $cat) return false;
                if ($q === '') return true;
                $needle = strtolower($q);
                $hay = strtolower(implode(' ', array_filter([
                    (string) ($w['title'] ?? ''),
                    (string) ($w['author'] ?? ''),
                    (string) ($w['category'] ?? ''),
                ])));
                return str_contains($hay, $needle);
            })
            ->values();

        return view('public.karya-siswa', [
            'works' => $filtered,
            'q' => $q,
            'cat' => $cat,
            'categories' => $cats,
        ]);
    }

    public function karyaSiswaDownload(Request $request, Record $record)
    {
        if ($record->type !== 'studentWorks') abort(404);
        $data = is_array($record->data) ? $record->data : [];
        $downloads = (int) ($data['downloads'] ?? 0);
        $data['downloads'] = $downloads + 1;
        $record->forceFill(['data' => $data])->save();

        $url = (string) ($data['url'] ?? '');
        if ($url === '') {
            return redirect()->route('karya-siswa')->with('error', 'File belum tersedia.');
        }
        return redirect()->away($url);
    }

    public function galeriIndex(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $cat = (string) $request->query('cat', 'Semua');
        $cats = collect(self::EXTRACURRICULAR_CATEGORIES)->map(fn ($c) => $c['value'])->values()->all();

        $all = $this->fetchRecords('galleries');
        $filtered = $all
            ->filter(function ($g) use ($q, $cat) {
                if (!is_array($g)) return false;
                if ($cat !== 'Semua' && ($g['category'] ?? null) !== $cat) return false;
                if ($q === '') return true;
                $needle = strtolower($q);
                $hay = strtolower(implode(' ', array_filter([
                    (string) ($g['title'] ?? ''),
                    (string) ($g['category'] ?? ''),
                ])));
                return str_contains($hay, $needle);
            })
            ->values();

        return view('public.galeri.index', [
            'items' => $filtered,
            'q' => $q,
            'cat' => $cat,
            'categories' => $cats,
            'categoryMeta' => self::EXTRACURRICULAR_CATEGORIES,
        ]);
    }

    public function galeriShow(Record $record)
    {
        if ($record->type !== 'galleries') abort(404);
        $g = $this->normalizeRecord($record);
        if (!$g) abort(404);

        $others = $this->fetchRecords('galleries')
            ->filter(fn ($x) => is_array($x) && ($x['id'] ?? null) !== ($g['id'] ?? null))
            ->take(6)
            ->values();

        return view('public.galeri.show', [
            'g' => $g,
            'others' => $others,
            'categoryMeta' => self::EXTRACURRICULAR_CATEGORIES,
        ]);
    }

    public function checkScores()
    {
        return view('public.check-scores');
    }

    public function searchScores(Request $request)
    {
        $request->validate(['nis' => 'required|string']);
        $nis = $request->nis;

        $student = Record::where('type', 'students')
            ->where('data->nis', $nis)
            ->first();

        if (!$student) {
            return redirect()->back()->with('error', 'Data siswa tidak ditemukan.');
        }

        $scores = Record::where('type', 'scores')
            ->where('data->nis', $nis)
            ->get()
            ->map(fn($r) => array_merge(['id' => $r->id], $r->data));

        return view('public.check-scores', [
            'student' => array_merge(['id' => $student->id], $student->data),
            'scores' => $scores,
            'nis' => $nis
        ]);
    }

    public function agenda(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $type = (string) $request->query('type', 'Semua');
        $all = $this->fetchRecords('events');
        $types = $all
            ->map(fn ($e) => is_array($e) ? ($e['type'] ?? null) : null)
            ->filter(fn ($t) => is_string($t) && trim($t) !== '')
            ->unique()
            ->sort()
            ->values()
            ->all();

        $filtered = $all
            ->filter(function ($e) use ($q, $type) {
                if (!is_array($e)) return false;
                if ($type !== 'Semua' && ($e['type'] ?? null) !== $type) return false;
                if ($q === '') return true;
                $needle = strtolower($q);
                $hay = strtolower(implode(' ', array_filter([
                    (string) ($e['title'] ?? ''),
                    (string) ($e['location'] ?? ''),
                    (string) ($e['type'] ?? ''),
                ])));
                return str_contains($hay, $needle);
            })
            ->values();

        return view('public.agenda', [
            'events' => $filtered,
            'q' => $q,
            'type' => $type,
            'types' => $types,
        ]);
    }

    public function modul(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $grade = (string) $request->query('grade', 'Semua');
        $all = $this->fetchRecords('modules');
        $grades = $all
            ->map(fn ($m) => is_array($m) ? ($m['grade'] ?? null) : null)
            ->filter(fn ($g) => is_string($g) && trim($g) !== '')
            ->unique()
            ->sort()
            ->values()
            ->all();

        $filtered = $all
            ->filter(function ($m) use ($q, $grade) {
                if (!is_array($m)) return false;
                if ($grade !== 'Semua' && (string) ($m['grade'] ?? '') !== $grade) return false;
                if ($q === '') return true;
                $needle = strtolower($q);
                $hay = strtolower(implode(' ', array_filter([
                    (string) ($m['title'] ?? ''),
                    (string) ($m['subject'] ?? ''),
                    (string) ($m['grade'] ?? ''),
                ])));
                return str_contains($hay, $needle);
            })
            ->values();

        return view('public.modul', [
            'modules' => $filtered,
            'q' => $q,
            'grade' => $grade,
            'grades' => $grades,
        ]);
    }

    public function modulDownload(Request $request, Record $record)
    {
        if ($record->type !== 'modules') abort(404);
        $data = is_array($record->data) ? $record->data : [];
        $downloads = (int) ($data['downloads'] ?? 0);
        $data['downloads'] = $downloads + 1;
        $record->forceFill(['data' => $data])->save();

        $url = (string) ($data['url'] ?? '');
        if ($url === '') {
            return redirect()->route('modul')->with('error', 'File belum tersedia.');
        }
        return redirect()->away($url);
    }

    public function refleksiIndex(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $all = $this->fetchRecords('reflections');
        $filtered = $all
            ->filter(function ($r) use ($q) {
                if (!is_array($r)) return false;
                if ($q === '') return true;
                $needle = strtolower($q);
                $hay = strtolower(implode(' ', array_filter([
                    (string) ($r['title'] ?? ''),
                    (string) ($r['author'] ?? ''),
                    (string) ($r['excerpt'] ?? ''),
                ])));
                return str_contains($hay, $needle);
            })
            ->values();

        return view('public.refleksi.index', [
            'reflections' => $filtered,
            'q' => $q,
        ]);
    }

    public function refleksiShow(string $slug)
    {
        $r = $this->findBySlug('reflections', $slug);
        if (!$r) abort(404);

        $related = $this->fetchRecords('reflections')
            ->filter(fn ($x) => is_array($x) && ($x['id'] ?? null) !== ($r['id'] ?? null))
            ->take(3)
            ->values();

        return view('public.refleksi.show', [
            'r' => $r,
            'related' => $related,
        ]);
    }

    public function pengumuman()
    {
        $all = $this->fetchRecords('announcements');
        $pinned = $all->filter(fn ($a) => is_array($a) && (($a['pinned'] ?? false) === true))->values();
        $rest = $all->filter(fn ($a) => is_array($a) && !(($a['pinned'] ?? false) === true))->values();

        return view('public.pengumuman', [
            'pinned' => $pinned,
            'rest' => $rest,
        ]);
    }

    public function faq(Request $request)
    {
        $cat = (string) $request->query('cat', 'Semua');
        $all = $this->fetchRecords('faqs');
        $cats = $all
            ->map(fn ($f) => is_array($f) ? ($f['category'] ?? null) : null)
            ->filter(fn ($c) => is_string($c) && trim($c) !== '')
            ->unique()
            ->sort()
            ->values()
            ->all();

        $filtered = $all
            ->filter(function ($f) use ($cat) {
                if (!is_array($f)) return false;
                if ($cat === 'Semua') return true;
                return (string) ($f['category'] ?? '') === $cat;
            })
            ->values();

        return view('public.faq', [
            'faqs' => $filtered,
            'cat' => $cat,
            'categories' => $cats,
        ]);
    }

    public function search(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $needle = strtolower($q);

        $results = collect();
        if ($needle !== '') {
            $sources = [
                ['type' => 'news', 'label' => 'Berita'],
                ['type' => 'teachers', 'label' => 'Guru & Staff'],
                ['type' => 'modules', 'label' => 'Modul'],
                ['type' => 'galleries', 'label' => 'Galeri'],
                ['type' => 'events', 'label' => 'Agenda'],
                ['type' => 'faqs', 'label' => 'FAQ'],
                ['type' => 'extracurriculars', 'label' => 'Ekstrakurikuler'],
                ['type' => 'reflections', 'label' => 'Refleksi'],
                ['type' => 'announcements', 'label' => 'Pengumuman'],
                ['type' => 'studentWorks', 'label' => 'Karya Siswa'],
                ['type' => 'programStudies', 'label' => 'Program Studi'],
            ];

            foreach ($sources as $s) {
                $items = $this->fetchRecords($s['type']);
                foreach ($items as $it) {
                    if (!is_array($it)) continue;
                    $hay = strtolower(json_encode($it, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
                    if (!str_contains($hay, $needle)) continue;

                    $url = '/';
                    if ($s['type'] === 'news') $url = '/berita/' . ($it['slug'] ?? ($it['id'] ?? ''));
                    elseif ($s['type'] === 'teachers') $url = '/guru/' . ($it['slug'] ?? ($it['id'] ?? ''));
                    elseif ($s['type'] === 'galleries') $url = '/galeri/' . ($it['id'] ?? '');
                    elseif ($s['type'] === 'reflections') $url = '/refleksi/' . ($it['slug'] ?? ($it['id'] ?? ''));
                    elseif ($s['type'] === 'extracurriculars') $url = '/ekstrakurikuler?' . http_build_query(['cat' => $it['slug'] ?? null]);
                    elseif ($s['type'] === 'faqs') $url = '/faq?' . http_build_query(['cat' => $it['category'] ?? null]);
                    elseif ($s['type'] === 'programStudies') $url = '/program-studi';
                    elseif ($s['type'] === 'modules') $url = '/modul?' . http_build_query(['q' => $q]);
                    elseif ($s['type'] === 'events') $url = '/agenda?' . http_build_query(['q' => $q]);
                    elseif ($s['type'] === 'announcements') $url = '/pengumuman';
                    elseif ($s['type'] === 'studentWorks') $url = '/karya-siswa?' . http_build_query(['q' => $q]);

                    $title = (string) ($it['title'] ?? $it['name'] ?? $it['q'] ?? 'Item');
                    $snippet = (string) ($it['excerpt'] ?? $it['description'] ?? $it['content'] ?? $it['a'] ?? '');
                    $snippet = trim(preg_replace('/\s+/', ' ', $snippet));
                    if (mb_strlen($snippet) > 160) $snippet = mb_substr($snippet, 0, 160) . '…';

                    $results->push([
                        'type' => $s['type'],
                        'label' => $s['label'],
                        'title' => $title,
                        'snippet' => $snippet,
                        'url' => $url,
                    ]);
                    if ($results->count() >= 50) break 2;
                }
            }
        }

        return view('public.search', [
            'q' => $q,
            'results' => $results->values()->all(),
        ]);
    }
}
