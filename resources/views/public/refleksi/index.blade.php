@php
    use Carbon\Carbon;
@endphp

@extends('layouts.public')

@section('title', 'Refleksi · ' . ($branding['schoolName'] ?? 'Website'))

@section('content')
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="refleksi-page">
        <div class="max-w-3xl">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Refleksi</div>
            <h1 class="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Tulisan <span class="font-editorial italic text-brand-700">menyentuh</span> dari para pendidik.</h1>
            <p class="mt-5 text-brand-800/85 max-w-2xl">Renungan dan hikmah yang menyatukan hati guru dan siswa dalam menempuh jalan ilmu.</p>
        </div>

        <div class="mt-10 flex flex-col md:flex-row gap-3">
            <form method="GET" action="/refleksi" class="flex items-center gap-2 flex-1 bg-white rounded-xl border border-slate-200 px-4">
                <i data-lucide="search" class="w-4 h-4 text-brand-600"></i>
                <input name="q" value="{{ $q ?? '' }}" placeholder="Cari refleksi..." class="flex-1 py-3 bg-transparent outline-none text-sm" data-testid="refleksi-search">
            </form>
        </div>

        <div class="mt-12 space-y-10">
            @foreach (($reflections ?? []) as $i => $r)
                @php
                    $dateText = isset($r['date']) ? Carbon::parse($r['date'])->locale('id')->translatedFormat('j F Y') : '';
                    $reverse = ($i % 2) === 1;
                @endphp
                <article class="grid md:grid-cols-2 gap-8 items-center" data-testid="refleksi-{{ $r['id'] ?? '' }}">
                    <div class="{{ $reverse ? 'md:order-2' : '' }} aspect-[5/4] rounded-[2rem] overflow-hidden bg-brand-50 border border-slate-100">
                        @if (!empty($r['image']))
                            <img src="{{ $r['image'] }}" alt="{{ $r['title'] ?? '' }}" class="w-full h-full object-cover">
                        @else
                            <div class="w-full h-full flex items-center justify-center text-brand-700">
                                <i data-lucide="quote" class="w-8 h-8"></i>
                            </div>
                        @endif
                    </div>
                    <div>
                        <div class="text-xs font-bold uppercase tracking-wider text-brand-700 mb-3">{{ $dateText }} @if (!empty($r['author'])) · {{ $r['author'] }} @endif</div>
                        <h2 class="font-display text-3xl lg:text-4xl font-black text-brand-950 tracking-tight leading-tight">{{ $r['title'] ?? '' }}</h2>
                        <i data-lucide="quote" class="w-6 h-6 text-brand-500 mt-5"></i>
                        <p class="mt-4 text-brand-800/85 leading-relaxed text-lg italic font-editorial">{{ $r['excerpt'] ?? '' }}</p>
                        <a href="{{ route('refleksi.show', ['slug' => $r['slug'] ?? ($r['id'] ?? '')]) }}" class="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900">Baca selengkapnya →</a>
                    </div>
                </article>
            @endforeach
        </div>

        @if (count($reflections ?? []) === 0)
            <div class="mt-10 text-center text-slate-500">Belum ada refleksi.</div>
        @endif
    </section>
@endsection
