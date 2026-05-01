import React from "react";
import { GraduationCap, FileBarChart2, BookCopy, Calendar, Sparkles } from "lucide-react";
import { StatCard, PageHeader } from "../../components/shared/Primitives";
import { classes, evaluations, approvalQueue } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";

export default function TeacherOverview() {
    const { user } = useAuth();
    const myApprovals = approvalQueue.filter(a => a.submittedBy.includes("Siti") || a.submittedBy.includes("Bambang")).slice(0, 3);
    return (
        <div data-testid="teacher-overview">
            <div className="relative overflow-hidden rounded-3xl gradient-brand text-white p-8 lg:p-10 mb-8">
                <div className="absolute inset-0 noise-overlay opacity-30" />
                <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
                <div className="relative">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-3 py-1 text-xs font-semibold mb-4"><Sparkles className="w-3 h-3" />Dashboard Guru</div>
                    <h1 className="font-display text-3xl lg:text-4xl font-black tracking-tight">Assalamu'alaikum, <span className="font-editorial italic">{user?.name?.split(" ")[0]}</span>.</h1>
                    <p className="text-brand-100/90 mt-2">Semangat mengajar hari ini!</p>
                </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Kelas Saya" value="3" icon={GraduationCap} hint="X IPA 1, XI IPA 2, XII IPA 1" />
                <StatCard label="Nilai Tertunda" value="12" icon={FileBarChart2} accent="bg-amber-50 text-amber-700" />
                <StatCard label="Modul Saya" value="5" icon={BookCopy} accent="bg-blue-50 text-blue-700" />
                <StatCard label="Evaluasi Minggu Ini" value="2" icon={Calendar} accent="bg-rose-50 text-rose-700" />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-slate-100 p-6">
                    <h3 className="font-display font-bold text-xl text-brand-950 mb-4">Kelas yang Diampu</h3>
                    <div className="space-y-3">
                        {classes.slice(0, 3).map(c => (
                            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-50/40">
                                <div>
                                    <div className="font-semibold text-brand-950">{c.name}</div>
                                    <div className="text-xs text-slate-600">{c.students} siswa</div>
                                </div>
                                <span className="inline-flex text-[11px] font-bold bg-brand-100 text-brand-800 rounded-full px-2.5 py-0.5">Kelas {c.grade}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 p-6">
                    <h3 className="font-display font-bold text-xl text-brand-950 mb-4">Status Submisi Saya</h3>
                    <div className="space-y-3">
                        {myApprovals.map(a => (
                            <div key={a.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-50/40">
                                <div>
                                    <div className="font-semibold text-brand-950 truncate">{a.title}</div>
                                    <div className="text-xs text-slate-600">{a.type} · {a.date}</div>
                                </div>
                                <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${a.status === "pending" ? "bg-amber-100 text-amber-800" : a.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{a.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
