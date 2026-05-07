import React from "react";
import { FileCheck, Clock, XCircle, Trophy, Sparkles } from "lucide-react";
import { StatCard, PageHeader } from "../../components/shared/Primitives";
import { approvalQueue } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";

export default function OSISOverview() {
    const { user } = useAuth();
    const firstName = user?.name?.split(" ")?.[0] || "";
    const my = approvalQueue.filter(a => a.submittedBy.includes("OSIS"));
    const pending = my.filter(a => a.status === "pending").length;
    const approved = my.filter(a => a.status === "approved").length;
    return (
        <div data-testid="osis-overview">
            <div className="relative overflow-hidden rounded-3xl gradient-brand text-white p-8 lg:p-10 mb-8">
                <div className="absolute inset-0 noise-overlay opacity-30" />
                <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
                <div className="relative">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-3 py-1 text-xs font-semibold mb-4"><Sparkles className="w-3 h-3" />Dashboard OSIS</div>
                    <h1 className="font-display text-3xl lg:text-4xl font-black tracking-tight">Halo, <span className="font-editorial italic">{firstName}</span>!</h1>
                    <p className="text-brand-100/90 mt-2">Ayo aktif kelola kegiatan & konten OSIS.</p>
                </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Submisi Saya" value={my.length} icon={FileCheck} />
                <StatCard label="Menunggu Review" value={pending} icon={Clock} accent="bg-amber-50 text-amber-700" />
                <StatCard label="Disetujui" value={approved} icon={Trophy} accent="bg-emerald-50 text-emerald-700" />
                <StatCard label="Ditolak" value={my.filter(a => a.status === "rejected").length} icon={XCircle} accent="bg-red-50 text-red-700" />
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 p-6">
                <h3 className="font-display font-bold text-xl text-brand-950 mb-4">Status Submisi Terbaru</h3>
                <div className="space-y-3">
                    {my.map(a => (
                        <div key={a.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-brand-50/40 border border-slate-100">
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-brand-600 font-bold">{a.type}</div>
                                <div className="font-semibold text-brand-950 mt-0.5">{a.title}</div>
                                <div className="text-xs text-slate-600 mt-0.5">{a.date}</div>
                            </div>
                            <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${a.status === "pending" ? "bg-amber-100 text-amber-800" : a.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{a.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
