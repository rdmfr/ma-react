@php
    use Carbon\Carbon;

    $extraCategories = [
        ['value' => 'multimedia', 'label' => 'Multimedia'],
        ['value' => 'pmr', 'label' => 'PMR'],
        ['value' => 'pramuka', 'label' => 'Pramuka'],
        ['value' => 'marawiss', 'label' => 'Marawis'],
        ['value' => 'hadroh', 'label' => 'Hadroh'],
        ['value' => 'olahraga', 'label' => 'Olahraga'],
        ['value' => 'kesenian', 'label' => 'Kesenian'],
    ];

    $categoryLabel = function ($value) use ($extraCategories) {
        foreach ($extraCategories as $c) {
            if (($c['value'] ?? null) === $value) return $c['label'] ?? $value;
        }
        return $value ?: 'Kegiatan';
    };

    $primaryAlumni = $alumni[0] ?? null;

    $photoFor = function ($t) {
        $photo = is_array($t) ? ($t['photo'] ?? null) : null;
        if ($photo) return $photo;
        $seed = is_array($t) ? ($t['slug'] ?? ($t['name'] ?? ($t['id'] ?? ''))) : '';
        return 'https://i.pravatar.cc/600?u=' . urlencode((string) $seed);
    };
@endphp

@extends('layouts.public')

@section('content')
    <div data-testid="home-page">
        <section class="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 text-white">
            <div class="absolute inset-0 noise-overlay opacity-30"></div>
            <div class="absolute top-40 -right-28 w-[30rem] h-[30rem] rounded-full bg-brand-400/20 blur-3xl"></div>
            <div class="absolute -bottom-40 -left-32 w-[32rem] h-[32rem] rounded-full bg-emerald-300/10 blur-3xl"></div>
            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-28">
                <div class="grid lg:grid-cols-12 gap-10 items-center">
                    <div class="lg:col-span-7 animate-fade-up">
                        <div class="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide">
                            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-brand-300"></i>
                            PPDB 2025/2026 Telah Dibuka
                            <a href="/ppdb" class="text-brand-300 hover:text-white inline-flex items-center gap-1">Daftar <i data-lucide="arrow-up-right" class="w-3 h-3"></i></a>
                        </div>
                        <h1 class="font-display mt-6 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] text-white">
                            Tumbuh cerdas,<br>berakhlak di <span class="font-editorial italic font-semibold text-brand-300 whitespace-nowrap">{{ $branding['schoolShort'] ?? '' }}</span>.
                        </h1>
                        <p class="mt-6 text-base sm:text-lg text-brand-100/85 max-w-xl leading-relaxed">
                            {{ $branding['schoolName'] ?? '' }} adalah madrasah berakreditasi {{ $branding['accreditationLabel'] ?? 'B' }} yang memadukan keilmuan modern dengan nilai-nilai Islam — membentuk generasi pembelajar sepanjang hayat.
                        </p>
                        <div class="mt-9 flex flex-wrap gap-3">
                            <a href="/ppdb" data-testid="hero-cta-ppdb" class="inline-flex items-center gap-2 rounded-full bg-white text-brand-950 px-6 py-3.5 text-sm font-bold hover:bg-brand-100 transition">
                                Daftar Sekarang <i data-lucide="arrow-right" class="w-4 h-4"></i>
                            </a>
                            <a href="/profil" data-testid="hero-cta-profil" class="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 backdrop-blur-md px-6 py-3.5 text-sm font-bold hover:bg-white/10 transition">
                                <i data-lucide="play" class="w-3.5 h-3.5"></i> Jelajahi Profil
                            </a>
                        </div>
                        <div class="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            @if (isset($stats) && is_iterable($stats))
                                @foreach ($stats as $s)
                                    <div class="glass-dark rounded-2xl p-4">
                                        <div class="font-display font-black text-3xl text-white">{{ $s['value'] ?? '' }}</div>
                                        <div class="text-xs text-brand-300 mt-1 uppercase tracking-wider">{{ $s['label'] ?? '' }}</div>
                                    </div>
                                @endforeach
                            @endif
                        </div>
                    </div>
                    <div class="lg:col-span-5 relative">
                        <div class="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/30">
                            <img src="{{ $branding['heroImageUrl'] ?? '' }}" alt="{{ $branding['heroImageAlt'] ?? 'Kegiatan siswa' }}" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-gradient-to-t from-brand-950/70 to-transparent"></div>
                            <div class="absolute bottom-5 left-5 right-5 glass rounded-2xl p-4 flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white">
                                    <i data-lucide="trophy" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <div class="text-xs font-bold uppercase tracking-wider text-brand-700">Prestasi Terbaru</div>
                                    <div class="text-sm font-semibold text-brand-950">Juara OSN Matematika Provinsi</div>
                                </div>
                            </div>
                        </div>
                        <div class="absolute -top-6 -left-6 w-28 h-28 rounded-3xl glass-dark grid place-items-center rotate-[-8deg]">
                            <div class="text-center">
                                <div class="font-display font-black text-4xl text-brand-300">{{ $branding['accreditationLabel'] ?? 'B' }}</div>
                                <div class="text-[10px] uppercase tracking-widest text-brand-200">Akreditasi</div>
                            </div>
                        </div>
                        <div class="absolute -bottom-6 -right-6 rounded-2xl glass p-4 w-52">
                            <div class="flex -space-x-2 mb-2">
                                @foreach ([12, 45, 33, 27] as $i)
                                    <img src="https://i.pravatar.cc/60?img={{ $i }}" class="w-8 h-8 rounded-full border-2 border-white" alt="">
                                @endforeach
                            </div>
                            <div class="text-xs text-brand-950">
                                <span class="font-bold">842+ siswa</span> bersama kami tahun ini
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="h-24 bg-gradient-to-b from-transparent to-[#fbfcf9]"></div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5">
                <div class="md:col-span-6 lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-100 card-lift relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-40 h-40 rounded-full bg-brand-100/60 blur-2xl"></div>
                    <div class="relative">
                        <span class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Visi</span>
                        <h3 class="font-display font-extrabold text-3xl text-brand-950 mt-3 leading-tight">Terwujudnya madrasah unggul yang <span class="font-editorial italic text-brand-700">berakhlakul karimah</span>.</h3>
                        <p class="mt-4 text-brand-800/80 leading-relaxed">Berbasis iman, takwa, ilmu pengetahuan, dan teknologi — siap menjadi rahmat bagi sesama.</p>
                        <a href="/profil" class="mt-6 inline-flex items-center gap-2 font-bold text-brand-700 hover:text-brand-900">Pelajari Misi <i data-lucide="arrow-up-right" class="w-4 h-4"></i></a>
                    </div>
                </div>
                <div class="md:col-span-3 lg:col-span-5 grid grid-cols-1 gap-5">
                    @foreach ($programStudies as $p)
                        <div class="bg-brand-950 text-white rounded-3xl p-6 card-lift relative overflow-hidden">
                            <div class="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-brand-500/30 blur-2xl"></div>
                            <span class="text-xs font-bold uppercase tracking-[0.2em] text-brand-300">Program</span>
                            <div class="font-display font-extrabold text-xl mt-2">{{ $p['name'] ?? '' }}</div>
                            <p class="text-sm text-brand-200 mt-2 line-clamp-2">{{ $p['description'] ?? '' }}</p>
                            <a href="/program-studi" class="mt-4 inline-flex items-center text-brand-300 text-sm font-semibold gap-1">Detail <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></a>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
            <div class="flex items-end justify-between gap-6 flex-wrap">
                <div>
                    <div class="text-xs font-bold uppercase tracking-[0.18em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Berita Terbaru</div>
                    <h2 class="font-display text-4xl sm:text-5xl font-extrabold text-brand-950 mt-3 tracking-tight">Kabar dari madrasah.</h2>
                </div>
                <a href="/berita" class="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900">Semua Berita <i data-lucide="arrow-up-right" class="w-4 h-4"></i></a>
            </div>
            <div class="mt-10 grid md:grid-cols-3 gap-6">
                @foreach ($news as $i => $n)
                    @php
                        $big = $i === 0;
                        $slug = $n['slug'] ?? $n['id'] ?? '';
                        $dateText = isset($n['date']) ? Carbon::parse($n['date'])->locale('id')->translatedFormat('j M Y') : '';
                    @endphp
                    <a href="/berita/{{ $slug }}" class="group relative overflow-hidden rounded-3xl {{ $big ? 'md:col-span-2 md:row-span-2' : '' }}" data-testid="home-news-{{ $n['id'] ?? $i }}">
                        <div class="aspect-[{{ $big ? '16/10' : '4/3' }}] w-full overflow-hidden relative">
                            <img src="{{ $n['image'] ?? '' }}" alt="{{ $n['title'] ?? '' }}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                            <div class="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/40 to-transparent"></div>
                        </div>
                        <div class="absolute inset-0 p-6 flex flex-col justify-end">
                            <span class="inline-flex self-start items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-950 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 mb-3">{{ $n['category'] ?? '' }}</span>
                            <h3 class="font-display font-extrabold text-white {{ $big ? 'text-2xl sm:text-3xl' : 'text-lg' }} leading-tight">{{ $n['title'] ?? '' }}</h3>
                            <div class="mt-3 text-xs text-brand-200 font-medium">{{ $dateText }} · {{ $n['views'] ?? 0 }} dibaca</div>
                        </div>
                    </a>
                @endforeach
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
            <div class="flex items-end justify-between gap-6 flex-wrap">
                <div>
                    <div class="text-xs font-bold uppercase tracking-[0.18em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Guru, Pengurus, & Staf</div>
                    <h2 class="font-display text-4xl sm:text-5xl font-extrabold text-brand-950 mt-3 tracking-tight">Tim sekolah yang melayani.</h2>
                </div>
                <a href="/guru" class="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900">Lihat Semua <i data-lucide="arrow-up-right" class="w-4 h-4"></i></a>
            </div>
            <div class="mt-10 grid grid-cols-2 md:grid-cols-4 gap-5">
                @foreach ($teachers as $t)
                    <a href="/guru/{{ $t['slug'] ?? ($t['id'] ?? '') }}" class="group" data-testid="home-teacher-{{ $t['id'] ?? '' }}">
                        <div class="aspect-[3/4] rounded-3xl overflow-hidden relative bg-brand-100">
                            <img src="{{ $photoFor($t) }}" alt="{{ $t['name'] ?? '' }}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                            <div class="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent"></div>
                            <div class="absolute bottom-4 left-4 right-4 text-white">
                                <div class="text-[10px] uppercase tracking-[0.2em] text-brand-300 font-bold">{{ $t['subject'] ?? '' }}</div>
                                <div class="font-display font-bold text-lg leading-tight mt-1">{{ $t['name'] ?? '' }}</div>
                            </div>
                        </div>
                    </a>
                @endforeach
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
            <div class="flex items-end justify-between gap-6 flex-wrap">
                <div>
                    <div class="text-xs font-bold uppercase tracking-[0.18em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Karya Siswa</div>
                    <h2 class="font-display text-4xl sm:text-5xl font-extrabold text-brand-950 mt-3 tracking-tight">Karya yang lahir dari proses.</h2>
                </div>
                <a href="/karya-siswa" class="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900">Lihat Semua <i data-lucide="arrow-up-right" class="w-4 h-4"></i></a>
            </div>
            <div class="mt-10 grid md:grid-cols-3 gap-6">
                @foreach ($studentWorks as $w)
                    <a href="/karya-siswa" class="bg-white rounded-3xl border border-slate-100 overflow-hidden card-lift" data-testid="home-work-{{ $w['id'] ?? '' }}">
                        <div class="aspect-[4/3] overflow-hidden bg-brand-100"><img src="{{ $w['image'] ?? '' }}" alt="{{ $w['title'] ?? '' }}" class="w-full h-full object-cover"></div>
                        <div class="p-6">
                            <div class="text-[10px] uppercase tracking-wider text-brand-600 font-bold">{{ $w['category'] ?? '' }}</div>
                            <div class="font-display font-extrabold text-xl text-brand-950 mt-1 line-clamp-2">{{ $w['title'] ?? '' }}</div>
                            <div class="text-xs text-slate-600 mt-2">{{ $w['author'] ?? '' }}</div>
                        </div>
                    </a>
                @endforeach
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
            <div class="flex items-end justify-between gap-6 flex-wrap">
                <div>
                    <div class="text-xs font-bold uppercase tracking-[0.18em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Galeri Kegiatan</div>
                    <h2 class="font-display text-4xl sm:text-5xl font-extrabold text-brand-950 mt-3 tracking-tight">Momen kebersamaan kami.</h2>
                </div>
                <a href="/galeri" class="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900">Buka Galeri <i data-lucide="arrow-up-right" class="w-4 h-4"></i></a>
            </div>
            <div class="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                @foreach ($galleries as $g)
                    @php
                        $dateText = isset($g['date']) ? Carbon::parse($g['date'])->locale('id')->translatedFormat('j M Y') : '';
                    @endphp
                    <a href="/galeri?kategori={{ urlencode((string) ($g['category'] ?? '')) }}" class="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white card-lift" data-testid="home-gallery-{{ $g['id'] ?? '' }}">
                        <div class="aspect-[4/3] overflow-hidden">
                            <img src="{{ $g['cover'] ?? '' }}" alt="{{ $g['title'] ?? '' }}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/25 to-transparent"></div>
                        <div class="absolute bottom-5 left-5 right-5 text-white">
                            <div class="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur rounded-full px-2.5 py-1">
                                <i data-lucide="images" class="w-3 h-3"></i> {{ $categoryLabel($g['category'] ?? null) }}
                            </div>
                            <div class="font-display font-bold text-xl mt-2 leading-tight">{{ $g['title'] ?? '' }}</div>
                            <div class="text-xs text-brand-300 mt-1">{{ $dateText }}</div>
                        </div>
                    </a>
                @endforeach
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
            <div class="grid lg:grid-cols-12 gap-6">
                <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-8">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <div class="text-xs font-bold uppercase tracking-[0.18em] text-brand-700"><span class="inline-block w-8 h-px bg-brand-500 mr-2 align-middle"></span>Agenda Mendatang</div>
                            <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-brand-950 mt-2">Catat tanggal penting.</h2>
                        </div>
                        <a href="/agenda" class="text-sm font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1">Kalender <i data-lucide="arrow-up-right" class="w-4 h-4"></i></a>
                    </div>
                    <div class="divide-y divide-slate-100">
                        @foreach ($events as $e)
                            @php
                                $date = isset($e['date']) ? Carbon::parse($e['date']) : null;
                            @endphp
                            <div class="flex items-center gap-5 py-4 group">
                                <div class="w-16 h-16 rounded-2xl gradient-brand text-white flex flex-col items-center justify-center shrink-0">
                                    <div class="text-xs font-bold uppercase">{{ $date ? $date->locale('id')->translatedFormat('M') : '' }}</div>
                                    <div class="font-display font-black text-xl leading-none">{{ $date ? $date->format('d') : '' }}</div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="font-display font-bold text-brand-950">{{ $e['title'] ?? '' }}</div>
                                    <div class="text-xs text-slate-600 mt-1 flex items-center gap-3">
                                        <i data-lucide="calendar-days" class="w-3 h-3"></i> {{ $e['time'] ?? '' }} · <i data-lucide="map-pin" class="w-3 h-3"></i> {{ $e['location'] ?? '' }}
                                    </div>
                                </div>
                                <span class="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 rounded-full px-2.5 py-1">{{ $e['type'] ?? '' }}</span>
                            </div>
                        @endforeach
                    </div>
                </div>
                <div class="lg:col-span-5 relative rounded-3xl overflow-hidden bg-brand-950 text-white p-8 lg:p-10 min-h-[400px]">
                    <div class="absolute inset-0 noise-overlay opacity-30"></div>
                    <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl"></div>
                    <i data-lucide="quote" class="w-10 h-10 text-brand-400 relative"></i>
                    <p class="font-editorial italic text-2xl sm:text-3xl leading-snug mt-6 relative">
                        "Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya."
                    </p>
                    <div class="mt-6 text-sm text-brand-300 relative">— HR. Bukhari</div>
                    <div class="mt-10 pt-6 border-t border-brand-800 flex items-center gap-4 relative">
                        <img src="https://images.unsplash.com/photo-1515994034738-1f437c226687?w=120&q=80" alt="" class="w-14 h-14 rounded-full object-cover">
                        <div>
                            <div class="font-display font-bold">{{ is_array($primaryAlumni) ? ($primaryAlumni['name'] ?? 'Alumni') : 'Alumni' }}</div>
                            <div class="text-xs text-brand-300">{{ is_array($primaryAlumni) && isset($primaryAlumni['year']) ? 'Alumni Angkatan ' . $primaryAlumni['year'] : 'Testimoni alumni akan tampil di sini' }}</div>
                        </div>
                    </div>
                    <p class="text-sm text-brand-200 leading-relaxed mt-4 relative">{{ is_array($primaryAlumni) ? ($primaryAlumni['testimonial'] ?? 'Belum ada data alumni. Admin bisa menambahkan testimoni alumni dari dashboard.') : 'Belum ada data alumni. Admin bisa menambahkan testimoni alumni dari dashboard.' }}</p>
                </div>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-10">
            <div class="relative overflow-hidden rounded-[2.5rem] p-10 lg:p-16 gradient-brand text-white">
                <div class="absolute inset-0 noise-overlay opacity-30"></div>
                <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
                <div class="relative grid lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-100">Mulai perjalanan ilmu</div>
                        <h2 class="font-display text-4xl sm:text-5xl font-black mt-3 tracking-tight leading-[1.05] text-white">Siap menjadi bagian dari keluarga <span class="font-editorial italic whitespace-nowrap">{{ $branding['schoolShort'] ?? '' }}</span>?</h2>
                        <p class="text-brand-100/90 mt-5 text-base max-w-lg">Kuota terbatas, beasiswa tersedia untuk siswa berprestasi. Daftar hari ini dan mulai tumbuh bersama kami.</p>
                    </div>
                    <div class="flex flex-wrap gap-3 lg:justify-end">
                        <a href="/ppdb" data-testid="cta-daftar-ppdb" class="inline-flex items-center gap-2 rounded-full bg-white text-brand-950 px-7 py-4 font-bold hover:bg-brand-100 transition">
                            Daftar PPDB <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </a>
                        <a href="/kontak" class="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 backdrop-blur px-7 py-4 font-bold hover:bg-white/10 transition">
                            Hubungi Kami
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </div>
@endsection
