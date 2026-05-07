@extends('layouts.public')

@section('title', 'Ekstrakurikuler · ' . ($branding['schoolName'] ?? 'Website'))

@section('content')
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="ekstrakurikuler-page">
        <div class="max-w-3xl">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Ekstrakurikuler</div>
            <h1 class="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Ruang <span class="font-editorial italic text-brand-700">tumbuh</span> di luar kelas.</h1>
            <p class="mt-5 text-brand-800/85 max-w-2xl">Kembangkan bakat, karakter, dan kerja sama lewat kegiatan pilihan.</p>
        </div>

        <div class="mt-10 flex flex-col md:flex-row gap-3">
            <form method="GET" action="/ekstrakurikuler" class="flex items-center gap-2 flex-1 bg-white rounded-xl border border-slate-200 px-4">
                <i data-lucide="search" class="w-4 h-4 text-brand-600"></i>
                <input name="q" value="{{ $q ?? '' }}" placeholder="Cari kegiatan..." class="flex-1 py-3 bg-transparent outline-none text-sm" data-testid="ekskul-search">
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
                        $href = '/ekstrakurikuler?' . http_build_query(array_filter(['q' => $q ?? '', 'cat' => $c !== 'Semua' ? $c : null]));
                        $label = $c === 'Semua' ? 'Semua' : ($labelByValue[$c] ?? $c);
                    @endphp
                    <a href="{{ $href }}" class="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition {{ $active ? 'bg-brand-950 text-white' : 'bg-white border border-slate-200 text-brand-900 hover:bg-brand-50' }}" data-testid="ekskul-cat-{{ $c }}">{{ $label }}</a>
                @endforeach
            </div>
        </div>

        <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach (($items ?? []) as $e)
                @php
                    $name = (string) ($e['name'] ?? '');
                    $slug = (string) ($e['slug'] ?? '');
                    $label = $labelByValue[$slug] ?? $slug;
                @endphp
                <article class="bg-white rounded-[2rem] border border-slate-100 overflow-hidden card-lift" data-testid="ekskul-{{ $e['id'] ?? '' }}">
                    <div class="aspect-[4/3] bg-brand-50 overflow-hidden">
                        @if (!empty($e['image']))
                            <img src="{{ $e['image'] }}" alt="{{ $name }}" class="w-full h-full object-cover hover:scale-105 transition duration-700">
                        @else
                            <div class="w-full h-full flex items-center justify-center text-brand-700">
                                <i data-lucide="images" class="w-7 h-7"></i>
                            </div>
                        @endif
                    </div>
                    <div class="p-6">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-brand-600">{{ $label }}</div>
                        <h2 class="font-display font-black text-brand-950 text-xl mt-1">{{ $name }}</h2>
                        <p class="text-sm text-slate-700 mt-2 leading-relaxed line-clamp-3">{{ $e['description'] ?? '' }}</p>
                        <div class="mt-4 grid gap-1 text-xs text-slate-600">
                            @if (!empty($e['schedule']))
                                <div class="inline-flex items-center gap-2"><i data-lucide="calendar-range" class="w-3.5 h-3.5 text-brand-600"></i> {{ $e['schedule'] }}</div>
                            @endif
                            @if (!empty($e['coach']))
                                <div class="inline-flex items-center gap-2"><i data-lucide="user" class="w-3.5 h-3.5 text-brand-600"></i> {{ $e['coach'] }}</div>
                            @endif
                        </div>
                    </div>
                </article>
            @endforeach
        </div>

        @if (count($items ?? []) === 0)
            <div class="mt-10 text-center text-slate-500">Belum ada data ekstrakurikuler.</div>
        @endif
    </section>
@endsection
