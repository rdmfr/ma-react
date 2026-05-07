@extends('dashboard.shell')

@section('dashboard')
    <div class="max-w-7xl">
        <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Guru</div>
        <h1 class="font-display text-4xl font-extrabold text-brand-950 mt-2 tracking-tight">Ikhtisar</h1>
        
        <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm card-lift">
                <div class="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4">
                    <i data-lucide="book-open" class="w-6 h-6"></i>
                </div>
                <div class="text-sm font-bold text-slate-500 uppercase tracking-wider">Mata Pelajaran</div>
                <div class="text-3xl font-black text-brand-950 mt-1">{{ $stats['subjects'] }}</div>
            </div>
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm card-lift">
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                    <i data-lucide="users" class="w-6 h-6"></i>
                </div>
                <div class="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Siswa</div>
                <div class="text-3xl font-black text-brand-950 mt-1">{{ $stats['students'] }}</div>
            </div>
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm card-lift">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                    <i data-lucide="file-text" class="w-6 h-6"></i>
                </div>
                <div class="text-sm font-bold text-slate-500 uppercase tracking-wider">Modul Anda</div>
                <div class="text-3xl font-black text-brand-950 mt-1">{{ $stats['modules'] }}</div>
            </div>
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm card-lift">
                <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                    <i data-lucide="award" class="w-6 h-6"></i>
                </div>
                <div class="text-sm font-bold text-slate-500 uppercase tracking-wider">Input Nilai</div>
                <div class="text-3xl font-black text-brand-950 mt-1">{{ $stats['scores_count'] }}</div>
            </div>
        </div>

        <div class="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-100 overflow-hidden">
                <div class="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h3 class="font-display font-bold text-lg text-brand-950">Nilai Terbaru</h3>
                    <i data-lucide="history" class="w-5 h-5 text-slate-400"></i>
                </div>
                <div class="divide-y divide-slate-50">
                    @foreach($recent_scores as $score)
                        <div class="p-5 flex items-center gap-4 hover:bg-slate-50 transition">
                            <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 text-sm font-black">
                                {{ $score->data['score'] ?? '-' }}
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="text-sm font-bold text-brand-950 truncate">
                                    {{ $score->data['nis'] ?? 'Siswa' }} - {{ $score->data['subject'] ?? 'Mapel' }}
                                </div>
                                <div class="text-xs text-slate-500">{{ $score->updated_at->diffForHumans() }}</div>
                            </div>
                            <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300"></i>
                        </div>
                    @endforeach
                    @if($recent_scores->isEmpty())
                        <div class="p-10 text-center text-slate-400 text-sm italic">Belum ada input nilai terbaru.</div>
                    @endif
                </div>
            </div>

            <div class="space-y-6">
                <div class="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                    <h3 class="font-display font-bold text-slate-900 mb-4">Pintasan Guru</h3>
                    <div class="grid grid-cols-1 gap-2">
                        <a href="{{ route('teacher.scores') }}" class="flex items-center gap-3 p-3 rounded-2xl hover:bg-brand-50 text-slate-600 hover:text-brand-700 transition">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            <span class="text-sm font-semibold">Input Nilai Siswa</span>
                        </a>
                        <a href="{{ route('teacher.modules') }}" class="flex items-center gap-3 p-3 rounded-2xl hover:bg-brand-50 text-slate-600 hover:text-brand-700 transition">
                            <i data-lucide="upload-cloud" class="w-4 h-4"></i>
                            <span class="text-sm font-semibold">Unggah Modul Baru</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
