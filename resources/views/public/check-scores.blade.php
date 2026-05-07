@extends('layouts.public')

@section('title', 'Cek Nilai Siswa')

@section('content')
<div class="min-h-[70vh] bg-brand-50/30 py-20 px-6">
    <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
            <h1 class="font-display text-4xl font-black text-brand-950 tracking-tight">Cek Nilai Siswa</h1>
            <p class="text-slate-600 mt-2">Masukkan NIS untuk melihat hasil belajar siswa.</p>
        </div>

        <div class="bg-white rounded-3xl border border-brand-100 shadow-xl shadow-brand-900/5 p-8">
            <form action="{{ route('public.check-scores.search') }}" method="POST" class="flex flex-col sm:flex-row gap-4">
                @csrf
                <div class="flex-1 relative">
                    <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"></i>
                    <input type="text" name="nis" value="{{ $nis ?? '' }}" required placeholder="Masukkan NIS Siswa (contoh: 12345)" class="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition text-lg">
                </div>
                <button type="submit" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold transition shadow-lg shadow-brand-600/20">
                    Cek Hasil
                </button>
            </form>

            @if(session('error'))
                <div class="mt-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center gap-3">
                    <i data-lucide="alert-circle" class="w-5 h-5"></i>
                    {{ session('error') }}
                </div>
            @endif

            @if(isset($student))
                <div class="mt-12 animate-fade-up">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                        <div>
                            <div class="text-xs font-bold uppercase tracking-widest text-brand-700">Data Siswa</div>
                            <h2 class="font-display text-3xl font-black text-brand-950 mt-1">{{ $student['name'] }}</h2>
                            <div class="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
                                <span class="flex items-center gap-1.5"><i data-lucide="hash" class="w-4 h-4 text-slate-400"></i> {{ $student['nis'] }}</span>
                                <span class="flex items-center gap-1.5"><i data-lucide="graduation-cap" class="w-4 h-4 text-slate-400"></i> {{ $student['class'] }} - {{ $student['jurusan'] }}</span>
                            </div>
                        </div>
                        <div class="px-6 py-4 bg-brand-50 rounded-2xl border border-brand-100">
                            <div class="text-[10px] font-bold uppercase text-brand-700 text-center">Status Siswa</div>
                            <div class="text-lg font-black text-brand-900 text-center">{{ $student['status'] ?? 'Aktif' }}</div>
                        </div>
                    </div>

                    <div class="mt-8">
                        <h3 class="font-display font-bold text-lg text-brand-950 mb-4">Daftar Nilai Mata Pelajaran</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            @foreach($scores as $score)
                                <div class="p-5 rounded-2xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/50 transition bg-white flex items-center justify-between group">
                                    <div>
                                        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ $score['semester'] ?? 'Semester' }} {{ $score['academic_year'] ?? '' }}</div>
                                        <div class="font-bold text-brand-950 mt-0.5 group-hover:text-brand-700 transition">{{ $score['subject'] }}</div>
                                    </div>
                                    <div class="text-2xl font-black text-brand-600 bg-brand-50 w-14 h-14 rounded-xl flex items-center justify-center border border-brand-100 group-hover:bg-brand-600 group-hover:text-white transition">
                                        {{ $score['score'] }}
                                    </div>
                                </div>
                            @endforeach
                        </div>

                        @if($scores->isEmpty())
                            <div class="py-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <i data-lucide="file-warning" class="w-12 h-12 mx-auto mb-4 opacity-20"></i>
                                <p>Belum ada nilai yang diinput untuk siswa ini.</p>
                            </div>
                        @endif
                    </div>
                </div>
            @endif
        </div>

        <div class="mt-12 text-center text-sm text-slate-500">
            <p>Butuh bantuan? Hubungi <a href="/kontak" class="text-brand-700 font-semibold underline">Layanan Bantuan Madrasah</a></p>
        </div>
    </div>
</div>
@endsection
