import React from "react";
import { Pin, Calendar } from "lucide-react";
import { announcements } from "../../data/mockData";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function Pengumuman() {
    const visible = announcements.filter(a => !a.status || a.status === "approved");
    const pinned = visible.filter(a => a.pinned);
    const rest = visible.filter(a => !a.pinned);
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="pengumuman-page">
            <div className="max-w-3xl">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Pengumuman</div>
                <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Info <span className="font-editorial italic text-brand-700">resmi</span> madrasah.</h1>
            </div>
            {pinned.length > 0 && (
                <div className="mt-10">
                    <div className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-3 inline-flex items-center gap-2"><Pin className="w-3.5 h-3.5" /> Disematkan</div>
                    <div className="space-y-3">
                        {pinned.map(a => (
                            <div key={a.id} className="bg-white rounded-2xl border border-brand-200 p-5 card-lift" data-testid={`pengumuman-${a.id}`}>
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <h3 className="font-display font-bold text-brand-950">{a.title}</h3>
                                    <span className="text-xs text-slate-500 inline-flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {format(new Date(a.date), "d MMM yyyy", { locale: idLocale })}</span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed">{a.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="mt-8 space-y-3">
                {rest.map(a => (
                    <div key={a.id} className="bg-white rounded-2xl border border-slate-100 p-5 card-lift" data-testid={`pengumuman-${a.id}`}>
                        <div className="flex items-center justify-between gap-4 mb-2">
                            <h3 className="font-display font-bold text-brand-950">{a.title}</h3>
                            <span className="text-xs text-slate-500">{format(new Date(a.date), "d MMM yyyy", { locale: idLocale })}</span>
                        </div>
                        <p className="text-sm text-slate-700">{a.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
