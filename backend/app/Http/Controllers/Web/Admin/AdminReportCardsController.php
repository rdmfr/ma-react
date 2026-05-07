<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Record;
use Illuminate\Http\Request;

class AdminReportCardsController extends Controller
{
    public function index(Request $request)
    {
        $classes = Record::query()
            ->where('type', 'classes')
            ->orderBy('data->grade')
            ->orderBy('data->name')
            ->get()
            ->map(function (Record $r) {
                $data = is_array($r->data) ? $r->data : [];
                return array_merge(['id' => $r->id], $data);
            })
            ->values();

        $subjects = Record::query()
            ->where('type', 'subjects')
            ->orderBy('data->name')
            ->get()
            ->map(function (Record $r) {
                $data = is_array($r->data) ? $r->data : [];
                return array_merge(['id' => $r->id], $data);
            })
            ->values();

        $students = Record::query()
            ->where('type', 'students')
            ->orderBy('data->class')
            ->orderBy('data->name')
            ->get()
            ->map(function (Record $r) {
                $data = is_array($r->data) ? $r->data : [];
                return array_merge(['id' => $r->id], $data);
            })
            ->values();

        $scores = Record::query()
            ->where('type', 'scores')
            ->orderByDesc('updated_at')
            ->get()
            ->map(function (Record $r) {
                $data = is_array($r->data) ? $r->data : [];
                return array_merge(['id' => $r->id], $data);
            })
            ->values();

        return view('dashboard.admin.report-cards.index', [
            'classes' => $classes,
            'subjects' => $subjects,
            'students' => $students,
            'scores' => $scores,
        ]);
    }
}

