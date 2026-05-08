<footer class="relative bg-brand-950 text-brand-50 overflow-hidden mt-24" data-testid="public-footer">
    <div class="absolute inset-0 noise-overlay opacity-40 pointer-events-none"></div>
    <div class="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-brand-500/20 blur-3xl"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div class="grid lg:grid-cols-12 gap-10 mb-14">
            <div class="lg:col-span-5">
                <div class="flex items-center gap-3">
                    <div class="w-14 h-14 rounded-xl bg-white p-2">
                        <img src="{{ $branding['logoUrl'] ?? '' }}" alt="{{ $branding['schoolName'] ?? '' }}" class="w-full h-full object-contain" />
                    </div>
                    <div>
                        <div class="font-display font-extrabold text-2xl text-white">{{ $branding['schoolName'] ?? '' }}</div>
                        <div class="text-sm text-brand-300">{{ $branding['schoolTagline'] ?? '' }}</div>
                    </div>
                </div>
                <p class="mt-6 text-brand-200 leading-relaxed max-w-md">
                    Madrasah Aliyah berakreditasi A, membentuk generasi cerdas dalam ilmu dan mulia dalam akhlak. Terus berinovasi untuk pendidikan yang berdampak.
                </p>
                <div class="mt-6 flex gap-3">
                    <a href="#" class="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-brand-500/30 transition"><i data-lucide="instagram" class="w-4 h-4"></i></a>
                    <a href="#" class="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-brand-500/30 transition"><i data-lucide="facebook" class="w-4 h-4"></i></a>
                    <a href="#" class="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-brand-500/30 transition"><i data-lucide="youtube" class="w-4 h-4"></i></a>
                </div>
            </div>
            <div class="lg:col-span-2">
                <h4 class="font-display font-bold text-white mb-4">Jelajahi</h4>
                <ul class="space-y-2 text-sm text-brand-200">
                    <li><a href="/profil" class="hover:text-white">Profil</a></li>
                    <li><a href="/guru" class="hover:text-white">Guru & Staff</a></li>
                    <li><a href="/program-studi" class="hover:text-white">Program Studi</a></li>
                    <li><a href="/berita" class="hover:text-white">Berita</a></li>
                    <li><a href="/agenda" class="hover:text-white">Agenda</a></li>
                </ul>
            </div>
            <div class="lg:col-span-2">
                <h4 class="font-display font-bold text-white mb-4">Kesiswaan</h4>
                <ul class="space-y-2 text-sm text-brand-200">
                    <li><a href="/ekstrakurikuler" class="hover:text-white">Ekstrakurikuler</a></li>
                    <li><a href="/karya-siswa" class="hover:text-white">Karya Siswa</a></li>
                    <li><a href="/galeri" class="hover:text-white">Galeri</a></li>
                    <li><a href="/alumni" class="hover:text-white">Alumni</a></li>
                    <li><a href="/ppdb" class="hover:text-white">PPDB</a></li>
                </ul>
            </div>
            <div class="lg:col-span-3">
                <h4 class="font-display font-bold text-white mb-4">Hubungi Kami</h4>
                <ul class="space-y-3 text-sm text-brand-200">
                    <li class="flex gap-3"><i data-lucide="map-pin" class="w-4 h-4 shrink-0 mt-0.5 text-brand-400"></i>{{ $branding['address'] ?? '' }}</li>
                    <li class="flex gap-3"><i data-lucide="mail" class="w-4 h-4 shrink-0 mt-0.5 text-brand-400"></i>{{ $branding['email'] ?? '' }}</li>
                    <li class="flex gap-3"><i data-lucide="phone" class="w-4 h-4 shrink-0 mt-0.5 text-brand-400"></i>{{ $branding['phone'] ?? '' }}</li>
                </ul>
                <a href="/kontak" class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-white">
                    Kirim pesan <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
                </a>
            </div>
        </div>
        <div class="border-t border-brand-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-400">
            <span>© {{ now()->year }} {{ $branding['schoolName'] ?? '' }}. Semua hak dilindungi.</span>
            <span class="inline-flex items-center gap-1.5">
                Dibangun dengan ikhlas oleh
                <a href="https://wa.me/628988285622" target="_blank" class="font-display font-bold text-brand-200 hover:text-accent-200 tracking-tight transition-colors" data-testid="footer-rddev-credit">
                    RdDev.<span class="text-brand-400">.</span>
                </a>
            </span>
        </div>
    </div>
</footer>
