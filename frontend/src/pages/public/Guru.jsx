import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Star } from "lucide-react";
import { teachers } from "../../data/mockData";

export default function Guru() {
    const [q, setQ] = useState("");
    const [sub, setSub] = useState("Semua");
    const visible = useMemo(() => teachers.filter((t) => !t.status || t.status === "approved"), []);
    const subjects = useMemo(() => {
        const set = new Set();
        for (const t of visible) {
            if (t?.subject) set.add(t.subject);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [visible]);
    const filtered = useMemo(() => visible.filter(t =>
        (sub === "Semua" || t.subject === sub) &&
        (t.name.toLowerCase().includes(q.toLowerCase()) || (t.subject || "").toLowerCase().includes(q.toLowerCase()))
    ), [q, sub, visible]);

    const photoFor = (t) => t.photo || `https://i.pravatar.cc/600?u=${encodeURIComponent(t.slug || t.name || t.id)}`;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="guru-page">
            <div className="max-w-3xl">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Guru & Staff</div>
                <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Para pendidik yang <span className="font-editorial italic text-brand-700">menginspirasi</span>.</h1>
                <p className="mt-5 text-brand-800/85 max-w-2xl">Temui tim pengajar profesional yang berdedikasi membimbing siswa menggapai potensi terbaiknya.</p>
            </div>
            <div className="mt-10 flex flex-col md:flex-row gap-4 bg-white rounded-2xl border border-slate-100 p-3">
                <div className="flex items-center gap-2 flex-1 bg-brand-50/40 rounded-xl px-4">
                    <Search className="w-4 h-4 text-brand-600" />
                    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari nama atau jabatan/mapel..." className="flex-1 py-3 bg-transparent outline-none text-sm" data-testid="guru-search" />
                </div>
                <select value={sub} onChange={e => setSub(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-brand-500" data-testid="guru-filter">
                    <option>Semua</option>
                    {subjects.map(s => <option key={s}>{s}</option>)}
                </select>
            </div>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filtered.map((t) => (
                    <Link key={t.id} to={`/guru/${t.slug}`} className="group" data-testid={`guru-card-${t.id}`}>
                        <div className="aspect-[3/4] rounded-3xl overflow-hidden relative bg-brand-100">
                            <img src={photoFor(t)} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/20 to-transparent" />
                            {t.is_featured && (
                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur rounded-full px-2.5 py-1 text-[10px] font-bold text-brand-800 inline-flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Unggulan
                                </div>
                            )}
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <div className="text-[10px] uppercase tracking-[0.2em] text-brand-300 font-bold">{t.subject}</div>
                                <div className="font-display font-bold text-lg leading-tight mt-1">{t.name}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {filtered.length === 0 && <div className="mt-10 text-center text-slate-500">Tidak ada data yang cocok.</div>}
        </div>
    );
}
