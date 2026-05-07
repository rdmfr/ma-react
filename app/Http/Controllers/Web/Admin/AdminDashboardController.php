<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Record;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function __invoke()
    {
        $stats = [
            'users' => User::count(),
            'teachers' => Record::where('type', 'teachers')->count(),
            'students' => Record::where('type', 'students')->count(),
            'news' => Record::where('type', 'news')->count(),
            'events' => Record::where('type', 'events')->count(),
            'galleries' => Record::where('type', 'galleries')->count(),
            'messages' => Record::where('type', 'messages')->count(),
            'approval_queue' => Record::where('data->status', 'pending')->count(),
            'students_ipa' => Record::where('type', 'students')->where('data->jurusan', 'IPA')->count(),
            'students_iai' => Record::where('type', 'students')->where('data->jurusan', 'IAI')->count(),
        ];

        $recent_activity = Record::orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'type' => $r->type,
                    'label' => $this->getTypeLabel($r->type),
                    'time' => $r->updated_at->diffForHumans(),
                    'data' => $r->data,
                ];
            });

        return view('dashboard.admin.overview', compact('stats', 'recent_activity'));
    }

    private function getTypeLabel($type)
    {
        return [
            'news' => 'Berita',
            'events' => 'Agenda',
            'teachers' => 'Guru',
            'students' => 'Siswa',
            'galleries' => 'Galeri',
            'studentWorks' => 'Karya Siswa',
            'academicYears' => 'Tahun Ajaran',
            'subjects' => 'Mata Pelajaran',
            'branding' => 'Pengaturan',
        ][$type] ?? ucfirst($type);
    }
}
