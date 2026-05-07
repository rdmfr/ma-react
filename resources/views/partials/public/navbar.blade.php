@php
    $navItems = [
        ['label' => 'Beranda', 'to' => '/'],
        ['label' => 'Profil', 'to' => '/profil'],
        [
            'label' => 'Akademik',
            'children' => [
                ['label' => 'Guru & Staff', 'to' => '/guru'],
                ['label' => 'Program Studi', 'to' => '/program-studi'],
                ['label' => 'Modul Pembelajaran', 'to' => '/modul'],
                ['label' => 'Alumni', 'to' => '/alumni'],
            ],
        ],
        [
            'label' => 'Kesiswaan',
            'children' => [
                ['label' => 'Ekstrakurikuler', 'to' => '/ekstrakurikuler'],
                ['label' => 'Karya Siswa', 'to' => '/karya-siswa'],
                ['label' => 'Galeri', 'to' => '/galeri'],
                ['label' => 'Agenda', 'to' => '/agenda'],
            ],
        ],
        [
            'label' => 'Informasi',
            'children' => [
                ['label' => 'Berita', 'to' => '/berita'],
                ['label' => 'Refleksi', 'to' => '/refleksi'],
                ['label' => 'Pengumuman', 'to' => '/pengumuman'],
                ['label' => 'FAQ', 'to' => '/faq'],
            ],
        ],
        ['label' => 'PPDB', 'to' => '/ppdb'],
        ['label' => 'Kontak', 'to' => '/kontak'],
    ];
@endphp

<header class="sticky top-0 z-50" data-testid="public-navbar" x-data="{ open: false, openSub: null, searchOpen: false, searchVal: '' }">
    <div class="bg-brand-950 text-brand-100 text-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
            <span class="truncate">{{ $branding['address'] ?? '' }}</span>
            <div class="hidden md:flex items-center gap-5">
                <span>✉ {{ $branding['email'] ?? '' }}</span>
                <span>☎ {{ $branding['phone'] ?? '' }}</span>
            </div>
        </div>
    </div>
    <div class="glass border-b border-white/40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
            <a href="/" data-testid="nav-logo" class="flex items-center gap-3 group">
                <div class="w-11 h-11 rounded-xl bg-white border border-brand-100 p-1.5 flex items-center justify-center shadow-sm">
                    <img src="{{ $branding['logoUrl'] ?? '' }}" alt="{{ $branding['schoolName'] ?? '' }}" class="w-full h-full object-contain" />
                </div>
                <div class="leading-tight">
                    <div class="font-display font-extrabold text-brand-950 text-lg tracking-tight">{{ $branding['schoolName'] ?? '' }}</div>
                    <div class="text-[11px] text-brand-700 font-medium">{{ $branding['schoolTagline'] ?? '' }}</div>
                </div>
            </a>
            <nav class="hidden lg:flex items-center gap-1">
                @foreach ($navItems as $it)
                    @if (array_key_exists('children', $it))
                        <div class="relative" x-on:mouseenter="openSub='{{ $it['label'] }}'" x-on:mouseleave="openSub=null">
                            <button type="button" class="px-3 py-2 text-sm font-semibold text-brand-950 hover:text-brand-700 inline-flex items-center gap-1" data-testid="nav-{{ strtolower($it['label']) }}">
                                {{ $it['label'] }} <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
                            </button>
                            <div class="absolute top-full left-0 pt-2 min-w-56 animate-fade-up" x-show="openSub === '{{ $it['label'] }}'" x-cloak>
                                <div class="glass rounded-xl p-2 shadow-xl">
                                    @foreach ($it['children'] as $c)
                                        @php
                                            $active = request()->is(ltrim($c['to'], '/')) || (request()->path() === '/' && $c['to'] === '/');
                                        @endphp
                                        <a href="{{ $c['to'] }}" class="block px-3 py-2 rounded-lg text-sm font-medium {{ $active ? 'bg-brand-100 text-brand-900' : 'text-brand-950 hover:bg-brand-50' }}">
                                            {{ $c['label'] }}
                                        </a>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    @else
                        @php
                            $active = request()->is(ltrim($it['to'], '/')) || (request()->path() === '/' && $it['to'] === '/');
                        @endphp
                        <a href="{{ $it['to'] }}" class="px-3 py-2 text-sm font-semibold rounded-lg transition-colors {{ $active ? 'text-brand-700' : 'text-brand-950 hover:text-brand-700' }}" data-testid="nav-{{ strtolower($it['label']) }}">
                            {{ $it['label'] }}
                        </a>
                    @endif
                @endforeach
            </nav>
            <div class="flex items-center gap-3">
                <button type="button" x-on:click="searchOpen=true" class="hidden md:inline-flex w-10 h-10 rounded-full border border-brand-200 items-center justify-center text-brand-900 hover:bg-brand-50 transition" aria-label="search" data-testid="nav-search-btn">
                    <i data-lucide="search" class="w-4 h-4"></i>
                </button>
                @auth
                    <a href="/{{ auth()->user()->role }}" data-testid="nav-login-btn" class="inline-flex items-center gap-2 rounded-full gradient-brand gradient-brand-hover text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-brand-900/20 transition">
                        <i data-lucide="layout-dashboard" class="w-4 h-4"></i> Dashboard
                    </a>
                @else
                    <a href="/login" data-testid="nav-login-btn" class="inline-flex items-center gap-2 rounded-full gradient-brand gradient-brand-hover text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-brand-900/20 transition">
                        <i data-lucide="log-in" class="w-4 h-4"></i> Masuk
                    </a>
                @endauth
                <button type="button" class="lg:hidden w-10 h-10 rounded-lg border border-brand-200 flex items-center justify-center" x-on:click="open=!open" aria-label="menu" data-testid="nav-mobile-toggle">
                    <template x-if="open">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </template>
                    <template x-if="!open">
                        <i data-lucide="menu" class="w-5 h-5"></i>
                    </template>
                </button>
            </div>
        </div>
        <div class="lg:hidden border-t border-brand-100 bg-white" x-show="open" x-cloak>
            <div class="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1 max-h-[70vh] overflow-y-auto thin-scroll">
                @foreach ($navItems as $it)
                    @if (array_key_exists('children', $it))
                        <details class="group">
                            <summary class="px-3 py-2 text-sm font-semibold text-brand-950 cursor-pointer flex items-center justify-between">
                                {{ $it['label'] }}
                                <i data-lucide="chevron-down" class="w-4 h-4 transition group-open:rotate-180"></i>
                            </summary>
                            <div class="pl-4 flex flex-col">
                                @foreach ($it['children'] as $c)
                                    <a href="{{ $c['to'] }}" x-on:click="open=false" class="px-3 py-2 text-sm text-brand-800 hover:text-brand-600">{{ $c['label'] }}</a>
                                @endforeach
                            </div>
                        </details>
                    @else
                        <a href="{{ $it['to'] }}" x-on:click="open=false" class="px-3 py-2 text-sm font-semibold text-brand-950">{{ $it['label'] }}</a>
                    @endif
                @endforeach
                @auth
                    <form method="POST" action="{{ route('logout') }}" class="mt-2">
                        @csrf
                        <button type="submit" class="w-full px-3 py-2 text-sm font-semibold text-brand-950 text-left">Keluar</button>
                    </form>
                @endauth
            </div>
        </div>
    </div>
    <div class="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-[60] flex items-start justify-center pt-32 px-4" x-show="searchOpen" x-on:click="searchOpen=false" x-cloak data-testid="search-modal">
        <form method="GET" action="/search" class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-up" x-on:click.stop>
            <div class="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                <i data-lucide="search" class="w-5 h-5 text-brand-600"></i>
                <input x-ref="searchInput" x-model="searchVal" name="q" placeholder="Cari berita, guru, modul..." class="flex-1 text-lg bg-transparent outline-none text-brand-950 placeholder:text-slate-400" data-testid="nav-search-input" />
                <button type="button" x-on:click="searchOpen=false" class="text-xs font-bold text-slate-500 hover:text-brand-700 px-2 py-1 rounded border border-slate-200">ESC</button>
            </div>
            <div class="p-6">
                <div class="text-xs uppercase tracking-wider font-bold text-slate-500 mb-3">Coba cari</div>
                <div class="flex flex-wrap gap-2">
                    @foreach (['Matematika', 'PPDB', 'Tahfidz', 'Pramuka', 'Beasiswa'] as $s)
                        <button type="button" x-on:click="searchVal='{{ $s }}'" class="rounded-full bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold px-3 py-1.5">{{ $s }}</button>
                    @endforeach
                </div>
            </div>
        </form>
    </div>
</header>
