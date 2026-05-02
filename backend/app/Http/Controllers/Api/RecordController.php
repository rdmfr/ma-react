<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RecordController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'max:64'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:1000'],
        ]);

        $limit = $validated['limit'] ?? 1000;

        return Record::query()
            ->where('type', $validated['type'])
            ->orderByDesc('updated_at')
            ->limit($limit)
            ->get()
            ->map(fn (Record $r) => array_merge(['id' => $r->id], $r->data ?? []))
            ->values();
    }

    public function show(Record $record)
    {
        return response()->json(array_merge(['id' => $record->id], $record->data ?? []));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'max:64'],
            'data' => ['required'],
            'photo' => ['nullable', 'file', 'image', 'max:5120'],
        ]);

        $data = $validated['data'];
        if (is_string($data)) {
            $data = json_decode($data, true);
        }
        if (!is_array($data)) {
            return response()->json(['message' => 'Field data harus berupa object'], 422);
        }

        $photo = $request->file('photo');
        if ($photo) {
            $path = Storage::disk('public')->putFile('uploads/' . $validated['type'], $photo);
            $data['photo'] = Storage::url($path);
        }

        $record = Record::query()->create([
            'type' => $validated['type'],
            'data' => $data,
        ]);

        return response()->json(array_merge(['id' => $record->id], $record->data ?? []), 201);
    }

    public function update(Request $request, Record $record)
    {
        $validated = $request->validate([
            'data' => ['required', 'array'],
        ]);

        $record->forceFill(['data' => $validated['data']])->save();

        return response()->json(array_merge(['id' => $record->id], $record->data ?? []));
    }

    public function destroy(Record $record)
    {
        $record->delete();
        return response()->json(['status' => 'ok']);
    }
}
