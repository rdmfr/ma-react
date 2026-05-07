@extends('layouts.public')

@section('title', 'FAQ · ' . ($branding['schoolName'] ?? 'Website'))

@section('content')
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="faq-page" x-data="{ openKey: null }">
        <div class="max-w-3xl">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>FAQ</div>
            <h1 class="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Pertanyaan yang <span class="font-editorial italic text-brand-700">sering</span> ditanyakan.</h1>
        </div>

        <div class="mt-10 flex gap-2 overflow-x-auto">
            @php
                $chips = array_merge(['Semua'], $categories ?? []);
            @endphp
            @foreach ($chips as $c)
                @php
                    $active = ($cat ?? 'Semua') === $c;
                    $href = '/faq?' . http_build_query(array_filter(['cat' => $c !== 'Semua' ? $c : null]));
                @endphp
                <a href="{{ $href }}" class="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition {{ $active ? 'bg-brand-950 text-white' : 'bg-white border border-slate-200 text-brand-900 hover:bg-brand-50' }}" data-testid="faq-cat-{{ $c }}">{{ $c }}</a>
            @endforeach
        </div>

        <div class="mt-8 space-y-3">
            @foreach (($faqs ?? []) as $i => $f)
                @php
                    $key = (string) ($f['id'] ?? $i);
                @endphp
                <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden card-lift" data-testid="faq-{{ $key }}">
                    <button type="button" class="w-full flex items-center justify-between gap-4 p-5 text-left" x-on:click="openKey = (openKey === '{{ $key }}' ? null : '{{ $key }}')">
                        <div>
                            <div class="text-[10px] font-bold uppercase tracking-wider text-brand-600">{{ $f['category'] ?? '' }}</div>
                            <div class="font-display font-bold text-brand-950 mt-1">{{ $f['q'] ?? '' }}</div>
                        </div>
                        <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0" x-bind:class="openKey === '{{ $key }}' ? 'gradient-brand text-white' : 'bg-brand-50 text-brand-700'">
                            <i data-lucide="plus" class="w-4 h-4" x-show="openKey !== '{{ $key }}'" x-cloak></i>
                            <i data-lucide="minus" class="w-4 h-4" x-show="openKey === '{{ $key }}'" x-cloak></i>
                        </div>
                    </button>
                    @php
                        $answer = (string) ($f['a'] ?? '');
                        $isHtml = str_contains($answer, '<');
                    @endphp
                    <div class="px-5 pb-5 text-slate-700 leading-relaxed" x-show="openKey === '{{ $key }}'" x-cloak>
                        @if ($isHtml)
                            <div class="rich-content text-sm">{!! $answer !!}</div>
                        @else
                            {{ $answer }}
                        @endif
                    </div>
                </div>
            @endforeach
        </div>

        @if (count($faqs ?? []) === 0)
            <div class="mt-10 text-center text-slate-500">Belum ada FAQ.</div>
        @endif
    </section>
@endsection
