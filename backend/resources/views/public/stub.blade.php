@extends('layouts.public')

@section('title', ($title ?? '') . ' · ' . ($branding['schoolName'] ?? 'Website'))

@section('content')
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div class="bg-white border border-slate-100 rounded-3xl p-8">
            <div class="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">{{ $branding['schoolShort'] ?? '' }}</div>
            <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-brand-950 mt-3 tracking-tight">{{ $title ?? '' }}</h1>
            @if (!empty($subtitle))
                <div class="mt-2 text-sm text-slate-600">{{ $subtitle }}</div>
            @endif
        </div>
    </section>
@endsection
