<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RecordController extends Controller
{
    private const EXTRACURRICULAR_CATEGORIES = [
        'multimedia',
        'pmr',
        'pramuka',
        'marawiss',
        'hadroh',
        'olahraga',
        'kesenian',
    ];

    private function logActivity(Request $request, string $action, string $target): void
    {
        try {
            $user = $request->user();
            Record::query()->create([
                'type' => 'activityLog',
                'data' => [
                    'user' => $user?->email ?? $user?->name ?? 'system',
                    'action' => strtoupper($action),
                    'target' => $target,
                    'date' => now()->format('Y-m-d H:i'),
                ],
            ]);
        } catch (\Throwable $e) {
        }
    }

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
            'file' => ['nullable', 'file', 'max:20480', 'mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,csv,png,jpg,jpeg,webp,gif'],
            'file_field' => ['nullable', 'string', 'max:64'],
        ], [
            'type.required' => 'Type wajib diisi',
            'type.max' => 'Type maksimal 64 karakter',
            'data.required' => 'Data wajib diisi',
            'photo.file' => 'File foto tidak valid',
            'photo.image' => 'File harus berupa gambar (jpg, png, webp, gif)',
            'photo.max' => 'Foto maksimal 5MB',
            'file.file' => 'File tidak valid',
            'file.max' => 'File maksimal 20MB',
            'file.mimes' => 'Format file tidak didukung',
        ]);

        $data = $validated['data'];
        if (is_string($data)) {
            try {
                $data = json_decode($data, true);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Data JSON tidak valid', 'errors' => ['data' => 'JSON tidak valid']], 422);
            }
        }
        
        if (!is_array($data)) {
            return response()->json(['message' => 'Field data harus berupa object', 'errors' => ['data' => 'Field data harus berupa object']], 422);
        }

        // Validate type-specific required fields
        $typeValidation = $this->validateDataByType($validated['type'], $data);
        if (!$typeValidation['valid']) {
            return response()->json(['message' => 'Data tidak valid', 'errors' => $typeValidation['errors']], 422);
        }

        // Sanitize data
        $data = $this->sanitizeData($data);

        try {
            $photo = $request->file('photo');
            if ($photo) {
                $path = Storage::disk('public')->putFile('uploads/' . $validated['type'], $photo);
                $data['photo'] = Storage::url($path);
            }

            $file = $request->file('file');
            if ($file) {
                $path = Storage::disk('public')->putFile('uploads/' . $validated['type'], $file);
                $field = $validated['file_field'] ?? 'photo';
                $data[$field] = Storage::url($path);
            }

            $record = Record::query()->create([
                'type' => $validated['type'],
                'data' => $data,
            ]);

            if ($validated['type'] !== 'activityLog') {
                $this->logActivity($request, 'create', $validated['type'] . '/' . $record->id);
            }

            return response()->json(array_merge(['id' => $record->id], $record->data ?? []), 201);
        } catch (\Throwable $e) {
            \Log::error('RecordController@store error', ['error' => $e->getMessage(), 'type' => $validated['type']]);
            return response()->json(['message' => 'Gagal menyimpan data. Silakan coba lagi.', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Record $record)
    {
        $validated = $request->validate([
            'data' => ['required'],
            'photo' => ['nullable', 'file', 'image', 'max:5120'],
            'file' => ['nullable', 'file', 'max:20480', 'mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,csv,png,jpg,jpeg,webp,gif'],
            'file_field' => ['nullable', 'string', 'max:64'],
        ], [
            'data.required' => 'Data wajib diisi',
            'photo.file' => 'File foto tidak valid',
            'photo.image' => 'File harus berupa gambar',
            'photo.max' => 'Foto maksimal 5MB',
            'file.file' => 'File tidak valid',
            'file.max' => 'File maksimal 20MB',
            'file.mimes' => 'Format file tidak didukung',
        ]);

        $data = $validated['data'];
        if (is_string($data)) {
            try {
                $data = json_decode($data, true);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Data JSON tidak valid', 'errors' => ['data' => 'JSON tidak valid']], 422);
            }
        }
        
        if (!is_array($data)) {
            return response()->json(['message' => 'Field data harus berupa object', 'errors' => ['data' => 'Field data harus berupa object']], 422);
        }

        // Validate type-specific required fields
        $typeValidation = $this->validateDataByType($record->type, $data);
        if (!$typeValidation['valid']) {
            return response()->json(['message' => 'Data tidak valid', 'errors' => $typeValidation['errors']], 422);
        }

        // Sanitize data
        $data = $this->sanitizeData($data);

        try {
            $photo = $request->file('photo');
            if ($photo) {
                $path = Storage::disk('public')->putFile('uploads/' . $record->type, $photo);
                $data['photo'] = Storage::url($path);
            }

            $file = $request->file('file');
            if ($file) {
                $path = Storage::disk('public')->putFile('uploads/' . $record->type, $file);
                $field = $validated['file_field'] ?? 'photo';
                $data[$field] = Storage::url($path);
            }

            $record->forceFill(['data' => $data])->save();

            if ($record->type !== 'activityLog') {
                $this->logActivity($request, 'update', $record->type . '/' . $record->id);
            }

            return response()->json(array_merge(['id' => $record->id], $record->data ?? []));
        } catch (\Throwable $e) {
            \Log::error('RecordController@update error', ['error' => $e->getMessage(), 'id' => $record->id]);
            return response()->json(['message' => 'Gagal memperbarui data. Silakan coba lagi.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, Record $record)
    {
        $type = $record->type;
        $id = $record->id;
        $record->delete();
        if ($type !== 'activityLog') {
            $this->logActivity($request, 'delete', $type . '/' . $id);
        }
        return response()->json(['status' => 'ok']);
    }

    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'updates' => ['required', 'array', 'min:1', 'max:200'],
            'updates.*.id' => ['required', 'uuid'],
            'updates.*.data' => ['required', 'array'],
        ]);

        $updates = collect($validated['updates'] ?? []);
        $ids = $updates->pluck('id')->values()->all();
        $records = Record::query()->whereIn('id', $ids)->get()->keyBy('id');

        $touched = 0;
        foreach ($updates as $u) {
            $id = $u['id'];
            $data = $u['data'];
            /** @var Record|null $rec */
            $rec = $records->get($id);
            if (!$rec) continue;
            $rec->forceFill(['data' => $data])->save();
            $touched++;
            if ($rec->type !== 'activityLog') {
                $this->logActivity($request, 'update', $rec->type . '/' . $rec->id);
            }
        }

        return response()->json(['status' => 'ok', 'updated' => $touched]);
    }

    /**
     * Validate data fields based on record type
     * @return array {valid: bool, errors: array}
     */
    private function validateDataByType(string $type, array $data): array
    {
        $errors = [];

        switch ($type) {
            case 'branding':
                if (empty($data['schoolName'])) {
                    $errors['schoolName'] = 'Nama sekolah wajib diisi';
                }
                break;

            case 'teachers':
                if (empty($data['name'])) {
                    $errors['name'] = 'Nama guru wajib diisi';
                }
                if (empty($data['subject'])) {
                    $errors['subject'] = 'Mata pelajaran wajib diisi';
                }
                break;

            case 'extracurriculars':
                if (empty($data['name'])) {
                    $errors['name'] = 'Nama ekstrakurikuler wajib diisi';
                }
                if (empty($data['slug'])) {
                    $errors['slug'] = 'Slug wajib diisi';
                }
                break;

            case 'programStudies':
                if (empty($data['name'])) {
                    $errors['name'] = 'Nama jurusan/program wajib diisi';
                }
                break;

            case 'galleries':
                if (empty($data['title'])) {
                    $errors['title'] = 'Judul galeri wajib diisi';
                }
                if (empty($data['category'])) {
                    $errors['category'] = 'Kategori galeri wajib diisi';
                } elseif (!in_array($data['category'], self::EXTRACURRICULAR_CATEGORIES, true)) {
                    $errors['category'] = 'Kategori galeri tidak valid';
                }
                break;

            case 'students':
                if (empty($data['nis'])) {
                    $errors['nis'] = 'NIS wajib diisi';
                }
                if (empty($data['name'])) {
                    $errors['name'] = 'Nama siswa wajib diisi';
                }
                if (empty($data['class'])) {
                    $errors['class'] = 'Kelas wajib diisi';
                }
                break;

            case 'users':
                if (empty($data['email'])) {
                    $errors['email'] = 'Email wajib diisi';
                }
                if (empty($data['name'])) {
                    $errors['name'] = 'Nama wajib diisi';
                }
                if (empty($data['role'])) {
                    $errors['role'] = 'Role wajib diisi';
                }
                break;
        }

        return [
            'valid' => count($errors) === 0,
            'errors' => $errors,
        ];
    }

    /**
     * Sanitize data to remove null/undefined values and trim strings
     */
    private function sanitizeData(array $data): array
    {
        $sanitized = [];
        foreach ($data as $key => $value) {
            // Skip null/undefined
            if ($value === null || $value === '') {
                continue;
            }
            // Trim strings
            if (is_string($value)) {
                $value = trim($value);
                if ($value === '') {
                    continue;
                }
            }
            $sanitized[$key] = $value;
        }
        return $sanitized;
    }
}
