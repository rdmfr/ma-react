@php
    $role = auth()->user()->role ?? '';
    $roleLabel = ['admin' => 'Administrator', 'teacher' => 'Guru', 'osis' => 'OSIS'][$role] ?? 'Dashboard';

    $adminNav = [
        ['section' => 'Umum', 'items' => [
            ['to' => '/admin', 'label' => 'Ikhtisar', 'icon' => 'layout-dashboard'],
            ['to' => '/admin/approval', 'label' => 'Persetujuan', 'icon' => 'clipboard-check'],
            ['to' => '/admin/notifications', 'label' => 'Notifikasi', 'icon' => 'bell'],
        ]],
        ['section' => 'Pengguna', 'items' => [
            ['to' => '/admin/users', 'label' => 'Manajemen Pengguna', 'icon' => 'users'],
            ['to' => '/admin/teachers', 'label' => 'Manajemen Guru', 'icon' => 'graduation-cap'],
            ['to' => '/admin/students', 'label' => 'Manajemen Siswa', 'icon' => 'user-plus'],
        ]],
        ['section' => 'Akademik', 'items' => [
            ['to' => '/admin/academic-years', 'label' => 'Tahun Ajaran & Kelas', 'icon' => 'calendar-range'],
            ['to' => '/admin/subjects', 'label' => 'Mata Pelajaran', 'icon' => 'book-open-text'],
            ['to' => '/admin/scores', 'label' => 'Nilai', 'icon' => 'file-bar-chart-2'],
            ['to' => '/admin/report-cards', 'label' => 'Rapor', 'icon' => 'scroll-text'],
            ['to' => '/admin/modules', 'label' => 'Modul', 'icon' => 'book-copy'],
        ]],
        ['section' => 'Konten', 'items' => [
            ['to' => '/admin/content', 'label' => 'Manajemen Konten', 'icon' => 'newspaper'],
            ['to' => '/admin/ppdb', 'label' => 'PPDB', 'icon' => 'school'],
            ['to' => '/admin/messages', 'label' => 'Pesan Masuk', 'icon' => 'inbox'],
        ]],
        ['section' => 'Sistem', 'items' => [
            ['to' => '/admin/settings', 'label' => 'Pengaturan & Branding', 'icon' => 'settings'],
            ['to' => '/admin/activity', 'label' => 'Log Aktivitas', 'icon' => 'activity'],
        ]],
    ];

    $teacherNav = [
        ['section' => 'Mengajar', 'items' => [
            ['to' => '/teacher', 'label' => 'Ikhtisar', 'icon' => 'layout-dashboard'],
            ['to' => '/teacher/classes', 'label' => 'Kelas Saya', 'icon' => 'graduation-cap'],
            ['to' => '/teacher/scores', 'label' => 'Input Nilai', 'icon' => 'file-bar-chart-2'],
            ['to' => '/teacher/evaluations', 'label' => 'Jadwal Evaluasi', 'icon' => 'calendar-range'],
        ]],
        ['section' => 'Konten', 'items' => [
            ['to' => '/teacher/modules', 'label' => 'Unggah Modul', 'icon' => 'upload'],
            ['to' => '/teacher/submissions', 'label' => 'Submisi Konten', 'icon' => 'file-check'],
        ]],
        ['section' => 'Akun', 'items' => [
            ['to' => '/teacher/profile', 'label' => 'Profil Saya', 'icon' => 'user'],
        ]],
    ];

    $osisNav = [
        ['section' => 'Beranda', 'items' => [
            ['to' => '/osis', 'label' => 'Ikhtisar', 'icon' => 'layout-dashboard'],
        ]],
        ['section' => 'Submisi', 'items' => [
            ['to' => '/osis/extra', 'label' => 'Ekstrakurikuler', 'icon' => 'trophy'],
            ['to' => '/osis/works', 'label' => 'Karya Siswa', 'icon' => 'book-marked'],
            ['to' => '/osis/events', 'label' => 'Usulan Acara', 'icon' => 'calendar-range'],
            ['to' => '/osis/gallery', 'label' => 'Galeri Kegiatan', 'icon' => 'images'],
            ['to' => '/osis/announcements', 'label' => 'Draft Pengumuman', 'icon' => 'megaphone'],
        ]],
        ['section' => 'Akun', 'items' => [
            ['to' => '/osis/profile', 'label' => 'Profil Saya', 'icon' => 'user'],
        ]],
    ];

    $nav = ['admin' => $adminNav, 'teacher' => $teacherNav, 'osis' => $osisNav][$role] ?? [];
    $path = '/' . ltrim(request()->path(), '/');
    $collapsed = false;
@endphp

@extends('layouts.dashboard')

@section('content')
    <div class="flex h-screen bg-[#f4f5f1] overflow-hidden" x-data="{ collapsed: false }">
        <aside class="transition-all duration-300 shrink-0 bg-brand-950 text-brand-100 flex flex-col relative" x-bind:class="collapsed ? 'w-20' : 'w-72'" data-testid="dashboard-sidebar">
            <div class="absolute inset-0 noise-overlay opacity-20 pointer-events-none"></div>
            <div class="relative h-20 flex items-center gap-3 border-b border-brand-900" x-bind:class="collapsed ? 'justify-center px-0' : 'px-5'">
                <div class="w-11 h-11 rounded-xl bg-white p-1.5 shrink-0"><img src="{{ $branding['logoUrl'] ?? '' }}" alt="{{ $branding['schoolName'] ?? '' }}" class="w-full h-full object-contain"></div>
                <div class="leading-tight overflow-hidden" x-show="!collapsed" x-cloak>
                    <div class="font-display font-extrabold text-white truncate">{{ $branding['schoolName'] ?? '' }}</div>
                    <div class="text-[11px] text-brand-400 uppercase tracking-wider">{{ $roleLabel }} Panel</div>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto thin-scroll py-4 px-3 space-y-6 relative">
                @foreach ($nav as $group)
                    <div>
                        <div class="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-400" x-show="!collapsed" x-cloak>{{ $group['section'] }}</div>
                        <div class="space-y-1">
                            @foreach ($group['items'] as $it)
                                @php
                                    $isActive = $path === $it['to'];
                                @endphp
                                <a href="{{ $it['to'] }}" class="group relative flex items-center gap-3 rounded-xl transition-all {{ $isActive ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/10 text-white border border-brand-500/30' : 'text-brand-200 hover:text-white hover:bg-brand-900/60' }}" x-bind:class="collapsed ? 'justify-center px-3 py-3' : 'px-3 py-2.5'">
                                    <span class="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-brand-400" x-show="{{ $isActive ? 'true' : 'false' }} && !collapsed" x-cloak></span>
                                    <i data-lucide="{{ $it['icon'] }}" class="w-[18px] h-[18px] shrink-0 {{ $isActive ? 'text-brand-400' : '' }}"></i>
                                    <span class="text-sm font-medium flex-1 truncate" x-show="!collapsed" x-cloak>{{ $it['label'] }}</span>
                                    @if($it['to'] === '/admin/approval')
                                        @php $pCount = \App\Models\Record::where('data->status', 'pending')->count(); @endphp
                                        @if($pCount > 0)
                                            <span class="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center" x-show="!collapsed" x-cloak>{{ $pCount }}</span>
                                        @endif
                                    @endif
                                </a>
                            @endforeach
                        </div>
                    </div>
                @endforeach
            </div>
            <div class="relative border-t border-brand-900 p-3" x-bind:class="collapsed ? 'flex justify-center' : ''">
                <form method="POST" action="{{ route('logout') }}" class="w-full">
                    @csrf
                    <button type="submit" class="bg-brand-900/50 hover:bg-red-500/20 text-brand-200 hover:text-red-300 flex items-center gap-3 transition" x-bind:class="collapsed ? 'w-12 h-12 rounded-xl justify-center' : 'w-full px-3 py-2.5 rounded-xl'">
                        <i data-lucide="log-out" class="w-4 h-4 shrink-0"></i>
                        <span class="text-sm font-semibold" x-show="!collapsed" x-cloak>Keluar</span>
                    </button>
                </form>
            </div>
        </aside>

        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-20 shrink-0 glass border-b border-white/60 px-6 lg:px-8 flex items-center justify-between gap-4" data-testid="dashboard-topbar">
                <div class="flex items-center gap-3">
                    <button type="button" x-on:click="collapsed = !collapsed" class="w-10 h-10 rounded-xl border border-brand-100 bg-white hover:bg-brand-50 flex items-center justify-center text-brand-900" data-testid="sidebar-toggle-btn">
                        <i data-lucide="panel-left-close" class="w-4 h-4" x-show="!collapsed" x-cloak></i>
                        <i data-lucide="panel-left" class="w-4 h-4" x-show="collapsed" x-cloak></i>
                    </button>
                    <div class="hidden md:flex items-center gap-2 bg-white border border-brand-100 rounded-xl px-4 py-2.5 w-96">
                        <i data-lucide="search" class="w-4 h-4 text-brand-600"></i>
                        <input placeholder="Cari apa saja..." class="bg-transparent flex-1 outline-none text-sm placeholder:text-slate-400">
                        <kbd class="text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">⏎</kbd>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-3 rounded-xl bg-white border border-brand-100 px-3 py-2">
                        <div class="w-8 h-8 rounded-full bg-brand-100 overflow-hidden">
                            <img src="{{ auth()->user()->avatar_url ?? 'https://i.pravatar.cc/120?u=' . urlencode((string) (auth()->user()->email ?? '')) }}" alt="" class="w-full h-full object-cover">
                        </div>
                        <div class="leading-tight hidden sm:block">
                            <div class="text-sm font-bold text-brand-950">{{ auth()->user()->name ?? '' }}</div>
                            <div class="text-[11px] text-slate-500">{{ $roleLabel }}</div>
                        </div>
                    </div>
                </div>
            </header>
            <main class="flex-1 overflow-y-auto thin-scroll p-6 lg:p-10 page-enter" data-testid="dashboard-main">
                @yield('dashboard')
            </main>
        </div>
    </div>
@endsection

