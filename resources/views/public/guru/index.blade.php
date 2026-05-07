@extends('layouts.public')

@section('content')
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="guru-page">
        <div class="max-w-3xl">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Guru & Staff</div>
            <h1 class="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Para pendidik yang <span class="font-editorial italic text-brand-700">menginspirasi</span>.</h1>
            <p class="mt-5 text-brand-800/85 max-w-2xl">Temui tim pengajar profesional yang berdedikasi membimbing siswa menggapai potensi terbaiknya.</p>
        </div>
        <div class="mt-10 flex flex-col md:flex-row gap-4 bg-white rounded-2xl border border-slate-100 p-3">
            <form method="GET" action="/guru" class="flex items-center gap-2 flex-1 bg-brand-50/40 rounded-xl px-4">
                <i data-lucide="search" class="w-4 h-4 text-brand-600"></i>
                <input name="q" value="{{ $q ?? '' }}" placeholder="Cari nama atau jabatan/mapel..." class="flex-1 py-3 bg-transparent outline-none text-sm" data-testid="guru-search">
                @if (!empty($sub) && $sub !== 'Semua')
                    <input type="hidden" name="sub" value="{{ $sub }}">
                @endif
            </form>
            <form method="GET" action="/guru">
                @if (!empty($q))
                    <input type="hidden" name="q" value="{{ $q }}">
                @endif
                <select name="sub" onchange="this.form.submit()" class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-brand-500" data-testid="guru-filter">
                    <option {{ ($sub ?? 'Semua') === 'Semua' ? 'selected' : '' }}>Semua</option>
                    @foreach ($subjects as $s)
                        <option value="{{ $s }}" {{ ($sub ?? 'Semua') === $s ? 'selected' : '' }}>{{ $s }}</option>
                    @endforeach
                </select>
            </form>
        </div>
        <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            @foreach ($teachers as $t)
                @php
                    $photo = ($t['photo'] ?? null) ?: ('https://i.pravatar.cc/600?u=' . urlencode((string) (($t['slug'] ?? ($t['name'] ?? ($t['id'] ?? ''))))));
                @endphp
                <a href="/guru/{{ $t['slug'] ?? ($t['id'] ?? '') }}" class="group" data-testid="guru-card-{{ $t['id'] ?? '' }}">
                    <div class="aspect-[3/4] rounded-3xl overflow-hidden relative bg-brand-100">
                        <img src="{{ $photo }}" alt="{{ $t['name'] ?? '' }}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                        <div class="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/20 to-transparent"></div>
                        @if (($t['is_featured'] ?? false) === true)
                            <div class="absolute top-3 right-3 bg-white/95 backdrop-blur rounded-full px-2.5 py-1 text-[10px] font-bold text-brand-800 inline-flex items-center gap-1">
                                <i data-lucide="star" class="w-3 h-3 fill-amber-500 text-amber-500"></i> Unggulan
                            </div>
                        @endif
                        <div class="absolute bottom-4 left-4 right-4 text-white">
                            <div class="text-[10px] uppercase tracking-[0.2em] text-brand-300 font-bold">{{ $t['subject'] ?? '' }}</div>
                            <div class="font-display font-bold text-lg leading-tight mt-1">{{ $t['name'] ?? '' }}</div>
                        </div>
                    </div>
                </a>
            @endforeach
        </div>
        @if (count($teachers ?? []) === 0)
            <div class="mt-10 text-center text-slate-500">Tidak ada data yang cocok.</div>
        @endif
    </div>
@endsection

