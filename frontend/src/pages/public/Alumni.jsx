import React, { useState } from "react";
import { Quote } from "lucide-react";
import { alumni } from "../../data/mockData";

export default function Alumni() {
    const [year, setYear] = useState("Semua");
    const years = ["Semua", ...Array.from(new Set(alumni.map(a => a.year))).sort((a, b) => b - a)];
    const filtered = year === "Semua" ? alumni : alumni.filter(a => a.year === year);
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="alumni-page">
            <div className="max-w-3xl">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Alumni</div>
                <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Jejak sukses para <span className="font-editorial italic text-brand-700">alumni</span>.</h1>
            </div>
            <div className="mt-10 flex gap-2 overflow-x-auto">
                {years.map(y => (
                    <button key={y} onClick={() => setYear(y)} data-testid={`alumni-year-${y}`}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${year === y ? "bg-brand-950 text-white" : "bg-white border border-slate-200 text-brand-900 hover:bg-brand-50"}`}>{y === "Semua" ? "Semua Tahun" : `Angkatan ${y}`}</button>
                ))}
            </div>
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((a) => (
                    <div key={a.id} className="bg-white rounded-3xl p-6 border border-slate-100 card-lift" data-testid={`alumni-${a.id}`}>
                        <Quote className="w-6 h-6 text-brand-500" />
                        <p className="mt-4 text-brand-900/90 italic font-editorial leading-relaxed">"{a.testimonial}"</p>
                        <div className="mt-6 flex items-center gap-3 pt-5 border-t border-slate-100">
                            <img src={a.photo} alt={a.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <div className="font-display font-bold text-brand-950">{a.name}</div>
                                <div className="text-xs text-slate-600">{a.profession} · Angkatan {a.year}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
