@php
    $demo = [
        ['role' => 'Admin', 'email' => 'admin@mapulosari.sch.id', 'password' => 'admin123'],
        ['role' => 'Guru', 'email' => 'guru@mapulosari.sch.id', 'password' => 'guru123'],
        ['role' => 'OSIS', 'email' => 'osis@mapulosari.sch.id', 'password' => 'osis123'],
    ];
@endphp

@extends('layouts.auth')

@section('content')
    <div class="min-h-screen flex bg-[#fbfcf9]" data-testid="login-page" x-data="{ show: false }">
        <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 text-white">
            <div class="absolute inset-0 noise-overlay opacity-30"></div>
            <div class="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-brand-400/20 blur-3xl"></div>
            <div class="absolute -bottom-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-emerald-300/15 blur-3xl"></div>
            <div class="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
                <a href="/" class="inline-flex items-center gap-3 w-fit">
                    <div class="w-12 h-12 rounded-xl bg-white p-2"><img src="{{ $branding['logoUrl'] ?? '' }}" alt="{{ $branding['schoolName'] ?? '' }}" class="w-full h-full object-contain"></div>
                    <div>
                        <div class="font-display font-extrabold text-xl">{{ $branding['schoolName'] ?? '' }}</div>
                        <div class="text-[11px] text-brand-300 uppercase tracking-wider">{{ $branding['schoolTagline'] ?? '' }}</div>
                    </div>
                </a>
                <div>
                    <div class="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-3 py-1 text-xs font-semibold">
                        <i data-lucide="sparkles" class="w-3 h-3 text-brand-300"></i> Sistem Akademik Terpadu
                    </div>
                    <h1 class="font-display text-5xl xl:text-6xl font-black mt-6 leading-[0.95] tracking-tight">
                        Selamat datang kembali,<br>
                        <span class="font-editorial italic font-semibold text-brand-300">keluarga besar.</span>
                    </h1>
                    <p class="mt-5 text-brand-100/85 max-w-md leading-relaxed">
                        Masuk untuk mengelola akademik, konten, dan administrasi {{ $branding['schoolName'] ?? '' }}. Satu portal untuk admin, guru, dan OSIS.
                    </p>
                </div>
                <div class="grid grid-cols-3 gap-4">
                    <div class="glass-dark rounded-2xl p-4">
                        <i data-lucide="shield-check" class="w-5 h-5 text-brand-300"></i>
                        <div class="text-sm font-bold mt-3">Aman</div>
                        <div class="text-xs text-brand-300">Enkripsi end-to-end</div>
                    </div>
                    <div class="glass-dark rounded-2xl p-4">
                        <div class="font-display font-black text-3xl">842+</div>
                        <div class="text-xs text-brand-300 mt-1">Siswa aktif</div>
                    </div>
                    <div class="glass-dark rounded-2xl p-4">
                        <div class="font-display font-black text-3xl">{{ $branding['accreditationLabel'] ?? 'B' }}</div>
                        <div class="text-xs text-brand-300 mt-1">Akreditasi</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex-1 flex items-center justify-center p-6 sm:p-10 relative overflow-hidden">
            <div class="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-brand-100/70 blur-3xl"></div>
            <div class="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-brand-50 blur-3xl"></div>
            <div class="w-full max-w-md relative">
                <div class="lg:hidden flex items-center gap-3 mb-10">
                    <div class="w-12 h-12 rounded-xl bg-white border border-brand-100 p-2"><img src="{{ $branding['logoUrl'] ?? '' }}" alt="{{ $branding['schoolName'] ?? '' }}" class="w-full h-full object-contain"></div>
                    <div>
                        <div class="font-display font-extrabold text-brand-950">{{ $branding['schoolName'] ?? '' }}</div>
                        <div class="text-xs text-brand-700">{{ $branding['schoolTagline'] ?? '' }}</div>
                    </div>
                </div>
                <h2 class="font-display text-4xl font-extrabold text-brand-950 tracking-tight">Masuk</h2>
                <p class="text-slate-600 mt-2">Silakan masuk untuk melanjutkan ke dashboard.</p>

                @if (session('reset_done'))
                    <div class="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                        <i data-lucide="check-circle-2" class="w-4 h-4 mt-0.5 shrink-0"></i> Kata sandi berhasil diperbarui. Silakan masuk.
                    </div>
                @endif

                @if ($errors->any())
                    <div class="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                        <i data-lucide="alert-circle" class="w-4 h-4 mt-0.5 shrink-0"></i> {{ $errors->first() }}
                    </div>
                @endif

                <form method="POST" action="{{ route('login.submit') }}" class="mt-7 space-y-5" x-data="{ email: @js(old('email', '')), password: '' }">
                    @csrf
                    <div>
                        <label class="block text-sm font-semibold text-brand-950 mb-2">Email</label>
                        <input x-model="email" data-testid="login-email-input" type="email" required name="email" placeholder="nama@mapulosari.sch.id" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition">
                    </div>
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="block text-sm font-semibold text-brand-950">Kata Sandi</label>
                            <a href="/forgot-password" class="text-xs font-semibold text-brand-700 hover:text-brand-900">Lupa kata sandi?</a>
                        </div>
                        <div class="relative">
                            <input x-model="password" data-testid="login-password-input" x-bind:type="show ? 'text' : 'password'" required name="password" placeholder="••••••••" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition">
                            <button type="button" x-on:click="show = !show" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-700" data-testid="login-toggle-password">
                                <i data-lucide="eye-off" class="w-4 h-4" x-show="show" x-cloak></i>
                                <i data-lucide="eye" class="w-4 h-4" x-show="!show" x-cloak></i>
                            </button>
                        </div>
                    </div>

                    <label class="flex items-center gap-2 text-sm text-slate-700 select-none">
                        <input type="checkbox" name="remember" class="rounded border-slate-300 text-brand-700 focus:ring-brand-500">
                        Ingatkan saya
                    </label>

                    <button type="submit" data-testid="login-submit-btn" class="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white py-3.5 font-bold shadow-lg shadow-brand-900/20 transition text-base">
                        Masuk ke Dashboard <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </button>
                </form>

                <div class="mt-8 text-center text-sm text-slate-600">
                    Kembali ke <a href="/" class="font-bold text-brand-700 hover:text-brand-900">Beranda</a>
                </div>
            </div>
        </div>
    </div>
@endsection

