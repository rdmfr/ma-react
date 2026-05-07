@extends('layouts.public')

@section('title', 'Karya Siswa · ' . ($branding['schoolName'] ?? 'Website'))

@section('content')
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="karya-siswa-page">
        <div class="max-w-3xl">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Karya Siswa</div>
            <h1 class="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Kreasi yang <span class="font-editorial italic text-brand-700">lahir</span> dari semangat belajar.</h1>
            <p class="mt-5 text-brand-800/85 max-w-2xl">Kumpulan karya, modul, dan file yang bisa dipelajari bersama.</p>
        </div>

        <div class="mt-10 flex flex-col md:flex-row gap-3">
            <form method="GET" action="/karya-siswa" class="flex items-center gap-2 flex-1 bg-white rounded-xl border border-slate-200 px-4">
                <i data-lucide="search" class="w-4 h-4 text-brand-600"></i>
                <input name="q" value="{{ $q ?? '' }}" placeholder="Cari karya (judul/penulis/kategori)..." class="flex-1 py-3 bg-transparent outline-none text-sm" data-testid="karya-search">
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
                        $href = '/karya-siswa?' . http_build_query(array_filter(['q' => $q ?? '', 'cat' => $c !== 'Semua' ? $c : null]));
                    @endphp
                    <a href="{{ $href }}" class="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition {{ $active ? 'bg-brand-950 text-white' : 'bg-white border border-slate-200 text-brand-900 hover:bg-brand-50' }}" data-testid="karya-cat-{{ $c }}">{{ $c }}</a>
                @endforeach
            </div>
        </div>

        @if (session('error'))
            <div class="mt-8 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-5 py-4 text-sm">{{ session('error') }}</div>
        @endif

        <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach (($works ?? []) as $w)
                @php
                    $title = (string) ($w['title'] ?? 'Karya');
                    $author = (string) ($w['author'] ?? 'OSIS');
                    $category = (string) ($w['category'] ?? '');
                    $downloads = (int) ($w['downloads'] ?? 0);
                    $fileSize = (string) ($w['fileSize'] ?? '');
                    $image = (string) ($w['image'] ?? '');
                    $url = (string) ($w['url'] ?? '');
                    $id = (string) ($w['id'] ?? '');
                @endphp
                <article class="bg-white rounded-[2rem] border border-slate-100 overflow-hidden card-lift flex flex-col" data-testid="karya-{{ $id }}">
                    <div class="aspect-[4/3] bg-brand-50 overflow-hidden">
                        @if ($image !== '')
                            <img src="{{ $image }}" alt="{{ $title }}" class="w-full h-full object-cover hover:scale-105 transition duration-700">
                        @else
                            <div class="w-full h-full flex items-center justify-center text-brand-700">
                                <i data-lucide="file-text" class="w-7 h-7"></i>
                            </div>
                        @endif
                    </div>
                    <div class="p-6 flex-1 flex flex-col">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-brand-600">{{ $category }}</div>
                        <h2 class="font-display font-black text-brand-950 text-xl mt-1 leading-tight">{{ $title }}</h2>
                        <div class="mt-3 text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                            <span class="inline-flex items-center gap-1.5"><i data-lucide="user" class="w-3.5 h-3.5 text-brand-600"></i> {{ $author }}</span>
                            <span class="inline-flex items-center gap-1.5"><i data-lucide="download" class="w-3.5 h-3.5 text-brand-600"></i> {{ $downloads }}</span>
                            @if ($fileSize !== '')
                                <span class="inline-flex items-center gap-1.5"><i data-lucide="hard-drive" class="w-3.5 h-3.5 text-brand-600"></i> {{ $fileSize }}</span>
                            @endif
                        </div>

                        <div class="mt-5">
                            @if ($id !== '')
                                <form method="POST" action="{{ route('karya-siswa.download', ['record' => $id]) }}">
                                    @csrf
                                    <button type="submit" class="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-3 text-sm font-bold">
                                        <i data-lucide="download" class="w-4 h-4"></i> Download
                                    </button>
                                </form>
                            @elseif ($url !== '')
                                <a href="{{ $url }}" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-3 text-sm font-bold">
                                    <i data-lucide="download" class="w-4 h-4"></i> Download
                                </a>
                            @else
                                <button type="button" class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 text-slate-500 px-5 py-3 text-sm font-bold cursor-not-allowed">
                                    <i data-lucide="download" class="w-4 h-4"></i> File belum tersedia
                                </button>
                            @endif
                        </div>
                    </div>
                </article>
            @endforeach
        </div>

        @if (count($works ?? []) === 0)
            <div class="mt-10 text-center text-slate-500">Belum ada data karya siswa.</div>
        @endif
    </section>
@endsection
