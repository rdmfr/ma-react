import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search, Compass } from "lucide-react";
import { useBranding } from "../../context/BrandingContext";

export default function NotFound() {
    const { branding } = useBranding();
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative overflow-hidden" data-testid="not-found-page">
            <div className="absolute inset-0 gradient-radial pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-brand-100/60 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-brand-50 blur-3xl" />
            <div className="relative max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700 mb-8">
                    <Compass className="w-3.5 h-3.5" /> Halaman tidak ditemukan
                </div>
                <h1 className="font-display font-black text-[8rem] sm:text-[12rem] leading-none tracking-tighter">
                    <span className="gradient-text">4</span>
                    <span className="font-editorial italic text-brand-700">0</span>
                    <span className="gradient-text">4</span>
                </h1>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-950 mt-4 tracking-tight">Tersesat di koridor madrasah?</h2>
                <p className="text-brand-800/80 mt-4 max-w-md mx-auto leading-relaxed">
                    Halaman yang Anda cari mungkin sudah dipindahkan, dihapus, atau belum pernah ada. Mari kembali ke jalan yang terang.
                </p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                    <Link to="/" data-testid="404-home-btn" className="inline-flex items-center gap-2 rounded-full gradient-brand gradient-brand-hover text-white px-6 py-3.5 text-sm font-bold shadow-lg shadow-brand-900/20">
                        <Home className="w-4 h-4" /> Kembali ke Beranda
                    </Link>
                    <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-200 px-6 py-3.5 text-sm font-bold text-brand-900 hover:bg-brand-50">
                        <ArrowLeft className="w-4 h-4" /> Halaman Sebelumnya
                    </button>
                </div>
                <div className="mt-12 pt-8 border-t border-brand-100">
                    <div className="text-xs uppercase tracking-[0.2em] text-brand-700 font-bold mb-3">Mungkin Anda mencari</div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {[{ to: "/profil", l: "Profil" }, { to: "/ppdb", l: "PPDB" }, { to: "/berita", l: "Berita" }, { to: "/guru", l: "Guru" }, { to: "/kontak", l: "Kontak" }].map(s => (
                            <Link key={s.to} to={s.to} className="rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-brand-50 hover:border-brand-300">{s.l}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
