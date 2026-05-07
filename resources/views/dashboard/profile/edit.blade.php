@extends('dashboard.shell')

@section('dashboard')
    <div class="max-w-4xl" data-testid="profile-page">
        <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">{{ $section ?? 'Akun' }}</div>
        <h1 class="font-display text-4xl font-extrabold text-brand-950 mt-2 tracking-tight">Profil Saya</h1>
        <div class="mt-2 text-sm text-slate-600">Perbarui informasi dasar akun kamu.</div>

        @if (session('success'))
            <div class="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{{ session('success') }}</div>
        @endif
        @if ($errors->any())
            <div class="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                <div class="font-bold">Ada error pada input:</div>
                <ul class="list-disc pl-5 mt-2 space-y-1">
                    @foreach ($errors->all() as $e)
                        <li>{{ $e }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div class="mt-8 bg-white rounded-3xl border border-slate-100 p-6">
            <form method="POST" action="{{ request()->path() }}" class="space-y-4">
                @csrf
                <div class="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Nama</label>
                        <input name="name" value="{{ old('name', $user?->name ?? '') }}" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    </div>
                    <div>
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Email</label>
                        <input value="{{ $user?->email ?? '' }}" disabled class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 text-slate-500" />
                    </div>
                    <div>
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-600">No. HP (opsional)</label>
                        <input name="phone" value="{{ old('phone', $user?->phone ?? '') }}" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    </div>
                    <div>
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Jabatan (opsional)</label>
                        <input name="position" value="{{ old('position', $user?->position ?? '') }}" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    </div>
                    <div class="sm:col-span-2">
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Kelas (opsional)</label>
                        <input name="class_name" value="{{ old('class_name', $user?->class_name ?? '') }}" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    </div>
                    <div class="sm:col-span-2">
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Bio (opsional)</label>
                        <textarea name="bio" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm min-h-32">{{ old('bio', $user?->bio ?? '') }}</textarea>
                    </div>
                    <div class="sm:col-span-2">
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Avatar URL (opsional)</label>
                        <input name="avatar_url" value="{{ old('avatar_url', $user?->avatar_url ?? '') }}" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    </div>
                </div>

                <div class="mt-2 border-t border-slate-100 pt-5">
                    <div class="text-xs font-bold uppercase tracking-wider text-slate-600">Ubah Password (opsional)</div>
                    <div class="grid sm:grid-cols-2 gap-4 mt-3">
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Password Baru</label>
                            <input name="password" type="password" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                        </div>
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Konfirmasi Password</label>
                            <input name="password_confirmation" type="password" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                        </div>
                    </div>
                </div>

                <div class="pt-2 flex items-center justify-end">
                    <button type="submit" class="rounded-xl gradient-brand gradient-brand-hover text-white px-6 py-3 text-sm font-bold">Simpan</button>
                </div>
            </form>
        </div>
    </div>
@endsection

