@extends('layouts.public')

@section('title', 'Program Studi · ' . ($branding['schoolName'] ?? 'Website'))

@section('content')
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="program-studi-page">
        <div class="max-w-3xl">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Program Studi</div>
            <h1 class="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Peminatan <span class="font-editorial italic text-brand-700">unggulan</span> untuk masa depan.</h1>
            <p class="mt-5 text-brand-800/85 max-w-2xl">Pilih jalur belajar yang sesuai minat dan bakat, dengan pendampingan guru yang berpengalaman.</p>
        </div>

        <div class="mt-12 grid md:grid-cols-2 gap-6">
            @foreach (($programs ?? []) as $p)
                @php
                    $rawIcon = (string) ($p['icon'] ?? 'GraduationCap');
                    $kebab = strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $rawIcon));
                    $kebab = str_replace('_', '-', $kebab);
                @endphp
                <article class="bg-white rounded-[2rem] border border-slate-100 p-7 card-lift" data-testid="program-studi-{{ $p['id'] ?? '' }}">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-800 shrink-0">
                            <i data-lucide="{{ $kebab }}" class="w-5 h-5"></i>
                        </div>
                        <div class="flex-1">
                            <h2 class="font-display text-2xl font-black text-brand-950 tracking-tight">{{ $p['name'] ?? '' }}</h2>
                            <p class="mt-2 text-sm text-slate-700 leading-relaxed">{{ $p['description'] ?? '' }}</p>
                        </div>
                    </div>
                    @if (!empty($p['highlights']) && is_array($p['highlights']))
                        <div class="mt-5 flex flex-wrap gap-2">
                            @foreach ($p['highlights'] as $h)
                                <span class="inline-flex items-center rounded-full bg-brand-50 border border-brand-100 text-brand-800 text-xs font-semibold px-3 py-1.5">{{ $h }}</span>
                            @endforeach
                        </div>
                    @endif
                </article>
            @endforeach
        </div>

        @if (count($programs ?? []) === 0)
            <div class="mt-10 text-center text-slate-500">Belum ada data program studi.</div>
        @endif
    </section>
@endsection
