@extends('dashboard.shell')

@section('dashboard')
    <div class="max-w-5xl" data-testid="admin-settings-page" x-data="{
        logoPreview: @js($data['logoUrl'] ?? ($branding['logoUrl'] ?? '')),
        heroPreview: @js($data['heroImageUrl'] ?? ($branding['heroImageUrl'] ?? '')),
        profilePreview: @js($data['profileImageUrl'] ?? ($branding['profileImageUrl'] ?? '')),
    }">
        <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Admin</div>
        <h1 class="font-display text-4xl font-extrabold text-brand-950 mt-2 tracking-tight">Pengaturan & Branding</h1>
        <p class="mt-3 text-sm text-slate-600">Kelola identitas sekolah, kontak, dan aset visual yang tampil di halaman publik.</p>

        @if (session('success'))
            <div class="mt-8 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl px-5 py-4 text-sm">{{ session('success') }}</div>
        @endif

        @if ($errors->any())
            <div class="mt-8 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-5 py-4 text-sm">
                <div class="font-bold">Periksa kembali input:</div>
                <ul class="mt-2 list-disc pl-5 space-y-1">
                    @foreach ($errors->all() as $e)
                        <li>{{ $e }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('admin.settings.update') }}" enctype="multipart/form-data" class="mt-10 space-y-6">
            @csrf

            <div class="bg-white rounded-3xl border border-slate-100 p-6">
                <div class="font-display font-extrabold text-brand-950 text-xl">Identitas</div>
                <div class="mt-6 grid md:grid-cols-2 gap-5">
                    <label class="block">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Nama Sekolah</div>
                        <input name="schoolName" value="{{ old('schoolName', $data['schoolName'] ?? ($branding['schoolName'] ?? '')) }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" required>
                    </label>
                    <label class="block">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Nama Singkat</div>
                        <input name="schoolShort" value="{{ old('schoolShort', $data['schoolShort'] ?? ($branding['schoolShort'] ?? '')) }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                    </label>
                    <label class="block md:col-span-2">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Tagline</div>
                        <input name="schoolTagline" value="{{ old('schoolTagline', $data['schoolTagline'] ?? ($branding['schoolTagline'] ?? '')) }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                    </label>
                    <label class="block">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Akreditasi</div>
                        <input name="accreditationLabel" value="{{ old('accreditationLabel', $data['accreditationLabel'] ?? ($branding['accreditationLabel'] ?? '')) }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                    </label>
                    <label class="block">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Warna Aksen</div>
                        <input name="accentColor" value="{{ old('accentColor', $data['accentColor'] ?? ($branding['accentColor'] ?? '')) }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" placeholder="#10b981">
                    </label>
                    <label class="block">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Warna Gelap</div>
                        <input name="darkColor" value="{{ old('darkColor', $data['darkColor'] ?? ($branding['darkColor'] ?? '')) }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" placeholder="#064e3b">
                    </label>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-slate-100 p-6">
                <div class="font-display font-extrabold text-brand-950 text-xl">SEO & Meta</div>
                <div class="mt-6 space-y-5">
                    <label class="block">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Keywords (pisahkan dengan koma)</div>
                        <input name="seo_keywords" value="{{ old('seo_keywords', $data['seo_keywords'] ?? ($branding['seo_keywords'] ?? '')) }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" placeholder="sekolah, madrasah, garut, pendidikan">
                    </label>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-slate-100 p-6">
                <div class="font-display font-extrabold text-brand-950 text-xl">Konten Hero</div>
                <div class="mt-6 space-y-5">
                    <label class="block">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Label Prestasi Hero</div>
                        <input name="heroAchievementTitle" value="{{ old('heroAchievementTitle', $data['heroAchievementTitle'] ?? ($branding['heroAchievementTitle'] ?? 'Prestasi Terbaru')) }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" placeholder="Prestasi Terbaru">
                    </label>
                    <label class="block">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Isi Prestasi Hero</div>
                        <input name="heroAchievementValue" value="{{ old('heroAchievementValue', $data['heroAchievementValue'] ?? ($branding['heroAchievementValue'] ?? 'Juara OSN Matematika Provinsi')) }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" placeholder="Juara OSN Matematika Provinsi">
                    </label>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-slate-100 p-6">
                <div class="font-display font-extrabold text-brand-950 text-xl">Kontak</div>
                <div class="mt-6 grid md:grid-cols-2 gap-5">
                    <label class="block md:col-span-2">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Alamat</div>
                        <textarea name="address" rows="3" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">{{ old('address', $data['address'] ?? ($branding['address'] ?? '')) }}</textarea>
                    </label>
                    <label class="block">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Email</div>
                        <input name="email" value="{{ old('email', $data['email'] ?? ($branding['email'] ?? '')) }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                    </label>
                    <label class="block">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Telepon</div>
                        <input name="phone" value="{{ old('phone', $data['phone'] ?? ($branding['phone'] ?? '')) }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                    </label>
                    <label class="block">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Instagram</div>
                        <input name="instagram" value="{{ old('instagram', $data['instagram'] ?? ($branding['instagram'] ?? '')) }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                    </label>
                    <label class="block">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Facebook</div>
                        <input name="facebook" value="{{ old('facebook', $data['facebook'] ?? ($branding['facebook'] ?? '')) }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                    </label>
                    <label class="block">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">YouTube</div>
                        <input name="youtube" value="{{ old('youtube', $data['youtube'] ?? ($branding['youtube'] ?? '')) }}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                    </label>
                    <label class="block md:col-span-2">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Map Embed URL</div>
                        <textarea name="mapEmbed" rows="3" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">{{ old('mapEmbed', $data['mapEmbed'] ?? ($branding['mapEmbed'] ?? '')) }}</textarea>
                    </label>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-slate-100 p-6">
                <div class="font-display font-extrabold text-brand-950 text-xl">Aset Visual</div>
                <div class="mt-6 grid lg:grid-cols-3 gap-5">
                    <div class="rounded-2xl border border-slate-100 p-5">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Logo</div>
                        <div class="mt-3 w-24 h-24 rounded-2xl bg-brand-50 border border-brand-100 overflow-hidden flex items-center justify-center">
                            <template x-if="logoPreview">
                                <img x-bind:src="logoPreview" alt="Logo" class="w-full h-full object-contain bg-white">
                            </template>
                            <template x-if="!logoPreview">
                                <i data-lucide="image" class="w-6 h-6 text-brand-700"></i>
                            </template>
                        </div>
                        <input type="file" name="logo" accept="image/*" class="mt-4 block w-full text-sm" x-on:change="logoPreview = $event.target.files?.[0] ? URL.createObjectURL($event.target.files[0]) : logoPreview">
                        <div class="mt-2 text-xs text-slate-500">PNG/JPG/WebP, maks 5MB.</div>
                    </div>
                    <div class="rounded-2xl border border-slate-100 p-5">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Hero Image</div>
                        <div class="mt-3 aspect-[4/3] rounded-2xl bg-brand-50 border border-brand-100 overflow-hidden flex items-center justify-center">
                            <template x-if="heroPreview">
                                <img x-bind:src="heroPreview" alt="Hero" class="w-full h-full object-cover">
                            </template>
                            <template x-if="!heroPreview">
                                <i data-lucide="image" class="w-6 h-6 text-brand-700"></i>
                            </template>
                        </div>
                        <input type="file" name="heroImage" accept="image/*" class="mt-4 block w-full text-sm" x-on:change="heroPreview = $event.target.files?.[0] ? URL.createObjectURL($event.target.files[0]) : heroPreview">
                        <div class="mt-2 text-xs text-slate-500">Gambar header halaman publik.</div>
                    </div>
                    <div class="rounded-2xl border border-slate-100 p-5">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Foto Profil Sekolah</div>
                        <div class="mt-3 aspect-[4/3] rounded-2xl bg-brand-50 border border-brand-100 overflow-hidden flex items-center justify-center">
                            <template x-if="profilePreview">
                                <img x-bind:src="profilePreview" alt="Profil" class="w-full h-full object-cover">
                            </template>
                            <template x-if="!profilePreview">
                                <i data-lucide="image" class="w-6 h-6 text-brand-700"></i>
                            </template>
                        </div>
                        <input type="file" name="profileImage" accept="image/*" class="mt-4 block w-full text-sm" x-on:change="profilePreview = $event.target.files?.[0] ? URL.createObjectURL($event.target.files[0]) : profilePreview">
                        <div class="mt-2 text-xs text-slate-500">Gambar pendukung halaman profil.</div>
                    </div>
                </div>
            </div>

            <div class="mt-10 mb-20 flex items-center justify-end gap-3">
                <button type="submit" class="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-8 py-4 text-base font-bold shadow-xl shadow-brand-900/20 card-lift">
                    <i data-lucide="save" class="w-5 h-5"></i> Simpan Perubahan Branding
                </button>
            </div>
        </form>
    </div>
@endsection
