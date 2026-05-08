@php
    use Carbon\Carbon;
@endphp

@extends('layouts.public')

@section('content')
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="berita-page">
        <div class="max-w-3xl">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span class="inline-block w-8 h-px bg-accent-500 mr-2 align-middle"></span>Berita</div>
            <h1 class="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Cerita & kabar <span class="font-editorial italic text-accent-600">terbaru</span> madrasah.</h1>
        </div>
        <div class="mt-10 flex flex-col md:flex-row gap-3">
            <form method="GET" action="/berita" class="flex items-center gap-2 flex-1 bg-white rounded-xl border border-slate-200 px-4">
                <i data-lucide="search" class="w-4 h-4 text-accent-600"></i>
                <input name="q" value="{{ $q ?? '' }}" placeholder="Cari berita..." class="flex-1 py-3 bg-transparent outline-none text-sm" data-testid="berita-search">
                @if (!empty($cat) && $cat !== 'Semua')
                    <input type="hidden" name="cat" value="{{ $cat }}">
                @endif
            </form>
            <div class="flex gap-2 overflow-x-auto">
                @php
                    $chips = array_merge(['Semua'], $categories ?? []);
                @endphp
                @foreach ($chips as $c)
                    @php
                        $active = ($cat ?? 'Semua') === $c;
                        $href = '/berita?' . http_build_query(array_filter(['q' => $q ?? '', 'cat' => $c !== 'Semua' ? $c : null]));
                    @endphp
                    <a href="{{ $href }}" data-testid="berita-filter-{{ strtolower($c) }}" class="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition {{ $active ? 'bg-accent-600 text-white' : 'bg-white border border-slate-200 text-brand-900 hover:bg-accent-50 hover:border-accent-200 hover:text-accent-800' }}">{{ $c }}</a>
                @endforeach
            </div>
        </div>
        <div class="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach ($news as $n)
                @php
                    $dateText = isset($n['date']) ? Carbon::parse($n['date'])->locale('id')->translatedFormat('j M Y') : '';
                @endphp
                <a href="/berita/{{ $n['slug'] ?? ($n['id'] ?? '') }}" class="group" data-testid="berita-card-{{ $n['id'] ?? '' }}">
                    <div class="aspect-[4/3] rounded-3xl overflow-hidden mb-4 relative">
                        <img src="{{ $n['image'] ?? '' }}" alt="{{ $n['title'] ?? '' }}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                        <div class="absolute top-3 left-3 bg-accent-50/95 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-accent-800 rounded-full px-2.5 py-1 border border-accent-100">{{ $n['category'] ?? '' }}</div>
                    </div>
                    <h3 class="font-display font-bold text-xl text-brand-950 leading-tight group-hover:text-accent-700 transition">{{ $n['title'] ?? '' }}</h3>
                    <p class="text-sm text-slate-600 mt-2 line-clamp-2">{{ $n['excerpt'] ?? '' }}</p>
                    <div class="mt-3 text-xs text-slate-500 flex items-center gap-3">
                        <span>{{ $dateText }}</span>
                        <span class="inline-flex items-center gap-1"><i data-lucide="eye" class="w-3 h-3"></i> {{ $n['views'] ?? 0 }}</span>
                    </div>
                </a>
            @endforeach
        </div>
        @if (count($news ?? []) === 0)
            <div class="mt-10 text-center text-slate-500">Tidak ada data yang cocok.</div>
        @endif
    </div>
@endsection
