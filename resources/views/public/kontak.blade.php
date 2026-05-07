@extends('layouts.public')

@section('content')
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="kontak-page">
        <div class="max-w-3xl">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Hubungi Kami</div>
            <h1 class="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Jangan ragu untuk <span class="font-editorial italic text-brand-700">menyapa</span>.</h1>
        </div>
        <div class="mt-12 grid lg:grid-cols-12 gap-8">
            <div class="lg:col-span-5 space-y-5">
                <div class="bg-brand-950 text-white rounded-3xl p-8 relative overflow-hidden">
                    <div class="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-500/20 blur-3xl"></div>
                    <h3 class="font-display font-extrabold text-2xl relative">Informasi Kontak</h3>
                    <div class="mt-6 space-y-5 relative">
                        <div class="flex gap-3"><i data-lucide="map-pin" class="w-5 h-5 text-brand-300 shrink-0 mt-0.5"></i><div><div class="text-xs uppercase tracking-wider text-brand-300">Alamat</div><div class="mt-1">{{ $branding['address'] ?? '' }}</div></div></div>
                        <div class="flex gap-3"><i data-lucide="mail" class="w-5 h-5 text-brand-300 shrink-0 mt-0.5"></i><div><div class="text-xs uppercase tracking-wider text-brand-300">Email</div><div class="mt-1">{{ $branding['email'] ?? '' }}</div></div></div>
                        <div class="flex gap-3"><i data-lucide="phone" class="w-5 h-5 text-brand-300 shrink-0 mt-0.5"></i><div><div class="text-xs uppercase tracking-wider text-brand-300">Telepon</div><div class="mt-1">{{ $branding['phone'] ?? '' }}</div></div></div>
                    </div>
                    <div class="mt-8 pt-5 border-t border-brand-800 flex gap-2 relative">
                        <a href="#" class="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-brand-500/30"><i data-lucide="instagram" class="w-4 h-4"></i></a>
                        <a href="#" class="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-brand-500/30"><i data-lucide="facebook" class="w-4 h-4"></i></a>
                        <a href="#" class="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-brand-500/30"><i data-lucide="youtube" class="w-4 h-4"></i></a>
                    </div>
                </div>
                <div class="rounded-3xl overflow-hidden h-64 bg-brand-100">
                    <iframe title="map" src="{{ $branding['mapEmbed'] ?? '' }}" class="w-full h-full border-0" loading="lazy"></iframe>
                </div>
            </div>
            <div class="lg:col-span-7">
                <form method="POST" action="{{ route('kontak.submit') }}" class="bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
                    @csrf
                    <h3 class="font-display font-extrabold text-2xl text-brand-950">Kirim Pesan</h3>
                    @if (session('success'))
                        <div class="rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 text-sm font-semibold">{{ session('success') }}</div>
                    @endif
                    @if ($errors->any())
                        <div class="rounded-2xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm font-semibold">
                            {{ $errors->first() }}
                        </div>
                    @endif
                    <div class="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-semibold text-brand-950">Nama</label>
                            <input required name="name" value="{{ old('name') }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="kontak-name">
                        </div>
                        <div>
                            <label class="text-sm font-semibold text-brand-950">Email</label>
                            <input required type="email" name="email" value="{{ old('email') }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="kontak-email">
                        </div>
                    </div>
                    <div>
                        <label class="text-sm font-semibold text-brand-950">Subjek</label>
                        <input required name="subject" value="{{ old('subject') }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="kontak-subject">
                    </div>
                    <div>
                        <label class="text-sm font-semibold text-brand-950">Pesan</label>
                        <textarea required rows="6" name="message" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 resize-none" data-testid="kontak-message">{{ old('message') }}</textarea>
                    </div>
                    <button type="submit" data-testid="kontak-submit" class="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-6 py-3.5 font-bold shadow-lg shadow-brand-900/20">
                        <i data-lucide="send" class="w-4 h-4"></i> Kirim Pesan
                    </button>
                </form>
            </div>
        </div>
    </div>
@endsection

