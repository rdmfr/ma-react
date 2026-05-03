import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Briefcase } from "lucide-react";
import { teachers } from "../../data/mockData";

export default function GuruDetail() {
    const { slug } = useParams();
    const t = teachers.find(x => x.slug === slug) || teachers[0];
    const photo = t.photo || `https://i.pravatar.cc/900?u=${encodeURIComponent(t.slug || t.name || t.id)}`;
    const hasBio = !!(t.bio && String(t.bio).trim());
    const hasEducation = !!(t.education && String(t.education).trim());
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="guru-detail-page">
            <Link to="/guru" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 mb-8"><ArrowLeft className="w-4 h-4" /> Kembali ke daftar guru</Link>
            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5">
                    <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-brand-100"><img src={photo} alt={t.name} className="w-full h-full object-cover" /></div>
                </div>
                <div className="lg:col-span-7">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">{t.subject || "Guru & Staf"}</div>
                    <h1 className="font-display text-5xl font-black text-brand-950 mt-3 tracking-tight leading-[0.95]">{t.name}</h1>
                    {hasBio && <p className="mt-6 text-brand-800/85 text-lg leading-relaxed">{t.bio}</p>}
                    <div className="mt-8 grid sm:grid-cols-2 gap-4">
                        {hasEducation && (
                            <div className="bg-white rounded-2xl p-5 border border-slate-100">
                                <div className="flex items-center gap-2 text-brand-700"><Briefcase className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Pendidikan</span></div>
                                <div className="mt-2 font-semibold text-brand-950">{t.education}</div>
                            </div>
                        )}
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 sm:col-span-2">
                            <div className="flex items-center gap-2 text-brand-700"><Briefcase className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Jabatan / Mapel</span></div>
                            <div className="mt-2 font-semibold text-brand-950">{t.subject || "-"}</div>
                        </div>
                        {t.contact && (
                            <div className="bg-white rounded-2xl p-5 border border-slate-100 sm:col-span-2">
                                <div className="flex items-center gap-2 text-brand-700"><Mail className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Kontak</span></div>
                                <a href={`mailto:${t.contact}`} className="mt-2 font-semibold text-brand-950 hover:text-brand-700 block">{t.contact}</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
