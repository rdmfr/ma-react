import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Image as ImageIcon } from "lucide-react";
import { galleries } from "../../data/mockData";

export default function Galeri() {
    const visible = galleries.filter((g) => !g.status || g.status === "approved");
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="galeri-page">
            <div className="max-w-3xl">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Galeri</div>
                <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Jejak <span className="font-editorial italic text-brand-700">momen</span> kami.</h1>
            </div>
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {visible.map((g, i) => (
                    <Link key={g.id} to={`/galeri/${g.id}`} className={`group relative overflow-hidden rounded-3xl ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`} data-testid={`galeri-${g.id}`}>
                        <div className={`${i === 0 ? "aspect-[16/10]" : "aspect-[4/3]"} overflow-hidden`}>
                            <img src={g.cover} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5 text-white">
                            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur rounded-full px-2 py-0.5"><ImageIcon className="w-3 h-3" /> {g.count} foto</div>
                            <div className="font-display font-bold text-xl mt-2 leading-tight">{g.title}</div>
                            <div className="text-xs text-brand-300 mt-1">{format(new Date(g.date), "d MMM yyyy", { locale: idLocale })}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
