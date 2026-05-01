import React from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { reflections } from "../../data/mockData";
import { Quote } from "lucide-react";

export default function Refleksi() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="refleksi-page">
            <div className="max-w-3xl">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Refleksi</div>
                <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Tulisan <span className="font-editorial italic text-brand-700">menyentuh</span> dari para pendidik.</h1>
                <p className="mt-5 text-brand-800/85 max-w-2xl">Renungan dan hikmah yang menyatukan hati guru dan siswa dalam menempuh jalan ilmu.</p>
            </div>
            <div className="mt-12 space-y-8">
                {reflections.map((r, i) => (
                    <article key={r.id} className={`grid md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`} data-testid={`refleksi-${r.id}`}>
                        <div className={`aspect-[5/4] rounded-[2rem] overflow-hidden ${i % 2 === 1 ? "md:order-2" : ""}`}>
                            <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-3">{format(new Date(r.date), "d MMMM yyyy", { locale: idLocale })} · {r.author}</div>
                            <h2 className="font-display text-3xl lg:text-4xl font-black text-brand-950 tracking-tight leading-tight">{r.title}</h2>
                            <Quote className="w-6 h-6 text-brand-500 mt-5" />
                            <p className="mt-4 text-brand-800/85 leading-relaxed text-lg italic font-editorial">{r.excerpt}</p>
                            <button className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900">Baca selengkapnya →</button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
