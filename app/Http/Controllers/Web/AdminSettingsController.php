<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class AdminSettingsController extends Controller
{
    private function sanitize(array $data): array
    {
        $out = [];
        foreach ($data as $k => $v) {
            if ($v === null) continue;
            if (is_string($v)) {
                $v = trim($v);
                if ($v === '') continue;
            }
            $out[$k] = $v;
        }
        return $out;
    }

    private function absoluteUrl(string $url): string
    {
        if ($url === '' || preg_match('/^https?:\/\//i', $url)) {
            return $url;
        }
        return asset($url);
    }

    public function edit()
    {
        $record = Record::query()
            ->where('type', 'branding')
            ->orderByDesc('updated_at')
            ->first();

        $data = is_array($record?->data) ? $record->data : [];

        return view('dashboard.admin.settings', [
            'recordId' => $record?->id,
            'data' => $data,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'schoolName' => ['required', 'string', 'max:255'],
            'schoolShort' => ['nullable', 'string', 'max:64'],
            'schoolTagline' => ['nullable', 'string', 'max:255'],
            'accreditationLabel' => ['nullable', 'string', 'max:16'],
            'address' => ['nullable', 'string', 'max:500'],
            'email' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:64'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'facebook' => ['nullable', 'string', 'max:255'],
            'youtube' => ['nullable', 'string', 'max:255'],
            'mapEmbed' => ['nullable', 'string', 'max:5000'],
            'seo_keywords' => ['nullable', 'string', 'max:1000'],
            'heroAchievementTitle' => ['nullable', 'string', 'max:255'],
            'heroAchievementValue' => ['nullable', 'string', 'max:255'],
            'accentColor' => ['nullable', 'regex:/^#?[0-9a-fA-F]{6}$/'],
            'darkColor' => ['nullable', 'regex:/^#?[0-9a-fA-F]{6}$/'],
            'logo' => ['nullable', 'file', 'image', 'max:5120'],
            'heroImage' => ['nullable', 'file', 'image', 'max:5120'],
            'profileImage' => ['nullable', 'file', 'image', 'max:5120'],
        ], [
            'schoolName.required' => 'Nama sekolah wajib diisi',
            'accentColor.regex' => 'Format warna aksen tidak valid',
            'darkColor.regex' => 'Format warna gelap tidak valid',
            'logo.image' => 'Logo harus berupa gambar',
            'heroImage.image' => 'Hero image harus berupa gambar',
            'profileImage.image' => 'Foto profil harus berupa gambar',
        ]);

        $data = $this->sanitize([
            'schoolName' => $validated['schoolName'] ?? null,
            'schoolShort' => $validated['schoolShort'] ?? null,
            'schoolTagline' => $validated['schoolTagline'] ?? null,
            'accreditationLabel' => $validated['accreditationLabel'] ?? null,
            'address' => $validated['address'] ?? null,
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'instagram' => $validated['instagram'] ?? null,
            'facebook' => $validated['facebook'] ?? null,
            'youtube' => $validated['youtube'] ?? null,
            'mapEmbed' => $validated['mapEmbed'] ?? null,
            'seo_keywords' => $validated['seo_keywords'] ?? null,
            'heroAchievementTitle' => $validated['heroAchievementTitle'] ?? null,
            'heroAchievementValue' => $validated['heroAchievementValue'] ?? null,
            'accentColor' => isset($validated['accentColor']) ? ('#' . ltrim($validated['accentColor'], '#')) : null,
            'darkColor' => isset($validated['darkColor']) ? ('#' . ltrim($validated['darkColor'], '#')) : null,
        ]);

        $record = Record::query()
            ->where('type', 'branding')
            ->orderByDesc('updated_at')
            ->first();

        if (!$record) {
            $record = Record::query()->create([
                'type' => 'branding',
                'data' => [],
            ]);
        }

        $current = is_array($record->data) ? $record->data : [];

        $logo = $request->file('logo');
        if ($logo) {
            $path = Storage::disk('public')->putFile('uploads/branding', $logo);
            $data['logoUrl'] = $this->absoluteUrl(Storage::url($path));
        }

        $hero = $request->file('heroImage');
        if ($hero) {
            $path = Storage::disk('public')->putFile('uploads/branding', $hero);
            $data['heroImageUrl'] = $this->absoluteUrl(Storage::url($path));
        }

        $profile = $request->file('profileImage');
        if ($profile) {
            $path = Storage::disk('public')->putFile('uploads/branding', $profile);
            $data['profileImageUrl'] = $this->absoluteUrl(Storage::url($path));
        }

        $record->forceFill([
            'data' => array_merge($current, $data),
        ])->save();

        Cache::forget('branding.v1');

        return redirect()->route('admin.settings')->with('success', 'Pengaturan berhasil disimpan.');
    }
}

