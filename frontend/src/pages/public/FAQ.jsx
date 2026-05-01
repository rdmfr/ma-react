import React, { useState, useMemo } from "react";
import { Plus, Minus } from "lucide-react";
import { faqs } from "../../data/mockData";

export default function FAQ() {
    const [cat, setCat] = useState("Semua");
    const [openIdx, setOpenIdx] = useState(0);
    const cats = ["Semua", ...Array.from(new Set(faqs.map(f => f.category)))];
    const filtered = useMemo(() => cat === "Semua" ? faqs : faqs.filter(f => f.category === cat), [cat]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="faq-page">
            <div className="max-w-3xl">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />FAQ</div>
                <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Pertanyaan yang <span className="font-editorial italic text-brand-700">sering</span> ditanyakan.</h1>
            </div>
            <div className="mt-10 flex gap-2 overflow-x-auto">
                {cats.map(c => (
                    <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${cat === c ? "bg-brand-950 text-white" : "bg-white border border-slate-200 text-brand-900 hover:bg-brand-50"}`} data-testid={`faq-cat-${c}`}>{c}</button>
                ))}
            </div>
            <div className="mt-8 space-y-3">
                {filtered.map((f, i) => {
                    const isOpen = openIdx === i;
                    return (
                        <div key={f.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden card-lift" data-testid={`faq-${f.id}`}>
                            <button className="w-full flex items-center justify-between gap-4 p-5 text-left" onClick={() => setOpenIdx(isOpen ? -1 : i)}>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-brand-600">{f.category}</div>
                                    <div className="font-display font-bold text-brand-950 mt-1">{f.q}</div>
                                </div>
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isOpen ? "gradient-brand text-white" : "bg-brand-50 text-brand-700"}`}>
                                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </div>
                            </button>
                            {isOpen && <div className="px-5 pb-5 text-slate-700 leading-relaxed">{f.a}</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
