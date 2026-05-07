@php
    $done = session('ppdb_success', false) === true;
    $ppdbName = (string) session('ppdb_name', '');
    $ppdbEmail = (string) session('ppdb_email', '');
    $ppdbNo = (string) session('ppdb_no', '');

    $timeline = [
        ['step' => 'Pendaftaran Online', 'date' => '1 Mar - 31 Mei', 'active' => true],
        ['step' => 'Tes Akademik & Wawancara', 'date' => '5 - 10 Juni', 'active' => false],
        ['step' => 'Pengumuman Hasil', 'date' => '15 Juni', 'active' => false],
        ['step' => 'Daftar Ulang', 'date' => '16 - 30 Juni', 'active' => false],
    ];
@endphp

@extends('layouts.public')

@section('content')
    <div class="py-14" data-testid="ppdb-page">
        <section class="relative bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 text-white overflow-hidden">
            <div class="absolute inset-0 noise-overlay opacity-30"></div>
            <div class="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-brand-400/20 blur-3xl"></div>
            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div class="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/15 px-4 py-1.5 text-xs font-semibold"><i data-lucide="sparkles" class="w-3 h-3 text-brand-300"></i> PPDB 2025/2026 Dibuka</div>
                <h1 class="font-display text-5xl lg:text-7xl font-black mt-5 tracking-tight leading-[0.95] text-white">Bergabung dengan<br><span class="font-editorial italic text-brand-300">keluarga besar</span> kami.</h1>
                <p class="mt-5 max-w-2xl text-brand-100/85">Pendaftaran Peserta Didik Baru telah dibuka. Tersedia jalur reguler, prestasi, dan beasiswa untuk siswa berprestasi.</p>
            </div>
        </section>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid lg:grid-cols-12 gap-10">
            <div class="lg:col-span-4">
                <h2 class="font-display text-3xl font-extrabold text-brand-950">Linimasa PPDB</h2>
                <div class="mt-8 space-y-6 relative">
                    <div class="absolute left-[15px] top-2 bottom-2 w-px bg-brand-200"></div>
                    @foreach ($timeline as $i => $t)
                        <div class="flex gap-4 relative">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 {{ $t['active'] ? 'gradient-brand text-white' : 'bg-white border border-brand-200 text-brand-600' }}">
                                @if ($t['active'])
                                    <i data-lucide="check" class="w-4 h-4"></i>
                                @else
                                    {{ $i + 1 }}
                                @endif
                            </div>
                            <div>
                                <div class="font-display font-bold text-brand-950">{{ $t['step'] }}</div>
                                <div class="text-sm text-slate-600 mt-0.5">{{ $t['date'] }}</div>
                            </div>
                        </div>
                    @endforeach
                </div>
                <div class="mt-10 bg-brand-50/60 border border-brand-100 rounded-2xl p-5">
                    <div class="inline-flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2"><i data-lucide="file-text" class="w-3.5 h-3.5"></i> Dokumen yang dibutuhkan</div>
                    <ul class="text-sm text-brand-900 space-y-1.5">
                        <li>• Fotokopi Akte Kelahiran</li>
                        <li>• Fotokopi Kartu Keluarga</li>
                        <li>• Pas foto 3x4 (4 lembar)</li>
                        <li>• Ijazah / SKL terakhir</li>
                        <li>• Sertifikat prestasi (jika ada)</li>
                    </ul>
                </div>
            </div>

            <div class="lg:col-span-8">
                @if ($done)
                    <div class="bg-white rounded-3xl border border-brand-200 p-12 text-center">
                        <div class="w-20 h-20 mx-auto rounded-full gradient-brand text-white flex items-center justify-center"><i data-lucide="check-circle-2" class="w-10 h-10"></i></div>
                        <h3 class="font-display text-3xl font-black text-brand-950 mt-6">Pendaftaran Berhasil!</h3>
                        <p class="text-slate-600 mt-3 max-w-md mx-auto">Terima kasih, <strong>{{ $ppdbName !== '' ? $ppdbName : 'calon siswa' }}</strong>. Tim PPDB akan menghubungi Anda dalam 1×24 jam melalui email <strong class="text-brand-800">{{ $ppdbEmail !== '' ? $ppdbEmail : 'Anda' }}</strong>.</p>
                        <div class="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-5 py-2.5 text-sm font-bold text-brand-800">No. Pendaftaran: {{ $ppdbNo }}</div>
                    </div>
                @else
                    <div class="bg-white rounded-3xl border border-slate-100 overflow-hidden" x-data="{
                        step: 1,
                        form: {
                            name: @js(old('name', '')),
                            school: @js(old('school', '')),
                            nisn: '',
                            phone: @js(old('phone', '')),
                            email: @js(old('email', '')),
                            birth: '',
                            gender: 'L',
                            address: '',
                            fatherName: '',
                            fatherJob: '',
                            motherName: '',
                            motherJob: '',
                            parentPhone: '',
                            program: 'MIPA',
                            route: 'Reguler'
                        },
                        next() { this.step = Math.min(4, this.step + 1) },
                        prev() { this.step = Math.max(1, this.step - 1) }
                    }">
                        <div class="p-6 border-b border-slate-100">
                            <div class="flex items-center justify-between gap-4 mb-4 flex-wrap">
                                @foreach ([1 => ['title' => 'Data Diri', 'icon' => 'user'], 2 => ['title' => 'Data Orang Tua', 'icon' => 'users'], 3 => ['title' => 'Pilih Program', 'icon' => 'graduation-cap'], 4 => ['title' => 'Upload Dokumen', 'icon' => 'upload']] as $id => $s)
                                    <div class="flex items-center gap-2 flex-1 min-w-fit">
                                        <div class="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition" x-bind:class="step > {{ $id }} ? 'gradient-brand text-white' : (step === {{ $id }} ? 'bg-brand-950 text-white' : 'bg-slate-100 text-slate-500')">
                                            <i data-lucide="check" class="w-4 h-4" x-show="step > {{ $id }}" x-cloak></i>
                                            <i data-lucide="{{ $s['icon'] }}" class="w-4 h-4" x-show="step <= {{ $id }}" x-cloak></i>
                                        </div>
                                        <div class="hidden sm:block min-w-0">
                                            <div class="text-xs font-bold" x-bind:class="step >= {{ $id }} ? 'text-brand-950' : 'text-slate-500'">{{ $s['title'] }}</div>
                                        </div>
                                        @if ($id < 4)
                                            <div class="hidden md:block flex-1 h-0.5" x-bind:class="step > {{ $id }} ? 'bg-brand-500' : 'bg-slate-200'"></div>
                                        @endif
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        <div class="p-7">
                            <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700" x-text="`Langkah ${step} / 4`"></div>
                            <h3 class="font-display text-2xl font-extrabold text-brand-950 mt-1" x-text="step === 1 ? 'Data Diri' : step === 2 ? 'Data Orang Tua' : step === 3 ? 'Pilih Program' : 'Upload Dokumen'"></h3>
                            <p class="text-sm text-slate-600 mt-1" x-text="step === 1 ? 'Informasi pribadi calon siswa' : step === 2 ? 'Informasi wali murid' : step === 3 ? 'Peminatan & jalur masuk' : 'Berkas pendukung'"></p>

                            <div class="mt-6 grid sm:grid-cols-2 gap-4" x-show="step === 1" x-cloak data-testid="ppdb-step-1">
                                    <div class="sm:col-span-2"><label class="text-sm font-semibold text-brand-950">Nama Lengkap</label><input x-model="form.name" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="ppdb-name"></div>
                                    <div><label class="text-sm font-semibold text-brand-950">Tempat, Tanggal Lahir</label><input x-model="form.birth" placeholder="Garut, 1 Jan 2008" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500"></div>
                                    <div>
                                        <label class="text-sm font-semibold text-brand-950">Jenis Kelamin</label>
                                        <div class="mt-1.5 flex gap-2">
                                            <button type="button" x-on:click="form.gender='L'" class="flex-1 rounded-xl py-3 text-sm font-semibold" x-bind:class="form.gender === 'L' ? 'gradient-brand text-white' : 'bg-white border border-slate-200 text-brand-900'">Laki-laki</button>
                                            <button type="button" x-on:click="form.gender='P'" class="flex-1 rounded-xl py-3 text-sm font-semibold" x-bind:class="form.gender === 'P' ? 'gradient-brand text-white' : 'bg-white border border-slate-200 text-brand-900'">Perempuan</button>
                                        </div>
                                    </div>
                                    <div><label class="text-sm font-semibold text-brand-950">Asal Sekolah</label><input x-model="form.school" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500"></div>
                                    <div><label class="text-sm font-semibold text-brand-950">NISN</label><input x-model="form.nisn" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500"></div>
                                    <div class="sm:col-span-2"><label class="text-sm font-semibold text-brand-950">Alamat Lengkap</label><textarea rows="2" x-model="form.address" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 resize-none"></textarea></div>
                                    <div><label class="text-sm font-semibold text-brand-950">No. HP / WA</label><input x-model="form.phone" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500"></div>
                                    <div><label class="text-sm font-semibold text-brand-950">Email</label><input type="email" x-model="form.email" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500"></div>
                            </div>

                            <div class="mt-6 grid sm:grid-cols-2 gap-4" x-show="step === 2" x-cloak data-testid="ppdb-step-2">
                                    <div><label class="text-sm font-semibold text-brand-950">Nama Ayah</label><input x-model="form.fatherName" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500"></div>
                                    <div><label class="text-sm font-semibold text-brand-950">Pekerjaan Ayah</label><input x-model="form.fatherJob" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500"></div>
                                    <div><label class="text-sm font-semibold text-brand-950">Nama Ibu</label><input x-model="form.motherName" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500"></div>
                                    <div><label class="text-sm font-semibold text-brand-950">Pekerjaan Ibu</label><input x-model="form.motherJob" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500"></div>
                                    <div class="sm:col-span-2"><label class="text-sm font-semibold text-brand-950">No. HP Orang Tua / Wali</label><input x-model="form.parentPhone" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500"></div>
                            </div>

                            <div class="mt-6 space-y-5" x-show="step === 3" x-cloak data-testid="ppdb-step-3">
                                    <div>
                                        <label class="text-sm font-semibold text-brand-950">Program Peminatan</label>
                                        <div class="mt-2 grid sm:grid-cols-3 gap-3">
                                            @foreach (['MIPA', 'IPS', 'Keagamaan'] as $p)
                                                <button type="button" x-on:click="form.program='{{ $p }}'" class="relative rounded-2xl p-5 text-left transition" x-bind:class="form.program === '{{ $p }}' ? 'gradient-brand text-white' : 'bg-white border border-slate-200 text-brand-900 hover:bg-brand-50'" data-testid="ppdb-program-{{ $p }}">
                                                    <i data-lucide="check" class="absolute top-3 right-3 w-4 h-4" x-show="form.program === '{{ $p }}'" x-cloak></i>
                                                    <div class="font-display font-extrabold text-lg">{{ $p }}</div>
                                                    <div class="text-xs mt-1" x-bind:class="form.program === '{{ $p }}' ? 'text-brand-100' : 'text-slate-600'">
                                                        {{ $p === 'MIPA' ? 'Sains & teknologi' : ($p === 'IPS' ? 'Sosial & ekonomi' : 'Tafsir & bahasa Arab') }}
                                                    </div>
                                                </button>
                                            @endforeach
                                        </div>
                                    </div>
                                    <div>
                                        <label class="text-sm font-semibold text-brand-950">Jalur Masuk</label>
                                        <div class="mt-2 grid sm:grid-cols-3 gap-3">
                                            @foreach ([['k' => 'Reguler', 'd' => 'Tes akademik'], ['k' => 'Prestasi', 'd' => 'Lampirkan sertifikat'], ['k' => 'Beasiswa', 'd' => 'Khusus tidak mampu']] as $r)
                                                <button type="button" x-on:click="form.route='{{ $r['k'] }}'" class="rounded-2xl p-4 text-left" x-bind:class="form.route === '{{ $r['k'] }}' ? 'bg-brand-950 text-white' : 'bg-white border border-slate-200 text-brand-900'">
                                                    <div class="font-display font-bold">{{ $r['k'] }}</div>
                                                    <div class="text-xs mt-0.5" x-bind:class="form.route === '{{ $r['k'] }}' ? 'text-brand-300' : 'text-slate-600'">{{ $r['d'] }}</div>
                                                </button>
                                            @endforeach
                                        </div>
                                    </div>
                            </div>

                            <div class="mt-6 space-y-3" x-show="step === 4" x-cloak data-testid="ppdb-step-4">
                                    @foreach (['Akte Kelahiran', 'Kartu Keluarga', 'Pas Foto 3x4', 'Ijazah / SKL'] as $f)
                                        <label class="block border-2 border-dashed border-brand-200 rounded-xl p-5 bg-brand-50/40 cursor-pointer hover:bg-brand-50">
                                            <div class="flex items-center gap-3">
                                                <i data-lucide="upload" class="w-5 h-5 text-brand-700"></i>
                                                <div class="flex-1">
                                                    <div class="font-semibold text-brand-950 text-sm">{{ $f }}</div>
                                                    <div class="text-xs text-slate-600">PDF/JPG/PNG · Maks 5MB</div>
                                                </div>
                                                <span class="text-xs font-bold text-brand-700">Pilih file</span>
                                            </div>
                                            <input type="file" class="hidden">
                                        </label>
                                    @endforeach
                            </div>
                        </div>

                        <div class="px-7 py-4 border-t border-slate-100 flex justify-between items-center">
                            <button type="button" x-on:click="prev()" x-bind:disabled="step === 1" class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-brand-900 disabled:opacity-30" data-testid="ppdb-prev"><i data-lucide="arrow-left" class="w-4 h-4"></i>Kembali</button>
                            <div class="text-xs text-slate-500" x-text="`${step}/4`"></div>
                            <button type="button" x-on:click="next()" class="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-6 py-3 text-sm font-bold" data-testid="ppdb-next" x-show="step < 4" x-cloak>Lanjut<i data-lucide="arrow-right" class="w-4 h-4"></i></button>
                            <form method="POST" action="{{ route('ppdb.submit') }}" x-show="step === 4" x-cloak>
                                @csrf
                                <input type="hidden" name="name" x-bind:value="form.name">
                                <input type="hidden" name="school" x-bind:value="form.school">
                                <input type="hidden" name="phone" x-bind:value="form.phone">
                                <input type="hidden" name="email" x-bind:value="form.email">
                                <button type="submit" class="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-6 py-3 text-sm font-bold" data-testid="ppdb-submit">Kirim Pendaftaran<i data-lucide="check" class="w-4 h-4"></i></button>
                            </form>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>
@endsection
