<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUsersController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $role = (string) $request->query('role', 'all');

        $query = User::query()->orderByDesc('id');

        if ($role !== '' && $role !== 'all') {
            $query->where('role', $role);
        }

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', '%' . $q . '%')
                    ->orWhere('email', 'like', '%' . $q . '%');
            });
        }

        $users = $query->paginate(12)->withQueryString();

        return view('dashboard.admin.users.index', [
            'users' => $users,
            'q' => $q,
            'role' => $role,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', Rule::in(['admin', 'teacher', 'osis'])],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'password' => ['required', 'string', 'min:6', 'max:255'],
            'avatar_url' => ['nullable', 'url', 'max:500'],
        ], [
            'name.required' => 'Nama wajib diisi',
            'email.unique' => 'Email sudah digunakan',
            'password.required' => 'Password wajib diisi',
        ]);

        User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'status' => $validated['status'],
            'password' => Hash::make($validated['password']),
            'avatar_url' => $validated['avatar_url'] ?? null,
        ]);

        return redirect()->route('admin.users')->with('success', 'Pengguna berhasil dibuat.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin', 'teacher', 'osis'])],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'password' => ['nullable', 'string', 'min:6', 'max:255'],
            'avatar_url' => ['nullable', 'url', 'max:500'],
        ]);

        $user->forceFill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'status' => $validated['status'],
            'avatar_url' => $validated['avatar_url'] ?? null,
        ]);

        if (isset($validated['password']) && $validated['password'] !== null && $validated['password'] !== '') {
            $user->forceFill(['password' => Hash::make($validated['password'])]);
        }

        $user->save();

        return redirect()->route('admin.users')->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy(Request $request, User $user)
    {
        if ((int) $user->id === (int) ($request->user()?->id ?? 0)) {
            return redirect()->route('admin.users')->with('error', 'Tidak bisa menghapus akun sendiri.');
        }

        $user->delete();

        return redirect()->route('admin.users')->with('success', 'Pengguna berhasil dihapus.');
    }
}

