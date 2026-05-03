import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Image as ImageIcon, X } from "lucide-react";
import { galleries, EXTRACURRICULAR_CATEGORIES } from "../../data/mockData";

export default function Galeri() {
    const [params, setParams] = useSearchParams();
    const [lightbox, setLightbox] = useState(null);
    const active = (params.get("kategori") || "").trim();
    const visible = useMemo(() => galleries.filter((g) => !g.status || g.status === "approved"), []);
    const filtered = useMemo(() => {
        if (!active) return visible;
        return visible.filter((g) => (g.category || "") === active);
    }, [active, visible]);
    const labelFor = (value) => EXTRACURRICULAR_CATEGORIES.find((c) => c.value === value)?.label || value;
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="galeri-page">
            <div className="max-w-3xl">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Galeri</div>
                <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Jejak <span className="font-editorial italic text-brand-700">momen</span> kami.</h1>
            </div>
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((g, i) => (
                    <button key={g.id} type="button" onClick={() => setLightbox(g)} className={`group relative overflow-hidden rounded-3xl text-left ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`} data-testid={`galeri-${g.id}`}>
                        <div className={`${i === 0 ? "aspect-[16/10]" : "aspect-[4/3]"} overflow-hidden`}>
                            <img src={g.cover} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5 text-white">
                            <div className="flex items-center gap-2 flex-wrap">
                                {g.category && <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur rounded-full px-2 py-0.5">{labelFor(g.category)}</div>}
                                <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur rounded-full px-2 py-0.5"><ImageIcon className="w-3 h-3" /> {g.count || 1} foto</div>
                            </div>
                            <div className="font-display font-bold text-xl mt-2 leading-tight">{g.title}</div>
                            <div className="text-xs text-brand-300 mt-1">{format(new Date(g.date), "d MMM yyyy", { locale: idLocale })}</div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
                <button type="button" onClick={() => { const p = new URLSearchParams(params); p.delete("kategori"); setParams(p); }} className={`px-4 py-2 rounded-full text-xs font-bold border ${!active ? "bg-brand-950 text-white border-brand-950" : "bg-white text-brand-900 border-slate-200 hover:bg-slate-50"}`}>Semua</button>
                {EXTRACURRICULAR_CATEGORIES.map((c) => (
                    <button key={c.value} type="button" onClick={() => { const p = new URLSearchParams(params); p.set("kategori", c.value); setParams(p); }} className={`px-4 py-2 rounded-full text-xs font-bold border ${active === c.value ? "bg-brand-950 text-white border-brand-950" : "bg-white text-brand-900 border-slate-200 hover:bg-slate-50"}`}>{c.label}</button>
                ))}
            </div>

            {lightbox && (
                <div className="fixed inset-0 bg-brand-950/90 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setLightbox(null)} data-testid="galeri-lightbox">
                    <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center" onClick={() => setLightbox(null)}><X className="w-4 h-4" /></button>
                    <div className="max-w-5xl w-full">
                        <img src={lightbox.cover} alt={lightbox.title} className="max-w-full max-h-[80vh] mx-auto rounded-2xl" />
                        <div className="mt-4 text-center text-white">
                            <div className="font-display font-bold text-xl">{lightbox.title}</div>
                            <div className="text-xs text-brand-200 mt-1">{lightbox.category ? labelFor(lightbox.category) : ""} {lightbox.category ? "·" : ""} {new Date(lightbox.date).toLocaleDateString("id-ID")}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
