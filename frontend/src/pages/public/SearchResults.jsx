import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Newspaper, GraduationCap, BookCopy, Image as ImageIcon, Calendar, FileText } from "lucide-react";
import { news, teachers, modules, galleries, events, faqs, extracurriculars } from "../../data/mockData";

const TYPE_META = {
    news: { icon: Newspaper, label: "Berita", url: (i) => `/berita/${i.slug}` },
    teacher: { icon: GraduationCap, label: "Guru", url: (i) => `/guru/${i.slug}` },
    module: { icon: BookCopy, label: "Modul", url: () => "/modul" },
    gallery: { icon: ImageIcon, label: "Galeri", url: (i) => `/galeri/${i.id}` },
    event: { icon: Calendar, label: "Agenda", url: () => "/agenda" },
    faq: { icon: FileText, label: "FAQ", url: () => "/faq" },
    ekskul: { icon: GraduationCap, label: "Ekstrakurikuler", url: () => "/ekstrakurikuler" },
};

export default function SearchResults() {
    const [params] = useSearchParams();
    const q = params.get("q") || "";
    const [filter, setFilter] = useState("all");

    const results = useMemo(() => {
        if (!q) return [];
        const ql = q.toLowerCase();
        const m = (s) => s?.toLowerCase().includes(ql);
        return [
            ...news.filter(n => m(n.title) || m(n.excerpt) || m(n.category)).map(i => ({ ...i, _type: "news", _t: i.title, _d: i.excerpt })),
            ...teachers.filter(t => m(t.name) || m(t.subject)).map(i => ({ ...i, _type: "teacher", _t: i.name, _d: `${i.subject} · ${i.education || ""}` })),
            ...modules.filter(mo => m(mo.title) || m(mo.subject)).map(i => ({ ...i, _type: "module", _t: i.title, _d: `${i.subject} · Kelas ${i.grade}` })),
            ...galleries.filter(g => m(g.title)).map(i => ({ ...i, _type: "gallery", _t: i.title, _d: `${i.count} foto` })),
            ...events.filter(e => m(e.title) || m(e.location)).map(i => ({ ...i, _type: "event", _t: i.title, _d: `${i.date} · ${i.location}` })),
            ...faqs.filter(f => m(f.q) || m(f.a)).map(i => ({ ...i, _type: "faq", _t: i.q, _d: i.a })),
            ...extracurriculars.filter(e => m(e.name) || m(e.description)).map(i => ({ ...i, _type: "ekskul", _t: i.name, _d: i.description })),
        ];
    }, [q]);

    const filtered = filter === "all" ? results : results.filter(r => r._type === filter);
    const counts = results.reduce((a, r) => { a[r._type] = (a[r._type] || 0) + 1; return a; }, {});

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="search-results-page">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Hasil Pencarian</div>
            <h1 className="font-display text-4xl lg:text-5xl font-black text-brand-950 mt-3 tracking-tight">
                {q ? <>Pencarian untuk <span className="font-editorial italic text-brand-700">"{q}"</span></> : "Mulai pencarian"}
            </h1>
            <p className="text-slate-600 mt-3">Ditemukan <span className="font-bold text-brand-900">{results.length}</span> hasil di seluruh konten website.</p>
            {results.length > 0 && (
                <div className="mt-8 flex gap-2 overflow-x-auto thin-scroll pb-2">
                    <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${filter === "all" ? "bg-brand-950 text-white" : "bg-white border border-slate-200 text-brand-900"}`}>Semua ({results.length})</button>
                    {Object.entries(counts).map(([t, c]) => (
                        <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${filter === t ? "bg-brand-950 text-white" : "bg-white border border-slate-200 text-brand-900"}`}>{TYPE_META[t]?.label} ({c})</button>
                    ))}
                </div>
            )}
            <div className="mt-8 space-y-3">
                {filtered.map((r, i) => {
                    const M = TYPE_META[r._type];
                    return (
                        <Link key={`${r._type}-${r.id}-${i}`} to={M.url(r)} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-4 card-lift" data-testid={`search-result-${i}`}>
                            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0"><M.icon className="w-5 h-5" /></div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-600">{M.label}</div>
                                <div className="font-display font-bold text-brand-950 mt-0.5">{r._t}</div>
                                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{r._d}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
            {q && results.length === 0 && (
                <div className="mt-12 bg-white border border-dashed border-brand-200 rounded-3xl p-12 text-center">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4"><Search className="w-6 h-6" /></div>
                    <h3 className="font-display font-bold text-brand-950 text-xl">Tidak ada hasil</h3>
                    <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">Coba kata kunci lain, atau jelajahi langsung kategori populer di bawah.</p>
                </div>
            )}
        </div>
    );
}
