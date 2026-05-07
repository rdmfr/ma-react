@php
    use Carbon\Carbon;
@endphp

@extends('layouts.public')

@section('title', 'Modul Pembelajaran · ' . ($branding['schoolName'] ?? 'Website'))

@section('content')
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="modul-page">
        <div class="max-w-3xl">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Modul</div>
            <h1 class="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Bahan ajar yang <span class="font-editorial italic text-brand-700">siap</span> diunduh.</h1>
            <p class="mt-5 text-brand-800/85 max-w-2xl">Modul pembelajaran untuk membantu siswa belajar mandiri dan terstruktur.</p>
        </div>

        <div class="mt-10 flex flex-col md:flex-row gap-3">
            <form method="GET" action="/modul" class="flex items-center gap-2 flex-1 bg-white rounded-xl border border-slate-200 px-4">
                <i data-lucide="search" class="w-4 h-4 text-brand-600"></i>
                <input name="q" value="{{ $q ?? '' }}" placeholder="Cari modul (judul/mapel/kelas)..." class="flex-1 py-3 bg-transparent outline-none text-sm" data-testid="modul-search">
                @if (!empty($grade) && $grade !== 'Semua')
                    <input type="hidden" name="grade" value="{{ $grade }}">
                @endif
            </form>
            <div class="flex gap-2 overflow-x-auto">
                @php
                    $chips = array_merge(['Semua'], $grades ?? []);
                @endphp
                @foreach ($chips as $c)
                    @php
                        $active = ($grade ?? 'Semua') === $c;
                        $href = '/modul?' . http_build_query(array_filter(['q' => $q ?? '', 'grade' => $c !== 'Semua' ? $c : null]));
                    @endphp
                    <a href="{{ $href }}" class="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition {{ $active ? 'bg-brand-950 text-white' : 'bg-white border border-slate-200 text-brand-900 hover:bg-brand-50' }}" data-testid="modul-grade-{{ $c }}">{{ $c }}</a>
                @endforeach
            </div>
        </div>

        @if (session('error'))
            <div class="mt-8 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-5 py-4 text-sm">{{ session('error') }}</div>
        @endif

        <div class="mt-10 bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
            <div class="grid grid-cols-12 gap-4 px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-[#fbfcf9] border-b border-slate-100">
                <div class="col-span-12 md:col-span-5">Judul</div>
                <div class="col-span-6 md:col-span-3">Mapel</div>
                <div class="col-span-6 md:col-span-2">Kelas</div>
                <div class="col-span-12 md:col-span-2 text-right">Aksi</div>
            </div>
            <div class="divide-y divide-slate-100">
                @foreach (($modules ?? []) as $m)
                    @php
                        $title = (string) ($m['title'] ?? '');
                        $subject = (string) ($m['subject'] ?? '-');
                        $g = (string) ($m['grade'] ?? '-');
                        $downloads = (int) ($m['downloads'] ?? 0);
                        $fileSize = (string) ($m['fileSize'] ?? '');
                        $updatedAt = (string) ($m['updatedAt'] ?? $m['date'] ?? '');
                        $dateText = $updatedAt !== '' ? Carbon::parse($updatedAt)->locale('id')->translatedFormat('j M Y') : '';
                        $id = (string) ($m['id'] ?? '');
                        $url = (string) ($m['url'] ?? '');
                    @endphp
                    <div class="grid grid-cols-12 gap-4 px-6 py-5 items-center" data-testid="modul-row-{{ $id }}">
                        <div class="col-span-12 md:col-span-5">
                            <div class="font-display font-bold text-brand-950">{{ $title }}</div>
                            <div class="mt-1 text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                                @if ($dateText !== '')
                                    <span class="inline-flex items-center gap-1.5"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> {{ $dateText }}</span>
                                @endif
                                <span class="inline-flex items-center gap-1.5"><i data-lucide="download" class="w-3.5 h-3.5"></i> {{ $downloads }}</span>
                                @if ($fileSize !== '')
                                    <span class="inline-flex items-center gap-1.5"><i data-lucide="hard-drive" class="w-3.5 h-3.5"></i> {{ $fileSize }}</span>
                                @endif
                            </div>
                        </div>
                        <div class="col-span-6 md:col-span-3 text-sm text-slate-700">{{ $subject }}</div>
                        <div class="col-span-6 md:col-span-2">
                            <span class="inline-flex items-center rounded-full bg-brand-50 border border-brand-100 text-brand-800 text-xs font-bold px-3 py-1.5">{{ $g }}</span>
                        </div>
                        <div class="col-span-12 md:col-span-2 flex justify-end">
                            @if ($id !== '')
                                <form method="POST" action="{{ route('modul.download', ['record' => $id]) }}">
                                    @csrf
                                    <button type="submit" class="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-3 text-sm font-bold" data-testid="modul-download-{{ $id }}">
                                        <i data-lucide="download" class="w-4 h-4"></i> Download
                                    </button>
                                </form>
                            @elseif ($url !== '')
                                <a href="{{ $url }}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-3 text-sm font-bold">
                                    <i data-lucide="download" class="w-4 h-4"></i> Download
                                </a>
                            @else
                                <button type="button" class="inline-flex items-center gap-2 rounded-xl bg-slate-100 text-slate-500 px-5 py-3 text-sm font-bold cursor-not-allowed">
                                    <i data-lucide="download" class="w-4 h-4"></i> N/A
                                </button>
                            @endif
                        </div>
                    </div>
                @endforeach
            </div>
        </div>

        @if (count($modules ?? []) === 0)
            <div class="mt-10 text-center text-slate-500">Belum ada modul.</div>
        @endif
    </section>
@endsection
