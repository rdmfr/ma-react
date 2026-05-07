@extends('layouts.public')

@section('title', 'Pencarian · ' . ($branding['schoolName'] ?? 'Website'))

@section('content')
    @php
        $iconByType = [
            'news' => 'newspaper',
            'teachers' => 'graduation-cap',
            'modules' => 'book-copy',
            'galleries' => 'image',
            'events' => 'calendar',
            'faqs' => 'file-text',
            'extracurriculars' => 'trophy',
            'reflections' => 'quote',
            'announcements' => 'megaphone',
            'studentWorks' => 'book-marked',
            'programStudies' => 'layers',
        ];
    @endphp

    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="search-page">
        <div class="bg-white border border-slate-100 rounded-3xl p-8">
            <div class="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">{{ $branding['schoolShort'] ?? '' }}</div>
            <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-brand-950 mt-3 tracking-tight">Hasil pencarian</h1>
            <div class="mt-4">
                <form method="GET" action="/search" class="flex items-center gap-2 bg-[#fbfcf9] rounded-2xl border border-slate-200 px-4">
                    <i data-lucide="search" class="w-4 h-4 text-brand-600"></i>
                    <input name="q" value="{{ $q ?? '' }}" placeholder="Cari berita, guru, modul..." class="flex-1 py-3 bg-transparent outline-none text-sm" data-testid="search-input">
                    <button type="submit" class="text-sm font-bold text-white rounded-xl px-4 py-2 gradient-brand gradient-brand-hover">Cari</button>
                </form>
            </div>
        </div>

        <div class="mt-10 space-y-3">
            @foreach (($results ?? []) as $i => $r)
                @php
                    $icon = $iconByType[$r['type'] ?? ''] ?? 'search';
                @endphp
                <a href="{{ $r['url'] ?? '#' }}" class="block bg-white rounded-2xl border border-slate-100 p-5 hover:border-brand-200 hover:bg-brand-50/20 transition card-lift" data-testid="search-result-{{ $i }}">
                    <div class="flex items-start gap-4">
                        <div class="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-800 shrink-0">
                            <i data-lucide="{{ $icon }}" class="w-5 h-5"></i>
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="text-[10px] font-bold uppercase tracking-wider text-brand-600">{{ $r['label'] ?? '' }}</div>
                            <div class="font-display font-black text-brand-950 mt-1 leading-snug">{{ $r['title'] ?? '' }}</div>
                            @if (!empty($r['snippet']))
                                <div class="mt-2 text-sm text-slate-700 leading-relaxed line-clamp-2">{{ $r['snippet'] }}</div>
                            @endif
                        </div>
                        <div class="shrink-0 text-brand-700">
                            <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
                        </div>
                    </div>
                </a>
            @endforeach
        </div>

        @if (trim((string) ($q ?? '')) === '')
            <div class="mt-10 text-center text-slate-500">Ketik kata kunci untuk mulai mencari.</div>
        @elseif (count($results ?? []) === 0)
            <div class="mt-10 text-center text-slate-500">Tidak ada hasil untuk “{{ $q }}”.</div>
        @endif
    </section>
@endsection
