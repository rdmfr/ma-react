<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Record;
use Illuminate\Support\Facades\Auth;

class TeacherDashboardController extends Controller
{
    public function __invoke()
    {
        $user = Auth::user();
        
        // Stats for teacher
        $stats = [
            'subjects' => Record::where('type', 'subjects')->where('data->teacher_id', $user->id)->count(),
            'students' => Record::where('type', 'students')->count(), // Total students
            'modules' => Record::where('type', 'modules')->where('data->author_id', $user->id)->count(),
            'scores_count' => Record::where('type', 'scores')->count(),
        ];

        $recent_scores = Record::where('type', 'scores')
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get();

        return view('dashboard.teacher.overview', compact('stats', 'recent_scores'));
    }
}
