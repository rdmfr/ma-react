import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Search, Eye } from "lucide-react";
import { news, newsCategories } from "../../data/mockData";

export default function Berita() {
    const [q, setQ] = useState("");
    const [cat, setCat] = useState("Semua");
    const filtered = useMemo(() => news
        .filter(n => !n.status || n.status === "approved")
        .filter(n => (cat === "Semua" || n.category === cat) && (n.title.toLowerCase().includes(q.toLowerCase())))
    , [q, cat]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="berita-page">
            <div className="max-w-3xl">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Berita</div>
                <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Cerita & kabar <span className="font-editorial italic text-brand-700">terbaru</span> madrasah.</h1>
            </div>
            <div className="mt-10 flex flex-col md:flex-row gap-3">
                <div className="flex items-center gap-2 flex-1 bg-white rounded-xl border border-slate-200 px-4">
                    <Search className="w-4 h-4 text-brand-600" />
                    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari berita..." className="flex-1 py-3 bg-transparent outline-none text-sm" data-testid="berita-search" />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {["Semua", ...newsCategories].map(c => (
                        <button key={c} onClick={() => setCat(c)} data-testid={`berita-filter-${c.toLowerCase()}`}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${cat === c ? "bg-brand-950 text-white" : "bg-white border border-slate-200 text-brand-900 hover:bg-brand-50"}`}>{c}</button>
                    ))}
                </div>
            </div>
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((n) => (
                    <Link key={n.id} to={`/berita/${n.slug}`} className="group" data-testid={`berita-card-${n.id}`}>
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-4 relative">
                            <img src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-brand-800 rounded-full px-2.5 py-1">{n.category}</div>
                        </div>
                        <h3 className="font-display font-bold text-xl text-brand-950 leading-tight group-hover:text-brand-700 transition">{n.title}</h3>
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{n.excerpt}</p>
                        <div className="mt-3 text-xs text-slate-500 flex items-center gap-3">
                            <span>{format(new Date(n.date), "d MMM yyyy", { locale: idLocale })}</span>
                            <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" /> {n.views}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
