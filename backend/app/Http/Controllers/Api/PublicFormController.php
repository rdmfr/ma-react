<?php

namespace App\Http\Controllers\Api;

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

        $record = Record::query()->create([
            'type' => 'contactMessages',
            'data' => $data,
        ]);

        return response()->json(array_merge(['id' => $record->id], $record->data ?? []), 201);
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

        $record = Record::query()->create([
            'type' => 'ppdbRegistrants',
            'data' => $data,
        ]);

        return response()->json(array_merge(['id' => $record->id], $record->data ?? []), 201);
    }
}

