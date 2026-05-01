import React from "react";
import { Clock, User } from "lucide-react";
import { extracurriculars } from "../../data/mockData";

export default function Ekstrakurikuler() {
    const visible = extracurriculars.filter((e) => !e.status || e.status === "approved");
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="ekskul-page">
            <div className="max-w-3xl">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Ekstrakurikuler</div>
                <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Asah <span className="font-editorial italic text-brand-700">bakat</span>, bentuk karakter.</h1>
            </div>
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visible.map((e) => (
                    <div key={e.id} className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white card-lift" data-testid={`ekskul-${e.id}`}>
                        <div className="aspect-[4/3] overflow-hidden">
                            <img src={e.image} alt={e.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                        </div>
                        <div className="p-6">
                            <h3 className="font-display font-extrabold text-xl text-brand-950">{e.name}</h3>
                            <p className="text-sm text-slate-600 mt-2 line-clamp-2">{e.description}</p>
                            <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
                                <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-600" /> {e.schedule}</span>
                                <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-brand-600" /> {e.coach}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
