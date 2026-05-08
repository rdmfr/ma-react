@php
    $photo = ($t['photo'] ?? null) ?: ('https://i.pravatar.cc/900?u=' . urlencode((string) (($t['slug'] ?? ($t['name'] ?? ($t['id'] ?? ''))))));
    $hasBio = isset($t['bio']) && trim((string) $t['bio']) !== '';
    $hasEducation = isset($t['education']) && trim((string) $t['education']) !== '';
@endphp

@extends('layouts.public')

@section('content')
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="guru-detail-page">
        <a href="/guru" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 mb-8"><i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali ke daftar guru</a>
        <div class="grid lg:grid-cols-12 gap-10">
            <div class="lg:col-span-5">
                <div class="aspect-[3/4] rounded-3xl overflow-hidden bg-brand-100"><img src="{{ $photo }}" alt="{{ $t['name'] ?? '' }}" class="w-full h-full object-cover"></div>
            </div>
            <div class="lg:col-span-7">
                @php
                    $category = (string) ($t['category'] ?? '');
                    $position = (string) ($t['position'] ?? '');
                    $subjects = $t['subjects'] ?? null;
                    $subjectsLine = is_array($subjects) && count($subjects) > 0 ? implode(', ', $subjects) : ((string) ($t['subject'] ?? ''));
                @endphp
                <div class="flex items-center gap-2 flex-wrap">
                    @if ($category !== '')
                        <span class="text-[10px] font-bold uppercase tracking-[0.2em] bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">{{ $category }}</span>
                    @endif
                    <span class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">{{ $position !== '' ? $position : ($t['subject'] ?? 'Guru & Staf') }}</span>
                </div>
                <h1 class="font-display text-5xl font-black text-brand-950 mt-3 tracking-tight leading-[0.95]">{{ $t['name'] ?? '' }}</h1>
                @if ($hasBio)
                    <p class="mt-6 text-brand-800/85 text-lg leading-relaxed">{{ $t['bio'] }}</p>
                @endif
                <div class="mt-8 grid sm:grid-cols-2 gap-4">
                    @if ($hasEducation)
                        <div class="bg-white rounded-2xl p-5 border border-slate-100">
                            <div class="flex items-center gap-2 text-brand-700"><i data-lucide="briefcase" class="w-4 h-4"></i><span class="text-xs font-bold uppercase tracking-wider">Pendidikan</span></div>
                            <div class="mt-2 font-semibold text-brand-950">{{ $t['education'] }}</div>
                        </div>
                    @endif
                    <div class="bg-white rounded-2xl p-5 border border-slate-100 sm:col-span-2">
                        <div class="flex items-center gap-2 text-brand-700"><i data-lucide="briefcase" class="w-4 h-4"></i><span class="text-xs font-bold uppercase tracking-wider">Jabatan / Mapel</span></div>
                        <div class="mt-2 font-semibold text-brand-950">{{ $position !== '' ? $position : '-' }}</div>
                        @if ($subjectsLine !== '')
                            <div class="mt-1 text-sm text-slate-600">{{ $subjectsLine }}</div>
                        @endif
                    </div>
                    @if (!empty($t['contact']))
                        <div class="bg-white rounded-2xl p-5 border border-slate-100 sm:col-span-2">
                            <div class="flex items-center gap-2 text-brand-700"><i data-lucide="mail" class="w-4 h-4"></i><span class="text-xs font-bold uppercase tracking-wider">Kontak</span></div>
                            <a href="mailto:{{ $t['contact'] }}" class="mt-2 font-semibold text-brand-950 hover:text-brand-700 block">{{ $t['contact'] }}</a>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
@endsection
