@extends('layouts.auth')

@section('content')
    <div class="min-h-screen flex items-center justify-center bg-[#fbfcf9] p-6 relative overflow-hidden" data-testid="forgot-page">
        <div class="absolute -top-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-brand-100/70 blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] rounded-full bg-brand-50 blur-3xl"></div>
        <div class="w-full max-w-md relative">
            <a href="/login" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900 mb-8">
                <i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali ke login
            </a>
            <div class="flex items-center gap-3 mb-8">
                <div class="w-12 h-12 rounded-xl bg-white border border-brand-100 p-2"><img src="{{ $branding['logoUrl'] ?? '' }}" alt="{{ $branding['schoolName'] ?? '' }}" class="w-full h-full object-contain"></div>
                <div>
                    <div class="font-display font-extrabold text-brand-950">{{ $branding['schoolName'] ?? '' }}</div>
                </div>
            </div>

            @if (session('sent'))
                <div class="text-center">
                    <div class="w-16 h-16 mx-auto rounded-full bg-brand-100 text-brand-700 flex items-center justify-center"><i data-lucide="check-circle-2" class="w-8 h-8"></i></div>
                    <h1 class="font-display text-3xl font-extrabold text-brand-950 mt-6">Cek Email Anda</h1>
                    <p class="text-slate-600 mt-2">Kami telah mengirim tautan reset ke <span class="font-semibold text-brand-900">{{ session('email') }}</span>. Tautan berlaku 60 menit.</p>
                    <a href="/login" class="mt-6 inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-5 py-3 font-bold text-brand-900">Kembali ke login</a>
                </div>
            @else
                <h1 class="font-display text-3xl font-extrabold text-brand-950">Lupa kata sandi?</h1>
                <p class="text-slate-600 mt-2 text-sm">Masukkan email Anda dan kami akan mengirim tautan untuk reset password.</p>

                @if ($errors->any())
                    <div class="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 font-semibold">{{ $errors->first() }}</div>
                @endif

                <form method="POST" action="{{ route('password.email') }}" class="mt-7 space-y-4">
                    @csrf
                    <div>
                        <label class="block text-sm font-semibold text-brand-950 mb-2">Email</label>
                        <div class="relative">
                            <i data-lucide="mail" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input required type="email" name="email" value="{{ old('email') }}" data-testid="forgot-email-input" placeholder="nama@mapulosari.sch.id" class="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none">
                        </div>
                    </div>
                    <button type="submit" data-testid="forgot-submit-btn" class="w-full rounded-xl gradient-brand gradient-brand-hover text-white py-3.5 font-bold shadow-lg shadow-brand-900/20">Kirim Tautan Reset</button>
                </form>
            @endif
        </div>
    </div>
@endsection

