<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Record;
use Illuminate\Support\Collection;

class HomeController extends Controller
{
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

    public function __invoke()
    {
        $news = $this->fetchRecords('news')->take(3)->values();
        $events = $this->fetchRecords('events')->take(4)->values();
        $teachers = $this->fetchRecords('teachers')
            ->filter(fn ($t) => is_array($t) && (($t['is_featured'] ?? false) === true))
            ->take(4)
            ->values();
        $studentWorks = $this->fetchRecords('studentWorks')->take(6)->values();
        $programStudies = $this->fetchRecords('programStudies')->take(2)->values();
        $alumni = $this->fetchRecords('alumni')->values();
        $galleries = $this->fetchRecords('galleries')->take(6)->values();
        $studentCount = Record::where('type', 'students')->count();

        return view('public.home', [
            'news' => $news,
            'events' => $events,
            'teachers' => $teachers,
            'studentWorks' => $studentWorks,
            'programStudies' => $programStudies,
            'alumni' => $alumni,
            'galleries' => $galleries,
            'studentCount' => $studentCount,
        ]);
    }
}
