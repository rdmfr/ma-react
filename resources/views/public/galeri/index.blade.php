@php
    use Carbon\Carbon;
@endphp

@extends('layouts.public')

@section('title', 'Galeri · ' . ($branding['schoolName'] ?? 'Website'))

@section('content')
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="galeri-page">
        <div class="max-w-3xl">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Galeri</div>
            <h1 class="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Momen yang <span class="font-editorial italic text-brand-700">bercerita</span>.</h1>
            <p class="mt-5 text-brand-800/85 max-w-2xl">Dokumentasi kegiatan belajar, OSIS, ekstrakurikuler, dan agenda madrasah.</p>
        </div>

        <div class="mt-10 flex flex-col md:flex-row gap-3">
            <form method="GET" action="/galeri" class="flex items-center gap-2 flex-1 bg-white rounded-xl border border-slate-200 px-4">
                <i data-lucide="search" class="w-4 h-4 text-brand-600"></i>
                <input name="q" value="{{ $q ?? '' }}" placeholder="Cari galeri..." class="flex-1 py-3 bg-transparent outline-none text-sm" data-testid="galeri-search">
                @if (!empty($cat) && $cat !== 'Semua')
                    <input type="hidden" name="cat" value="{{ $cat }}">
                @endif
            </form>
            <div class="flex gap-2 overflow-x-auto">
                @php
                    $chips = array_merge(['Semua'], $categories ?? []);
                    $labelByValue = collect($categoryMeta ?? [])->mapWithKeys(fn ($c) => [$c['value'] => $c['label']])->all();
                @endphp
                @foreach ($chips as $c)
                    @php
                        $active = ($cat ?? 'Semua') === $c;
                        $href = '/galeri?' . http_build_query(array_filter(['q' => $q ?? '', 'cat' => $c !== 'Semua' ? $c : null]));
                        $label = $c === 'Semua' ? 'Semua' : ($labelByValue[$c] ?? $c);
                    @endphp
                    <a href="{{ $href }}" class="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition {{ $active ? 'bg-brand-950 text-white' : 'bg-white border border-slate-200 text-brand-900 hover:bg-brand-50' }}" data-testid="galeri-cat-{{ $c }}">{{ $label }}</a>
                @endforeach
            </div>
        </div>

        <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach (($items ?? []) as $g)
                @php
                    $dateText = isset($g['date']) ? Carbon::parse($g['date'])->locale('id')->translatedFormat('j M Y') : '';
                    $cover = (string) ($g['cover'] ?? '');
                    $title = (string) ($g['title'] ?? '');
                    $category = (string) ($g['category'] ?? '');
                    $count = (int) ($g['count'] ?? 0);
                    $label = $labelByValue[$category] ?? $category;
                @endphp
                <a href="{{ route('galeri.show', ['record' => $g['id'] ?? '']) }}" class="group" data-testid="galeri-card-{{ $g['id'] ?? '' }}">
                    <div class="aspect-[4/3] rounded-[2rem] overflow-hidden mb-4 relative bg-brand-50">
                        @if ($cover !== '')
                            <img src="{{ $cover }}" alt="{{ $title }}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                        @else
                            <div class="w-full h-full flex items-center justify-center text-brand-700">
                                <i data-lucide="images" class="w-7 h-7"></i>
                            </div>
                        @endif
                        <div class="absolute top-3 left-3 bg-white/95 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-brand-800 rounded-full px-2.5 py-1">{{ $label }}</div>
                    </div>
                    <h3 class="font-display font-bold text-xl text-brand-950 leading-tight group-hover:text-brand-700 transition">{{ $title }}</h3>
                    <div class="mt-3 text-xs text-slate-500 flex items-center gap-3">
                        <span>{{ $dateText }}</span>
                        <span class="inline-flex items-center gap-1"><i data-lucide="image" class="w-3 h-3"></i> {{ $count }}</span>
                    </div>
                </a>
            @endforeach
        </div>

        @if (count($items ?? []) === 0)
            <div class="mt-10 text-center text-slate-500">Belum ada data galeri.</div>
        @endif
    </section>
@endsection
