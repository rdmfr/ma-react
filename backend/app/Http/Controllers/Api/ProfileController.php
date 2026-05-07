<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'avatar_url' => ['nullable', 'string', 'max:2048'],
            'phone' => ['nullable', 'string', 'max:32'],
            'bio' => ['nullable', 'string', 'max:5000'],
            'class_name' => ['nullable', 'string', 'max:64'],
            'position' => ['nullable', 'string', 'max:64'],
        ]);

        $user->forceFill($validated)->save();

        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'name' => $user->name,
            'avatar' => $user->avatar_url,
            'status' => $user->status,
            'lastLogin' => optional($user->last_login_at)->toISOString(),
            'phone' => $user->phone,
            'bio' => $user->bio,
            'class' => $user->class_name,
            'position' => $user->position,
        ]);
    }

    public function avatar(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'avatar' => ['required', 'file', 'image', 'max:5120'],
        ]);

        $file = $validated['avatar'];
        $path = Storage::disk('public')->putFile('uploads/avatars/' . $user->id, $file);
        $user->forceFill(['avatar_url' => Storage::url($path)])->save();

        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'name' => $user->name,
            'avatar' => $user->avatar_url,
            'status' => $user->status,
            'lastLogin' => optional($user->last_login_at)->toISOString(),
            'phone' => $user->phone,
            'bio' => $user->bio,
            'class' => $user->class_name,
            'position' => $user->position,
        ]);
    }
}
