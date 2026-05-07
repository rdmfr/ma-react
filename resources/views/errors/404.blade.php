@extends('layouts.public')

@section('title', 'Halaman Tidak Ditemukan - 404')

@section('content')
<div class="min-h-[70vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-brand-100/50 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-50 rounded-full blur-3xl"></div>

    <div class="relative text-center max-w-2xl mx-auto">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white shadow-xl shadow-brand-900/5 border border-brand-100 mb-8 animate-fade-up">
            <i data-lucide="map-pin-off" class="w-10 h-10 text-brand-600"></i>
        </div>
        
        <h1 class="font-display text-8xl font-black text-brand-950 mb-4 tracking-tighter opacity-10">404</h1>
        <h2 class="font-display text-4xl font-extrabold text-brand-900 mb-6 tracking-tight">Ups! Halaman Tidak Ditemukan</h2>
        
        <p class="text-slate-600 text-lg mb-10 leading-relaxed">
            Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. 
            Mari kembali ke beranda untuk menemukan informasi yang Anda butuhkan.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="{{ url('/') }}" class="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-600/20 card-lift">
                <i data-lucide="home" class="w-5 h-5"></i>
                Kembali ke Beranda
            </a>
            <a href="{{ url('/kontak') }}" class="inline-flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                <i data-lucide="mail" class="w-5 h-5"></i>
                Hubungi Kami
            </a>
        </div>
    </div>
</div>
@endsection
