@php
    use Carbon\Carbon;

    $content = is_array($r ?? null) ? (string) ($r['content'] ?? '') : '';
    $hasContent = trim($content) !== '';
    $isHtml = str_contains($content, '<');
    $dateText = isset($r['date']) ? Carbon::parse($r['date'])->locale('id')->translatedFormat('j F Y') : '';
@endphp

@extends('layouts.public')

@section('title', ($r['title'] ?? 'Refleksi') . ' · ' . ($branding['schoolName'] ?? 'Website'))

@section('content')
    <div class="py-14" data-testid="refleksi-detail-page">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <a href="{{ route('refleksi') }}" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 mb-6"><i data-lucide="arrow-left" class="w-4 h-4"></i> Semua refleksi</a>
            <div class="text-[11px] font-bold uppercase tracking-wider text-brand-700">{{ $dateText }} @if (!empty($r['author'])) · {{ $r['author'] }} @endif</div>
            <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[1.02]">{{ $r['title'] ?? '' }}</h1>
        </div>

        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <div class="aspect-[16/9] rounded-[2rem] overflow-hidden bg-brand-50 border border-slate-100">
                @if (!empty($r['image']))
                    <img src="{{ $r['image'] }}" alt="{{ $r['title'] ?? '' }}" class="w-full h-full object-cover">
                @else
                    <div class="w-full h-full flex items-center justify-center text-brand-700">
                        <i data-lucide="quote" class="w-8 h-8"></i>
                    </div>
                @endif
            </div>
        </div>

        <article class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            @if (!empty($r['excerpt']))
                <p class="text-brand-900/85 leading-relaxed text-xl italic font-editorial mb-8">“{{ $r['excerpt'] }}”</p>
            @endif
            @if ($hasContent)
                @if ($isHtml)
                    <div class="rich-content">{!! $content !!}</div>
                @else
                    @foreach (preg_split("/\n\s*\n/", $content) as $p)
                        <p class="text-brand-900/90 leading-relaxed text-lg mb-5">{{ $p }}</p>
                    @endforeach
                @endif
            @endif
        </article>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
            <h3 class="font-display text-2xl font-extrabold text-brand-950 mb-6">Refleksi Lainnya</h3>
            <div class="grid md:grid-cols-3 gap-6">
                @foreach (($related ?? []) as $x)
                    <a href="{{ route('refleksi.show', ['slug' => $x['slug'] ?? ($x['id'] ?? '')]) }}" class="group">
                        <div class="aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-brand-50 border border-slate-100">
                            @if (!empty($x['image']))
                                <img src="{{ $x['image'] }}" alt="{{ $x['title'] ?? '' }}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                            @endif
                        </div>
                        <h4 class="font-display font-bold text-brand-950 group-hover:text-brand-700 line-clamp-2">{{ $x['title'] ?? '' }}</h4>
                    </a>
                @endforeach
            </div>
        </div>
    </div>
@endsection
