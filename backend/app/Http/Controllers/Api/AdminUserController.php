<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index()
    {
        return User::query()
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
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['required', 'string', 'max:32', Rule::in(['admin', 'teacher', 'osis'])],
            'status' => ['nullable', 'string', 'max:32'],
            'avatar_url' => ['nullable', 'string', 'max:2048'],
        ]);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'status' => $validated['status'] ?? 'active',
            'avatar_url' => $validated['avatar_url'] ?? null,
        ]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'status' => $user->status,
            'lastLogin' => optional($user->last_login_at)->toISOString(),
        ], 201);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['sometimes', 'string', 'max:32', Rule::in(['admin', 'teacher', 'osis'])],
            'status' => ['sometimes', 'string', 'max:32'],
            'avatar_url' => ['nullable', 'string', 'max:2048'],
        ]);

        if (array_key_exists('password', $validated) && $validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->forceFill($validated)->save();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'status' => $user->status,
            'lastLogin' => optional($user->last_login_at)->toISOString(),
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        if ($request->user()?->id === $user->id) {
            return response()->json(['message' => 'Cannot delete current user'], 422);
        }

        $user->tokens()->delete();
        $user->delete();
        return response()->json(['status' => 'ok']);
    }
}

