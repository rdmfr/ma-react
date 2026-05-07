@extends('dashboard.shell')

@section('dashboard')
    <div class="max-w-7xl">
        <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Admin</div>
        <h1 class="font-display text-4xl font-extrabold text-brand-950 mt-2 tracking-tight">Antrian Persetujuan</h1>
        <p class="mt-2 text-slate-600 text-sm">Review dan setujui konten yang diajukan oleh Guru dan OSIS.</p>

        <div class="mt-10 space-y-4">
            @foreach($pending as $item)
                <div class="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-lg transition shadow-sm">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                            <i data-lucide="clock" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-black uppercase text-slate-600">{{ $item['label'] }}</span>
                                <span class="text-xs text-slate-400">{{ $item['time'] }}</span>
                            </div>
                            <h3 class="font-display font-extrabold text-brand-950 mt-1">{{ $item['data']['title'] ?? ($item['data']['name'] ?? 'Data Tanpa Judul') }}</h3>
                            <p class="text-xs text-slate-500 mt-1">Diajukan oleh: {{ $item['data']['author'] ?? ($item['data']['teacher_id'] ?? 'User') }}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 w-full md:w-auto">
                        <form action="{{ route('admin.approval.approve', $item['id']) }}" method="POST" class="flex-1 md:flex-none">
                            @csrf
                            <button type="submit" class="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-2.5 text-xs font-bold shadow-lg shadow-brand-900/10">
                                <i data-lucide="check" class="w-3.5 h-3.5"></i> Setujui
                            </button>
                        </form>
                        <form action="{{ route('admin.approval.reject', $item['id']) }}" method="POST" class="flex-1 md:flex-none">
                            @csrf
                            <button type="submit" class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 text-red-600 hover:bg-red-50 px-5 py-2.5 text-xs font-bold transition">
                                <i data-lucide="x" class="w-3.5 h-3.5"></i> Tolak
                            </button>
                        </form>
                    </div>
                </div>
            @endforeach

            @if($pending->isEmpty())
                <div class="bg-white rounded-3xl border border-slate-100 p-20 text-center">
                    <div class="w-20 h-20 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-6">
                        <i data-lucide="check-circle-2" class="w-10 h-10"></i>
                    </div>
                    <h3 class="font-display font-extrabold text-brand-950 text-xl">Semua Beres!</h3>
                    <p class="text-slate-500 mt-2">Tidak ada konten yang menunggu persetujuan saat ini.</p>
                </div>
            @endif
        </div>
    </div>
@endsection
