@extends('layouts.auth')

@section('content')
    <div class="min-h-screen flex items-center justify-center bg-[#fbfcf9] p-6 relative overflow-hidden" data-testid="reset-page">
        <div class="absolute -top-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-brand-100/70 blur-3xl"></div>
        <div class="w-full max-w-md relative">
            <a href="/login" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 mb-8"><i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali</a>
            <div class="flex items-center gap-3 mb-8">
                <div class="w-12 h-12 rounded-xl bg-white border border-brand-100 p-2"><img src="{{ $branding['logoUrl'] ?? '' }}" alt="{{ $branding['schoolName'] ?? '' }}" class="w-full h-full object-contain"></div>
                <div class="font-display font-extrabold text-brand-950">{{ $branding['schoolName'] ?? '' }}</div>
            </div>

            <h1 class="font-display text-3xl font-extrabold text-brand-950">Atur Ulang Kata Sandi</h1>
            <p class="text-slate-600 mt-2 text-sm">Buat kata sandi baru yang aman dan mudah diingat.</p>

            @if ($errors->any())
                <div class="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 font-semibold">{{ $errors->first() }}</div>
            @endif

            <form method="POST" action="{{ route('password.update') }}" class="mt-7 space-y-4">
                @csrf
                <input type="hidden" name="token" value="{{ $token }}">
                <div>
                    <label class="block text-sm font-semibold text-brand-950 mb-2">Email</label>
                    <input required type="email" name="email" value="{{ old('email', $email ?? '') }}" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-brand-950 mb-2">Kata Sandi Baru</label>
                    <div class="relative">
                        <i data-lucide="lock" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input required type="password" name="password" data-testid="reset-p1" placeholder="••••••••" class="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-brand-950 mb-2">Ulangi Kata Sandi</label>
                    <div class="relative">
                        <i data-lucide="lock" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input required type="password" name="password_confirmation" data-testid="reset-p2" placeholder="••••••••" class="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none">
                    </div>
                </div>
                <button type="submit" data-testid="reset-submit" class="w-full rounded-xl gradient-brand gradient-brand-hover text-white py-3.5 font-bold shadow-lg shadow-brand-900/20">Perbarui Kata Sandi</button>
            </form>
        </div>
    </div>
@endsection

