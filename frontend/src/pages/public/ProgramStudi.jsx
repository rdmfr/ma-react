import React from "react";
import { Atom, Globe, BookOpen, Check } from "lucide-react";
import { programStudies } from "../../data/mockData";

const ICONS = { Atom, Globe, BookOpen };

export default function ProgramStudi() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="program-page">
            <div className="max-w-3xl">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Program Studi</div>
                <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Pilih jalur <span className="font-editorial italic text-brand-700">peminatan</span>mu.</h1>
            </div>
            <div className="mt-12 grid md:grid-cols-2 gap-6">
                {programStudies.map((p, i) => {
                    const Icon = ICONS[p.icon] || BookOpen;
                    const isMid = i === 1;
                    return (
                        <div key={p.id} className={`rounded-[2rem] p-8 relative overflow-hidden card-lift ${isMid ? "bg-brand-950 text-white" : "bg-white border border-slate-100"}`} data-testid={`program-${p.id}`}>
                            <div className={`absolute -top-24 -right-24 w-60 h-60 rounded-full ${isMid ? "bg-brand-500/20" : "bg-brand-100/70"} blur-3xl`} />
                            <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center ${isMid ? "bg-brand-500/20 text-brand-300" : "gradient-brand text-white"}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <h3 className={`relative font-display font-extrabold text-2xl mt-5 leading-tight ${isMid ? "text-white" : "text-brand-950"}`}>{p.name}</h3>
                            <p className={`relative mt-3 leading-relaxed ${isMid ? "text-brand-200" : "text-brand-800/80"}`}>{p.description}</p>
                            <ul className="relative mt-6 space-y-2">
                                {p.highlights.map((h) => (
                                    <li key={h} className={`flex gap-2 text-sm ${isMid ? "text-brand-100" : "text-brand-900"}`}>
                                        <Check className={`w-4 h-4 shrink-0 ${isMid ? "text-brand-300" : "text-brand-600"}`} /> {h}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
