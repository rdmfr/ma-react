@php
    use Carbon\Carbon;
@endphp

@extends('layouts.public')

@section('title', 'Pengumuman · ' . ($branding['schoolName'] ?? 'Website'))

@section('content')
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="pengumuman-page">
        <div class="max-w-3xl">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Pengumuman</div>
            <h1 class="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Info <span class="font-editorial italic text-brand-700">resmi</span> madrasah.</h1>
        </div>

        @if (count($pinned ?? []) > 0)
            <div class="mt-10">
                <div class="text-xs font-bold uppercase tracking-wider text-brand-700 mb-3 inline-flex items-center gap-2"><i data-lucide="pin" class="w-3.5 h-3.5"></i> Disematkan</div>
                <div class="space-y-3">
                    @foreach (($pinned ?? []) as $a)
                        @php
                            $dateText = isset($a['date']) ? Carbon::parse($a['date'])->locale('id')->translatedFormat('j M Y') : '';
                        @endphp
                        <div class="bg-white rounded-2xl border border-brand-200 p-5 card-lift" data-testid="pengumuman-{{ $a['id'] ?? '' }}">
                            <div class="flex items-center justify-between gap-4 mb-2">
                                <h3 class="font-display font-bold text-brand-950">{{ $a['title'] ?? '' }}</h3>
                                <span class="text-xs text-slate-500 inline-flex items-center gap-1.5"><i data-lucide="calendar" class="w-3 h-3"></i> {{ $dateText }}</span>
                            </div>
                            @php
                                $content = (string) ($a['content'] ?? '');
                                $isHtml = str_contains($content, '<');
                            @endphp
                            @if ($isHtml)
                                <div class="rich-content text-sm">{!! $content !!}</div>
                            @else
                                <p class="text-sm text-slate-700 leading-relaxed">{{ $content }}</p>
                            @endif
                        </div>
                    @endforeach
                </div>
            </div>
        @endif

        <div class="mt-8 space-y-3">
            @foreach (($rest ?? []) as $a)
                @php
                    $dateText = isset($a['date']) ? Carbon::parse($a['date'])->locale('id')->translatedFormat('j M Y') : '';
                @endphp
                <div class="bg-white rounded-2xl border border-slate-100 p-5 card-lift" data-testid="pengumuman-{{ $a['id'] ?? '' }}">
                    <div class="flex items-center justify-between gap-4 mb-2">
                        <h3 class="font-display font-bold text-brand-950">{{ $a['title'] ?? '' }}</h3>
                        <span class="text-xs text-slate-500">{{ $dateText }}</span>
                    </div>
                    @php
                        $content = (string) ($a['content'] ?? '');
                        $isHtml = str_contains($content, '<');
                    @endphp
                    @if ($isHtml)
                        <div class="rich-content text-sm">{!! $content !!}</div>
                    @else
                        <p class="text-sm text-slate-700">{{ $content }}</p>
                    @endif
                </div>
            @endforeach
        </div>

        @if (count($pinned ?? []) === 0 && count($rest ?? []) === 0)
            <div class="mt-10 text-center text-slate-500">Belum ada pengumuman.</div>
        @endif
    </section>
@endsection
