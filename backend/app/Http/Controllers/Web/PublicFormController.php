<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Record;
use Illuminate\Http\Request;

class PublicFormController extends Controller
{
    public function contact(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'date' => now()->toDateString(),
            'read' => false,
        ];

        Record::query()->create([
            'type' => 'contactMessages',
            'data' => $data,
        ]);

        return redirect()->route('kontak')->with('success', 'Pesan Anda telah terkirim!');
    }

    public function ppdb(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'school' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
        ]);

        $data = [
            'name' => $validated['name'],
            'school' => $validated['school'],
            'phone' => $validated['phone'],
            'status' => 'Proses',
            'date' => now()->toDateString(),
        ];

        Record::query()->create([
            'type' => 'ppdbRegistrants',
            'data' => $data,
        ]);

        return redirect()
            ->route('ppdb')
            ->with('ppdb_success', true)
            ->with('ppdb_name', $validated['name'])
            ->with('ppdb_email', (string) $request->input('email', ''))
            ->with('ppdb_no', 'PPDB-2025-' . (string) random_int(1000, 9999));
    }
}

