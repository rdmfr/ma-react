<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
            return response()->json(['message' => 'Email atau kata sandi salah'], 401);
        }

        $user = $request->user();
        $user->forceFill(['last_login_at' => now()])->save();

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
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
            ],
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

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

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->currentAccessToken()?->delete();
        }
        return response()->json(['status' => 'ok']);
    }
}
