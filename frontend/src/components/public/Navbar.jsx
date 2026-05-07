import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogIn, Search } from "lucide-react";
import { useBranding } from "../../context/BrandingContext";

const navItems = [
    { label: "Beranda", to: "/" },
    { label: "Profil", to: "/profil" },
    {
        label: "Akademik",
        children: [
            { label: "Guru & Staff", to: "/guru" },
            { label: "Program Studi", to: "/program-studi" },
            { label: "Modul Pembelajaran", to: "/modul" },
            { label: "Alumni", to: "/alumni" },
        ],
    },
    {
        label: "Kesiswaan",
        children: [
            { label: "Ekstrakurikuler", to: "/ekstrakurikuler" },
            { label: "Karya Siswa", to: "/karya-siswa" },
            { label: "Galeri", to: "/galeri" },
            { label: "Agenda", to: "/agenda" },
        ],
    },
    {
        label: "Informasi",
        children: [
            { label: "Berita", to: "/berita" },
            { label: "Refleksi", to: "/refleksi" },
            { label: "Pengumuman", to: "/pengumuman" },
            { label: "FAQ", to: "/faq" },
        ],
    },
    { label: "PPDB", to: "/ppdb" },
    { label: "Kontak", to: "/kontak" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [openSub, setOpenSub] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchVal, setSearchVal] = useState("");
    const { branding } = useBranding();
    const loc = useLocation();
    const nav = useNavigate();

    const submitSearch = (e) => { e.preventDefault(); if (searchVal.trim()) { nav(`/search?q=${encodeURIComponent(searchVal)}`); setSearchOpen(false); setSearchVal(""); } };

    return (
        <header className="sticky top-0 z-50" data-testid="public-navbar">
            <div className="bg-brand-950 text-brand-100 text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
                    <span className="truncate">{branding.address}</span>
                    <div className="hidden md:flex items-center gap-5">
                        <span>✉ {branding.email}</span>
                        <span>☎ {branding.phone}</span>
                    </div>
                </div>
            </div>
            <div className="glass border-b border-white/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
                    <Link to="/" data-testid="nav-logo" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 rounded-xl bg-white border border-brand-100 p-1.5 flex items-center justify-center shadow-sm">
                            <img src={branding.logoUrl} alt={branding.schoolName} className="w-full h-full object-contain" />
                        </div>
                        <div className="leading-tight">
                            <div className="font-display font-extrabold text-brand-950 text-lg tracking-tight">{branding.schoolName}</div>
                            <div className="text-[11px] text-brand-700 font-medium">{branding.schoolTagline}</div>
                        </div>
                    </Link>
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((it) => it.children ? (
                            <div key={it.label} className="relative" onMouseEnter={() => setOpenSub(it.label)} onMouseLeave={() => setOpenSub(null)}>
                                <button className="px-3 py-2 text-sm font-semibold text-brand-950 hover:text-brand-700 inline-flex items-center gap-1" data-testid={`nav-${it.label.toLowerCase()}`}>
                                    {it.label} <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                                {openSub === it.label && (
                                    <div className="absolute top-full left-0 pt-2 min-w-56 animate-fade-up">
                                        <div className="glass rounded-xl p-2 shadow-xl">
                                            {it.children.map((c) => (
                                                <NavLink key={c.to} to={c.to} className={({ isActive }) => `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? "bg-brand-100 text-brand-900" : "text-brand-950 hover:bg-brand-50"}`}>{c.label}</NavLink>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink key={it.to} to={it.to} className={({ isActive }) => `px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${isActive || (it.to === "/" && loc.pathname === "/") ? "text-brand-700" : "text-brand-950 hover:text-brand-700"}`} data-testid={`nav-${it.label.toLowerCase()}`}>
                                {it.label}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSearchOpen(true)} className="hidden md:inline-flex w-10 h-10 rounded-full border border-brand-200 items-center justify-center text-brand-900 hover:bg-brand-50 transition" aria-label="search" data-testid="nav-search-btn">
                            <Search className="w-4 h-4" />
                        </button>
                        <Link to="/login" data-testid="nav-login-btn" className="inline-flex items-center gap-2 rounded-full gradient-brand gradient-brand-hover text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-brand-900/20 transition">
                            <LogIn className="w-4 h-4" /> Masuk
                        </Link>
                        <button className="lg:hidden w-10 h-10 rounded-lg border border-brand-200 flex items-center justify-center" onClick={() => setOpen(!open)} aria-label="menu" data-testid="nav-mobile-toggle">
                            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                {open && (
                    <div className="lg:hidden border-t border-brand-100 bg-white">
                        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1 max-h-[70vh] overflow-y-auto thin-scroll">
                            {navItems.map((it) => it.children ? (
                                <details key={it.label} className="group">
                                    <summary className="px-3 py-2 text-sm font-semibold text-brand-950 cursor-pointer flex items-center justify-between">{it.label}<ChevronDown className="w-4 h-4 transition group-open:rotate-180" /></summary>
                                    <div className="pl-4 flex flex-col">
                                        {it.children.map((c) => (
                                            <NavLink key={c.to} to={c.to} onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-brand-800 hover:text-brand-600">{c.label}</NavLink>
                                        ))}
                                    </div>
                                </details>
                            ) : (
                                <NavLink key={it.to} to={it.to} onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-semibold text-brand-950">{it.label}</NavLink>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {searchOpen && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-[60] flex items-start justify-center pt-32 px-4" onClick={() => setSearchOpen(false)} data-testid="search-modal">
                    <form onSubmit={submitSearch} className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-up" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                            <Search className="w-5 h-5 text-brand-600" />
                            <input autoFocus value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Cari berita, guru, modul..." className="flex-1 text-lg bg-transparent outline-none text-brand-950 placeholder:text-slate-400" data-testid="nav-search-input" />
                            <button type="button" onClick={() => setSearchOpen(false)} className="text-xs font-bold text-slate-500 hover:text-brand-700 px-2 py-1 rounded border border-slate-200">ESC</button>
                        </div>
                        <div className="p-6">
                            <div className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-3">Coba cari</div>
                            <div className="flex flex-wrap gap-2">
                                {["Matematika", "PPDB", "Tahfidz", "Pramuka", "Beasiswa"].map(s => (
                                    <button key={s} type="button" onClick={() => setSearchVal(s)} className="rounded-full bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold px-3 py-1.5">{s}</button>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </header>
    );
}
