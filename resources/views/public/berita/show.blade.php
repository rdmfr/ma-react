@php
    use Carbon\Carbon;

    $content = is_array($n ?? null) ? (string) ($n['content'] ?? '') : '';
    $hasContent = trim($content) !== '';
    $isHtml = str_contains($content, '<');
    $dateText = isset($n['date']) ? Carbon::parse($n['date'])->locale('id')->translatedFormat('j F Y') : '';
@endphp

@extends('layouts.public')

@section('content')
    <div class="py-14" data-testid="berita-detail-page" x-data="{ progress: 0, shareOpen: false }" x-init="
        const onScroll = () => {
            const h = document.documentElement
            const sc = (h.scrollTop) / (h.scrollHeight - h.clientHeight)
            progress = Math.min(100, Math.max(0, sc * 100))
        }
        window.addEventListener('scroll', onScroll)
        onScroll()
    ">
        <div class="read-progress" x-bind:style="`width: ${progress}%`"></div>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <a href="/berita" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 mb-6"><i data-lucide="arrow-left" class="w-4 h-4"></i> Semua berita</a>
            <span class="text-[11px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 rounded-full px-3 py-1">{{ $n['category'] ?? '' }}</span>
            <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-brand-950 mt-5 tracking-tight leading-[1.02]">{{ $n['title'] ?? '' }}</h1>
            <div class="flex items-center gap-5 mt-6 text-sm text-slate-600 flex-wrap">
                <span class="inline-flex items-center gap-2"><i data-lucide="user" class="w-4 h-4"></i> {{ $n['author'] ?? '' }}</span>
                <span class="inline-flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4"></i> {{ $dateText }}</span>
                <span class="inline-flex items-center gap-2"><i data-lucide="eye" class="w-4 h-4"></i> {{ $n['views'] ?? 0 }} dibaca</span>
            </div>
        </div>
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <div class="aspect-[16/9] rounded-[2rem] overflow-hidden"><img src="{{ $n['image'] ?? '' }}" alt="{{ $n['title'] ?? '' }}" class="w-full h-full object-cover"></div>
        </div>
        <article class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            @if ($hasContent)
                @if ($isHtml)
                    <div class="rich-content">{!! $content !!}</div>
                @else
                    @foreach (preg_split("/\n\s*\n/", $content) as $p)
                        <p class="text-brand-900/90 leading-relaxed text-lg mb-5">{{ $p }}</p>
                    @endforeach
                @endif
            @endif
            <div class="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between relative">
                <span class="text-sm text-slate-600">Bagikan artikel ini</span>
                <div class="relative">
                    <button type="button" x-on:click="shareOpen = !shareOpen" class="inline-flex items-center gap-2 rounded-xl border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-brand-50" data-testid="berita-share">
                        <i data-lucide="share-2" class="w-4 h-4"></i> Share
                    </button>
                    <div class="absolute right-0 top-full mt-2 glass rounded-2xl shadow-xl border border-white/60 overflow-hidden z-10 animate-fade-up min-w-48" x-show="shareOpen" x-on:click.outside="shareOpen=false" x-cloak data-testid="share-popover">
                        <a target="_blank" rel="noreferrer" x-bind:href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(@js($n['title'] ?? ''))}&url=${encodeURIComponent(window.location.href)}`" class="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 text-sm font-semibold text-brand-900"><i data-lucide="twitter" class="w-4 h-4 text-brand-700"></i>Twitter / X</a>
                        <a target="_blank" rel="noreferrer" x-bind:href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`" class="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 text-sm font-semibold text-brand-900"><i data-lucide="facebook" class="w-4 h-4 text-brand-700"></i>Facebook</a>
                        <a target="_blank" rel="noreferrer" x-bind:href="`https://wa.me/?text=${encodeURIComponent(@js(($n['title'] ?? '') . ' - ') + window.location.href)}`" class="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 text-sm font-semibold text-brand-900"><i data-lucide="message-circle" class="w-4 h-4 text-brand-700"></i>WhatsApp</a>
                        <button type="button" x-on:click="navigator.clipboard?.writeText(window.location.href); shareOpen=false;" class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 text-sm font-semibold text-brand-900 border-t border-slate-100"><i data-lucide="copy" class="w-4 h-4 text-brand-700"></i>Salin Link</button>
                    </div>
                </div>
            </div>
        </article>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
            <h3 class="font-display text-2xl font-extrabold text-brand-950 mb-6">Berita Terkait</h3>
            <div class="grid md:grid-cols-3 gap-6">
                @foreach ($related as $r)
                    <a href="/berita/{{ $r['slug'] ?? ($r['id'] ?? '') }}" class="group">
                        <div class="aspect-[4/3] rounded-2xl overflow-hidden mb-3"><img src="{{ $r['image'] ?? '' }}" alt="{{ $r['title'] ?? '' }}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500"></div>
                        <h4 class="font-display font-bold text-brand-950 group-hover:text-brand-700 line-clamp-2">{{ $r['title'] ?? '' }}</h4>
                    </a>
                @endforeach
            </div>
        </div>
    </div>
@endsection
