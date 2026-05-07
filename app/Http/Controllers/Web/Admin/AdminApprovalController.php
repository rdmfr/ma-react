<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Record;
use Illuminate\Http\Request;

class AdminApprovalController extends Controller
{
    public function index()
    {
        $pending = Record::where('data->status', 'pending')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'type' => $r->type,
                    'label' => $this->getTypeLabel($r->type),
                    'data' => $r->data,
                    'time' => $r->updated_at->diffForHumans(),
                ];
            });

        return view('dashboard.admin.approval', compact('pending'));
    }

    public function approve(Record $record)
    {
        $data = $record->data;
        $data['status'] = 'approved';
        $record->data = $data;
        $record->save();

        return redirect()->back()->with('success', 'Konten berhasil disetujui.');
    }

    public function reject(Record $record)
    {
        $data = $record->data;
        $data['status'] = 'draft';
        $record->data = $data;
        $record->save();

        return redirect()->back()->with('success', 'Konten ditolak dan dikembalikan ke draft.');
    }

    private function getTypeLabel($type)
    {
        return [
            'news' => 'Berita',
            'events' => 'Agenda',
            'galleries' => 'Galeri',
            'studentWorks' => 'Karya Siswa',
            'announcements' => 'Pengumuman',
        ][$type] ?? ucfirst($type);
    }
}
