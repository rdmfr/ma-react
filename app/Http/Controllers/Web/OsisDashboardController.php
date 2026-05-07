<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Record;

class OsisDashboardController extends Controller
{
    public function __invoke()
    {
        // Stats for OSIS
        $stats = [
            'events' => Record::where('type', 'events')->count(),
            'galleries' => Record::where('type', 'galleries')->count(),
            'announcements' => Record::where('type', 'announcements')->count(),
            'student_works' => Record::where('type', 'studentWorks')->count(),
        ];

        $upcoming_events = Record::where('type', 'events')
            ->where('data->date', '>=', date('Y-m-d'))
            ->orderBy('data->date', 'asc')
            ->take(5)
            ->get();

        return view('dashboard.osis.overview', compact('stats', 'upcoming_events'));
    }
}
