@php
    use Carbon\Carbon;
@endphp

@extends('layouts.public')

@section('title', ($g['title'] ?? 'Galeri') . ' · ' . ($branding['schoolName'] ?? 'Website'))

@section('content')
    @php
        $labelByValue = collect($categoryMeta ?? [])->mapWithKeys(fn ($c) => [$c['value'] => $c['label']])->all();
        $category = (string) ($g['category'] ?? '');
        $label = $labelByValue[$category] ?? $category;
        $dateText = isset($g['date']) ? Carbon::parse($g['date'])->locale('id')->translatedFormat('j F Y') : '';
        $photos = (isset($g['photos']) && is_array($g['photos'])) ? $g['photos'] : [];
        $count = count($photos) > 0 ? count($photos) : (int) ($g['count'] ?? 0);
        $cover = (string) ($g['cover'] ?? '');
    @endphp

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="galeri-detail-page" x-data="{ open: null }">
        <div class="flex items-start justify-between gap-6 flex-col lg:flex-row">
            <div class="max-w-3xl">
                <a href="{{ route('galeri') }}" class="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali ke Galeri
                </a>
                <div class="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">{{ $label }}</div>
                <h1 class="font-display text-4xl sm:text-5xl font-black text-brand-950 mt-3 tracking-tight leading-[0.95]">{{ $g['title'] ?? '' }}</h1>
                <div class="mt-4 text-sm text-slate-600 flex flex-wrap gap-x-5 gap-y-2">
                    @if ($dateText !== '')
                        <span class="inline-flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4 text-brand-600"></i> {{ $dateText }}</span>
                    @endif
                    <span class="inline-flex items-center gap-2"><i data-lucide="image" class="w-4 h-4 text-brand-600"></i> {{ $count }} foto</span>
                </div>
            </div>
        </div>

        <div class="mt-10 grid lg:grid-cols-5 gap-8 items-start">
            <div class="lg:col-span-3">
                <div class="rounded-[2rem] overflow-hidden bg-brand-50 border border-slate-100">
                    @if ($cover !== '')
                        <button type="button" class="w-full" x-on:click="open='{{ $cover }}'">
                            <img src="{{ $cover }}" alt="{{ $g['title'] ?? '' }}" class="w-full h-auto object-cover">
                        </button>
                    @else
                        <div class="aspect-[4/3] flex items-center justify-center text-brand-700">
                            <i data-lucide="images" class="w-8 h-8"></i>
                        </div>
                    @endif
                </div>
                @if (count($photos) > 0)
                    <div class="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        @foreach ($photos as $idx => $p)
                            @php $pUrl = is_string($p) ? $p : ''; @endphp
                            @if ($pUrl !== '')
                                <button type="button" class="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 bg-brand-50" x-on:click="open='{{ $pUrl }}'" data-testid="galeri-photo-{{ $idx }}">
                                    <img src="{{ $pUrl }}" alt="" class="w-full h-full object-cover">
                                </button>
                            @endif
                        @endforeach
                    </div>
                    <div class="mt-5 text-sm text-slate-600 leading-relaxed">Klik foto untuk memperbesar.</div>
                @else
                    <div class="mt-5 text-sm text-slate-600 leading-relaxed">
                        Galeri ini belum memiliki daftar foto album. Kamu bisa menambahkan foto dari dashboard.
                    </div>
                @endif
            </div>
            <aside class="lg:col-span-2">
                <div class="bg-white rounded-[2rem] border border-slate-100 p-6">
                    <div class="text-xs font-bold uppercase tracking-wider text-brand-700">Galeri Lainnya</div>
                    <div class="mt-4 space-y-3">
                        @foreach (($others ?? []) as $o)
                            @php
                                $oCover = (string) ($o['cover'] ?? '');
                                $oTitle = (string) ($o['title'] ?? '');
                                $oCategory = (string) ($o['category'] ?? '');
                                $oLabel = $labelByValue[$oCategory] ?? $oCategory;
                            @endphp
                            <a href="{{ route('galeri.show', ['record' => $o['id'] ?? '']) }}" class="flex items-center gap-3 rounded-2xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition p-3" data-testid="galeri-related-{{ $o['id'] ?? '' }}">
                                <div class="w-16 h-14 rounded-xl overflow-hidden bg-brand-50 shrink-0">
                                    @if ($oCover !== '')
                                        <img src="{{ $oCover }}" alt="{{ $oTitle }}" class="w-full h-full object-cover">
                                    @else
                                        <div class="w-full h-full flex items-center justify-center text-brand-700">
                                            <i data-lucide="image" class="w-5 h-5"></i>
                                        </div>
                                    @endif
                                </div>
                                <div class="min-w-0">
                                    <div class="text-[10px] font-bold uppercase tracking-wider text-brand-600">{{ $oLabel }}</div>
                                    <div class="text-sm font-bold text-brand-950 truncate">{{ $oTitle }}</div>
                                </div>
                            </a>
                        @endforeach
                        @if (count($others ?? []) === 0)
                            <div class="text-sm text-slate-500">Belum ada galeri lainnya.</div>
                        @endif
                    </div>
                </div>
            </aside>
        </div>

        <div class="fixed inset-0 bg-brand-950/90 backdrop-blur-md z-50 flex items-center justify-center p-6" x-show="open" x-on:click="open=null" x-cloak data-testid="galeri-lightbox">
            <button type="button" class="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center" x-on:click.stop="open=null">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
            <img x-bind:src="open" alt="" class="max-w-full max-h-full rounded-2xl border border-white/10" />
        </div>
    </section>
@endsection
