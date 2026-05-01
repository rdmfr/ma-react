import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, ArrowUpRight } from "lucide-react";
import { useBranding } from "../../context/BrandingContext";

export default function Footer() {
    const { branding } = useBranding();
    return (
        <footer className="relative bg-brand-950 text-brand-50 overflow-hidden mt-24" data-testid="public-footer">
            <div className="absolute inset-0 noise-overlay opacity-40 pointer-events-none" />
            <div className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-brand-500/20 blur-3xl" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
                <div className="grid lg:grid-cols-12 gap-10 mb-14">
                    <div className="lg:col-span-5">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-white p-2"><img src={branding.logoUrl} alt={branding.schoolName} className="w-full h-full object-contain" /></div>
                            <div>
                                <div className="font-display font-extrabold text-2xl text-white">{branding.schoolName}</div>
                                <div className="text-sm text-brand-300">{branding.schoolTagline}</div>
                            </div>
                        </div>
                        <p className="mt-6 text-brand-200 leading-relaxed max-w-md">
                            Madrasah Aliyah berakreditasi A, membentuk generasi cerdas dalam ilmu dan mulia dalam akhlak. Terus berinovasi untuk pendidikan yang berdampak.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <a href="#" className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-brand-500/30 transition"><Instagram className="w-4 h-4" /></a>
                            <a href="#" className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-brand-500/30 transition"><Facebook className="w-4 h-4" /></a>
                            <a href="#" className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-brand-500/30 transition"><Youtube className="w-4 h-4" /></a>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <h4 className="font-display font-bold text-white mb-4">Jelajahi</h4>
                        <ul className="space-y-2 text-sm text-brand-200">
                            <li><Link to="/profil" className="hover:text-white">Profil</Link></li>
                            <li><Link to="/guru" className="hover:text-white">Guru & Staff</Link></li>
                            <li><Link to="/program-studi" className="hover:text-white">Program Studi</Link></li>
                            <li><Link to="/berita" className="hover:text-white">Berita</Link></li>
                            <li><Link to="/agenda" className="hover:text-white">Agenda</Link></li>
                        </ul>
                    </div>
                    <div className="lg:col-span-2">
                        <h4 className="font-display font-bold text-white mb-4">Kesiswaan</h4>
                        <ul className="space-y-2 text-sm text-brand-200">
                            <li><Link to="/ekstrakurikuler" className="hover:text-white">Ekstrakurikuler</Link></li>
                            <li><Link to="/karya-siswa" className="hover:text-white">Karya Siswa</Link></li>
                            <li><Link to="/galeri" className="hover:text-white">Galeri</Link></li>
                            <li><Link to="/alumni" className="hover:text-white">Alumni</Link></li>
                            <li><Link to="/ppdb" className="hover:text-white">PPDB</Link></li>
                        </ul>
                    </div>
                    <div className="lg:col-span-3">
                        <h4 className="font-display font-bold text-white mb-4">Hubungi Kami</h4>
                        <ul className="space-y-3 text-sm text-brand-200">
                            <li className="flex gap-3"><MapPin className="w-4 h-4 shrink-0 mt-0.5 text-brand-400" />{branding.address}</li>
                            <li className="flex gap-3"><Mail className="w-4 h-4 shrink-0 mt-0.5 text-brand-400" />{branding.email}</li>
                            <li className="flex gap-3"><Phone className="w-4 h-4 shrink-0 mt-0.5 text-brand-400" />{branding.phone}</li>
                        </ul>
                        <Link to="/kontak" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-white">
                            Kirim pesan <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
                <div className="border-t border-brand-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-400">
                    <span>© {new Date().getFullYear()} {branding.schoolName}. Semua hak dilindungi.</span>
                    <span className="inline-flex items-center gap-1.5">
                        Dibangun dengan ikhlas oleh
                        <a href="#" className="font-display font-bold text-brand-200 hover:text-white tracking-tight transition-colors" data-testid="footer-rddev-credit">
                            RdDev<span className="text-brand-400">.</span>
                        </a>
                    </span>
                </div>
            </div>
        </footer>
    );
}
