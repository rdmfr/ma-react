@php
    $profileImageUrl = ($branding['profileImageUrl'] ?? '') ?: ($branding['heroImageUrl'] ?? '');
    $profileImageAlt = ($branding['profileImageAlt'] ?? '') ?: ($branding['schoolName'] ?? '');
    $vision = trim((string) ($branding['vision'] ?? ''));
    $missions = is_array($branding['missions'] ?? null) ? array_values(array_filter($branding['missions'])) : [];

    $values = [
        ['icon' => 'heart', 'title' => 'Akhlakul Karimah', 'desc' => 'Membentuk karakter dan budi pekerti luhur sesuai ajaran Islam.'],
        ['icon' => 'book-open-text', 'title' => 'Keilmuan Kuat', 'desc' => 'Integrasi ilmu agama, umum, dan teknologi.'],
        ['icon' => 'users', 'title' => 'Kolaboratif', 'desc' => 'Membangun semangat gotong royong dalam berkarya.'],
        ['icon' => 'shield-check', 'title' => 'Berintegritas', 'desc' => 'Jujur, amanah, dan bertanggung jawab.'],
    ];

    $photoFor = function ($t) {
        $photo = is_array($t) ? ($t['photo'] ?? null) : null;
        if ($photo) return $photo;
        $seed = is_array($t) ? ($t['slug'] ?? ($t['name'] ?? ($t['id'] ?? ''))) : '';
        return 'https://i.pravatar.cc/300?u=' . urlencode((string) $seed);
    };
@endphp

@extends('layouts.public')

@section('content')
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="profil-page">
        <div class="grid lg:grid-cols-12 gap-12 items-start">
            <div class="lg:col-span-5 lg:sticky lg:top-28">
                <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Tentang Kami</div>
                <h1 class="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Madrasah <span class="font-editorial italic text-brand-700">berakhlak</span> & berprestasi.</h1>
                <p class="mt-6 text-brand-800/85 leading-relaxed">{{ $branding['schoolName'] ?? '' }} berdiri sejak 1998, tumbuh sebagai madrasah aliyah berakreditasi {{ $branding['accreditationLabel'] ?? 'B' }} di Kab. Garut, Jawa Barat. Kami menggabungkan tradisi keilmuan Islam klasik dengan pendekatan pendidikan modern untuk mencetak lulusan yang siap berkontribusi di manapun.</p>
                @if (isset($branding['profileContent']) && $branding['profileContent'] !== '')
                    <div class="mt-8 prose prose-brand prose-sm max-w-none text-brand-800/85 leading-relaxed">
                        {!! $branding['profileContent'] !!}
                    </div>
                @endif
                <div class="mt-8 grid grid-cols-3 gap-3">
                    <div class="rounded-2xl bg-white border border-slate-100 p-4 card-lift"><div class="font-display font-black text-2xl text-brand-950">1998</div><div class="text-xs text-slate-600 mt-1">Berdiri</div></div>
                    <div class="rounded-2xl bg-white border border-slate-100 p-4 card-lift"><div class="font-display font-black text-2xl text-brand-950">{{ $branding['accreditationLabel'] ?? 'B' }}</div><div class="text-xs text-slate-600 mt-1">Akreditasi</div></div>
                    <div class="rounded-2xl bg-white border border-slate-100 p-4 card-lift"><div class="font-display font-black text-2xl text-brand-950">842+</div><div class="text-xs text-slate-600 mt-1">Siswa</div></div>
                </div>
            </div>
            <div class="lg:col-span-7 space-y-6">
                <div class="aspect-[4/3] rounded-3xl overflow-hidden">
                    <img src="{{ $profileImageUrl }}" alt="{{ $profileImageAlt }}" class="w-full h-full object-cover">
                </div>
                <div class="bg-white rounded-3xl p-8 border border-slate-100">
                    <div class="flex items-center gap-3 mb-4"><i data-lucide="target" class="w-5 h-5 text-brand-700"></i><span class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Visi</span></div>
                    <p class="font-display text-2xl font-extrabold text-brand-950 leading-tight">{{ $vision !== '' ? '"' . $vision . '"' : 'Visi belum diisi.' }}</p>
                </div>
                <div class="bg-brand-950 text-white rounded-3xl p-8 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-60 h-60 rounded-full bg-brand-500/20 blur-3xl"></div>
                    <div class="flex items-center gap-3 mb-4 relative"><i data-lucide="flag" class="w-5 h-5 text-brand-300"></i><span class="text-xs font-bold uppercase tracking-[0.2em] text-brand-300">Misi</span></div>
                    <ul class="space-y-3 relative text-brand-100">
                        @foreach ((count($missions) ? $missions : ['Misi belum diisi.']) as $i => $m)
                            <li class="flex gap-3"><span class="w-7 h-7 rounded-full bg-brand-500/30 text-brand-300 flex items-center justify-center text-xs font-bold shrink-0">{{ $i + 1 }}</span>{{ $m }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>

        <div class="mt-24">
            <div class="text-center max-w-2xl mx-auto">
                <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Nilai Kami</div>
                <h2 class="font-display text-4xl font-extrabold text-brand-950 mt-3 tracking-tight">Empat pilar yang kami junjung tinggi.</h2>
            </div>
            <div class="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                @foreach ($values as $v)
                    <div class="bg-white rounded-3xl p-6 border border-slate-100 card-lift">
                        <div class="w-12 h-12 rounded-2xl gradient-brand text-white flex items-center justify-center"><i data-lucide="{{ $v['icon'] }}" class="w-5 h-5"></i></div>
                        <div class="font-display font-bold text-lg text-brand-950 mt-4">{{ $v['title'] }}</div>
                        <p class="text-sm text-slate-600 mt-2 leading-relaxed">{{ $v['desc'] }}</p>
                    </div>
                @endforeach
            </div>
        </div>

        <div class="mt-24">
            <div class="text-center max-w-2xl mx-auto">
                <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Struktur Organisasi</div>
                <h2 class="font-display text-4xl font-extrabold text-brand-950 mt-3 tracking-tight">Dipimpin oleh pendidik berpengalaman.</h2>
            </div>
            @if (isset($featuredOrg) && count($featuredOrg))
                <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    @foreach ($featuredOrg as $o)
                        <div class="bg-white rounded-3xl overflow-hidden border border-slate-100 card-lift">
                            <div class="aspect-square overflow-hidden"><img src="{{ $photoFor($o) }}" alt="{{ $o['name'] ?? '' }}" class="w-full h-full object-cover"></div>
                            <div class="p-5">
                                <div class="text-xs font-bold uppercase tracking-wider text-brand-700">{{ $o['subject'] ?? '' }}</div>
                                <div class="font-display font-bold text-brand-950 mt-1">{{ $o['name'] ?? '' }}</div>
                            </div>
                        </div>
                    @endforeach
                </div>
            @else
                <div class="mt-8 bg-white rounded-3xl border border-slate-100 p-6 text-sm text-slate-600">
                    Belum ada struktur organisasi yang ditampilkan. Tambahkan guru/pengurus dan tandai sebagai unggulan di dashboard admin.
                </div>
            @endif
        </div>
    </div>
@endsection

