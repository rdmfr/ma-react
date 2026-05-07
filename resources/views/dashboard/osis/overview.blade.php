@extends('dashboard.shell')

@section('dashboard')
    <div class="max-w-7xl">
        <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">OSIS</div>
        <h1 class="font-display text-4xl font-extrabold text-brand-950 mt-2 tracking-tight">Ikhtisar</h1>
        
        <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm card-lift">
                <div class="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4">
                    <i data-lucide="calendar" class="w-6 h-6"></i>
                </div>
                <div class="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Agenda</div>
                <div class="text-3xl font-black text-brand-950 mt-1">{{ $stats['events'] }}</div>
            </div>
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm card-lift">
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                    <i data-lucide="image" class="w-6 h-6"></i>
                </div>
                <div class="text-sm font-bold text-slate-500 uppercase tracking-wider">Album Galeri</div>
                <div class="text-3xl font-black text-brand-950 mt-1">{{ $stats['galleries'] }}</div>
            </div>
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm card-lift">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                    <i data-lucide="megaphone" class="w-6 h-6"></i>
                </div>
                <div class="text-sm font-bold text-slate-500 uppercase tracking-wider">Pengumuman</div>
                <div class="text-3xl font-black text-brand-950 mt-1">{{ $stats['announcements'] }}</div>
            </div>
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm card-lift">
                <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                    <i data-lucide="sparkles" class="w-6 h-6"></i>
                </div>
                <div class="text-sm font-bold text-slate-500 uppercase tracking-wider">Karya Siswa</div>
                <div class="text-3xl font-black text-brand-950 mt-1">{{ $stats['student_works'] }}</div>
            </div>
        </div>

        <div class="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-100 overflow-hidden">
                <div class="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h3 class="font-display font-bold text-lg text-brand-950">Agenda Mendatang</h3>
                    <i data-lucide="clock" class="w-5 h-5 text-slate-400"></i>
                </div>
                <div class="divide-y divide-slate-50">
                    @foreach($upcoming_events as $event)
                        <div class="p-5 flex items-center gap-4 hover:bg-slate-50 transition">
                            <div class="w-10 h-10 rounded-xl bg-brand-50 flex flex-col items-center justify-center text-brand-700 shrink-0">
                                <span class="text-[10px] font-bold uppercase leading-none">{{ date('M', strtotime($event->data['date'])) }}</span>
                                <span class="text-sm font-black">{{ date('d', strtotime($event->data['date'])) }}</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="text-sm font-bold text-brand-950 truncate">
                                    {{ $event->data['title'] ?? 'Agenda Tanpa Judul' }}
                                </div>
                                <div class="text-xs text-slate-500">{{ $event->data['location'] ?? 'Lokasi belum ditentukan' }}</div>
                            </div>
                            <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300"></i>
                        </div>
                    @endforeach
                    @if($upcoming_events->isEmpty())
                        <div class="p-10 text-center text-slate-400 text-sm italic">Belum ada agenda mendatang.</div>
                    @endif
                </div>
            </div>

            <div class="space-y-6">
                <div class="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                    <h3 class="font-display font-bold text-slate-900 mb-4">Kontribusi OSIS</h3>
                    <div class="grid grid-cols-1 gap-2">
                        <a href="{{ route('osis.events') }}" class="flex items-center gap-3 p-3 rounded-2xl hover:bg-brand-50 text-slate-600 hover:text-brand-700 transition">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            <span class="text-sm font-semibold">Ajukan Agenda Baru</span>
                        </a>
                        <a href="{{ route('osis.works') }}" class="flex items-center gap-3 p-3 rounded-2xl hover:bg-brand-50 text-slate-600 hover:text-brand-700 transition">
                            <i data-lucide="sparkles" class="w-4 h-4"></i>
                            <span class="text-sm font-semibold">Unggah Karya Siswa</span>
                        </a>
                        <a href="{{ route('osis.gallery') }}" class="flex items-center gap-3 p-3 rounded-2xl hover:bg-brand-50 text-slate-600 hover:text-brand-700 transition">
                            <i data-lucide="image" class="w-4 h-4"></i>
                            <span class="text-sm font-semibold">Tambah Foto Galeri</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
