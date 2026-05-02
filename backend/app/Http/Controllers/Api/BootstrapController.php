<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Record;
use App\Models\User;
use Illuminate\Http\Request;

class BootstrapController extends Controller
{
    private function getTypes(string $scope): array
    {
        if ($scope === 'public') {
            return [
                'teachers',
                'news',
                'reflections',
                'events',
                'announcements',
                'extracurriculars',
                'studentWorks',
                'programStudies',
                'alumni',
                'galleries',
                'faqs',
                'modules',
            ];
        }

        if ($scope === 'admin') {
            return [
                'subjects',
                'teachers',
                'students',
                'classes',
                'academicYears',
                'scores',
                'approvalQueue',
                'ppdbRegistrants',
                'contactMessages',
                'notifications',
                'activityLog',
                'modules',
                'contentItems',
            ];
        }

        if ($scope === 'teacher') {
            return [
                'classes',
                'scores',
                'modules',
                'evaluations',
                'submissions',
                'notifications',
            ];
        }

        if ($scope === 'osis') {
            return [
                'announcements',
                'events',
                'galleries',
                'studentWorks',
                'extracurriculars',
                'notifications',
            ];
        }

        return [];
    }

    private function fetchByTypes(array $types): array
    {
        $byType = Record::query()
            ->whereIn('type', $types)
            ->orderByDesc('updated_at')
            ->get()
            ->groupBy('type');

        $out = [];
        foreach ($types as $type) {
            $items = $byType->get($type, collect())
                ->map(fn (Record $r) => array_merge(['id' => $r->id], $r->data ?? []))
                ->values()
                ->all();
            $out[$type] = $items;
        }

        return $out;
    }

    public function public()
    {
        $types = $this->getTypes('public');
        $data = $this->fetchByTypes($types);
        foreach ($data as $type => $items) {
            if (!is_array($items)) continue;
            $data[$type] = collect($items)
                ->filter(function ($it) {
                    if (!is_array($it)) return false;
                    if (!array_key_exists('status', $it) || $it['status'] === null || $it['status'] === '') return true;
                    return $it['status'] === 'approved';
                })
                ->values()
                ->all();
        }
        return response()->json($data);
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $scope = $user->role;
        if ($scope === 'admin') {
            $types = $this->getTypes('admin');
            $data = $this->fetchByTypes($types);
            $data['users'] = User::query()
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'role', 'status', 'avatar_url', 'last_login_at'])
                ->map(function (User $u) {
                    return [
                        'id' => $u->id,
                        'name' => $u->name,
                        'email' => $u->email,
                        'role' => $u->role,
                        'status' => $u->status,
                        'lastLogin' => optional($u->last_login_at)->toISOString(),
                    ];
                })
                ->values();
            return response()->json($data);
        }

        $types = $this->getTypes($scope);
        return response()->json($this->fetchByTypes($types));
    }
}
