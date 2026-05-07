<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DashboardProfileController extends Controller
{
    public function edit(Request $request)
    {
        $section = (string) $request->route('section', 'Akun');

        return view('dashboard.profile.edit', [
            'section' => $section,
            'user' => $request->user(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:64'],
            'position' => ['nullable', 'string', 'max:120'],
            'class_name' => ['nullable', 'string', 'max:120'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'avatar_url' => ['nullable', 'url', 'max:500'],
            'password' => ['nullable', 'string', 'min:6', 'max:255', 'confirmed'],
        ], [
            'password.confirmed' => 'Konfirmasi password tidak sama',
        ]);

        $user = $request->user();
        $user->forceFill([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'position' => $validated['position'] ?? null,
            'class_name' => $validated['class_name'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'avatar_url' => $validated['avatar_url'] ?? null,
        ]);

        if (isset($validated['password']) && $validated['password'] !== null && $validated['password'] !== '') {
            $user->forceFill(['password' => Hash::make($validated['password'])]);
        }

        $user->save();

        $prefix = (string) $request->segment(1);
        $route = match ($prefix) {
            'teacher' => 'teacher.profile',
            'osis' => 'osis.profile',
            default => 'admin.home',
        };

        return redirect()->route($route)->with('success', 'Profil berhasil disimpan.');
    }
}

