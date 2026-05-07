@extends('layouts.public')

@section('title', 'Alumni · ' . ($branding['schoolName'] ?? 'Website'))

@section('content')
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="alumni-page">
        <div class="max-w-3xl">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Alumni</div>
            <h1 class="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Jejak <span class="font-editorial italic text-brand-700">inspirasi</span> setelah lulus.</h1>
            <p class="mt-5 text-brand-800/85 max-w-2xl">Cerita singkat alumni, tempat berkarya, dan pesan untuk adik kelas.</p>
        </div>

        <div class="mt-10 flex flex-col md:flex-row gap-3">
            <form method="GET" action="/alumni" class="flex items-center gap-2 flex-1 bg-white rounded-xl border border-slate-200 px-4">
                <i data-lucide="search" class="w-4 h-4 text-brand-600"></i>
                <input name="q" value="{{ $q ?? '' }}" placeholder="Cari alumni (nama, angkatan, dst)..." class="flex-1 py-3 bg-transparent outline-none text-sm" data-testid="alumni-search">
            </form>
        </div>

        <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach (($alumni ?? []) as $a)
                @php
                    $name = (string) ($a['name'] ?? 'Alumni');
                    $year = (string) ($a['year'] ?? '');
                    $major = (string) ($a['major'] ?? '');
                    $current = (string) ($a['current'] ?? '');
                    $quote = (string) ($a['quote'] ?? '');
                    $avatar = (string) ($a['avatar'] ?? $a['photo'] ?? '');
                @endphp
                <article class="bg-white rounded-[2rem] border border-slate-100 p-7 card-lift" data-testid="alumni-{{ $a['id'] ?? '' }}">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 overflow-hidden flex items-center justify-center shrink-0">
                            @if ($avatar !== '')
                                <img src="{{ $avatar }}" alt="{{ $name }}" class="w-full h-full object-cover">
                            @else
                                <i data-lucide="user" class="w-5 h-5 text-brand-700"></i>
                            @endif
                        </div>
                        <div class="min-w-0">
                            <div class="font-display font-black text-brand-950 truncate">{{ $name }}</div>
                            <div class="text-xs text-slate-500 mt-0.5">
                                {{ trim(implode(' · ', array_filter([$year !== '' ? ('Angkatan ' . $year) : null, $major !== '' ? $major : null]))) }}
                            </div>
                        </div>
                    </div>
                    @if ($current !== '')
                        <div class="mt-4 text-sm text-slate-700"><span class="text-slate-500">Sekarang:</span> {{ $current }}</div>
                    @endif
                    @if ($quote !== '')
                        <div class="mt-4 text-sm text-brand-900/85 italic font-editorial leading-relaxed">“{{ $quote }}”</div>
                    @endif
                </article>
            @endforeach
        </div>

        @if (count($alumni ?? []) === 0)
            <div class="mt-10 text-center text-slate-500">Belum ada data alumni.</div>
        @endif
    </section>
@endsection
