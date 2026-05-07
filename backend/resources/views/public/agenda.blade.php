@php
    use Carbon\Carbon;
@endphp

@extends('layouts.public')

@section('title', 'Agenda · ' . ($branding['schoolName'] ?? 'Website'))

@section('content')
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="agenda-page">
        <div class="max-w-3xl">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Agenda</div>
            <h1 class="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Jadwal <span class="font-editorial italic text-brand-700">kegiatan</span> madrasah.</h1>
            <p class="mt-5 text-brand-800/85 max-w-2xl">Info acara, evaluasi, dan kegiatan penting yang akan datang.</p>
        </div>

        <div class="mt-10 flex flex-col md:flex-row gap-3">
            <form method="GET" action="/agenda" class="flex items-center gap-2 flex-1 bg-white rounded-xl border border-slate-200 px-4">
                <i data-lucide="search" class="w-4 h-4 text-brand-600"></i>
                <input name="q" value="{{ $q ?? '' }}" placeholder="Cari agenda..." class="flex-1 py-3 bg-transparent outline-none text-sm" data-testid="agenda-search">
                @if (!empty($type) && $type !== 'Semua')
                    <input type="hidden" name="type" value="{{ $type }}">
                @endif
            </form>
            <div class="flex gap-2 overflow-x-auto">
                @php
                    $chips = array_merge(['Semua'], $types ?? []);
                @endphp
                @foreach ($chips as $c)
                    @php
                        $active = ($type ?? 'Semua') === $c;
                        $href = '/agenda?' . http_build_query(array_filter(['q' => $q ?? '', 'type' => $c !== 'Semua' ? $c : null]));
                    @endphp
                    <a href="{{ $href }}" class="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition {{ $active ? 'bg-brand-950 text-white' : 'bg-white border border-slate-200 text-brand-900 hover:bg-brand-50' }}" data-testid="agenda-type-{{ $c }}">{{ $c }}</a>
                @endforeach
            </div>
        </div>

        <div class="mt-10 grid md:grid-cols-2 gap-6">
            @foreach (($events ?? []) as $e)
                @php
                    $dateText = isset($e['date']) ? Carbon::parse($e['date'])->locale('id')->translatedFormat('j F Y') : '';
                    $time = (string) ($e['time'] ?? '');
                    $loc = (string) ($e['location'] ?? '');
                    $typeLabel = (string) ($e['type'] ?? '');
                @endphp
                <article class="bg-white rounded-[2rem] border border-slate-100 p-7 card-lift" data-testid="agenda-{{ $e['id'] ?? '' }}">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <div class="text-[10px] font-bold uppercase tracking-wider text-brand-600">{{ $typeLabel }}</div>
                            <h2 class="font-display text-2xl font-black text-brand-950 tracking-tight mt-1">{{ $e['title'] ?? '' }}</h2>
                        </div>
                        <div class="shrink-0 rounded-2xl bg-brand-50 border border-brand-100 px-4 py-3 text-center">
                            <div class="text-xs font-bold text-brand-700">{{ isset($e['date']) ? Carbon::parse($e['date'])->locale('id')->translatedFormat('M') : '' }}</div>
                            <div class="text-2xl font-black text-brand-950 leading-none">{{ isset($e['date']) ? Carbon::parse($e['date'])->format('d') : '' }}</div>
                        </div>
                    </div>
                    <div class="mt-4 text-sm text-slate-700">{{ $dateText }}</div>
                    <div class="mt-4 grid sm:grid-cols-2 gap-2 text-xs text-slate-600">
                        @if ($time !== '')
                            <div class="inline-flex items-center gap-2"><i data-lucide="clock" class="w-3.5 h-3.5 text-brand-600"></i> {{ $time }}</div>
                        @endif
                        @if ($loc !== '')
                            <div class="inline-flex items-center gap-2"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-brand-600"></i> {{ $loc }}</div>
                        @endif
                    </div>
                </article>
            @endforeach
        </div>

        @if (count($events ?? []) === 0)
            <div class="mt-10 text-center text-slate-500">Belum ada agenda.</div>
        @endif
    </section>
@endsection
