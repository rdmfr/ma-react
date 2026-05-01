import React from "react";
import { Download, Filter } from "lucide-react";
import { PageHeader } from "../../components/shared/Primitives";
import { scores } from "../../data/mockData";
import { useRecordType } from "../../hooks/useRecordType";

export default function AdminScores() {
    const { items } = useRecordType("scores", scores);
    return (
        <div data-testid="admin-scores">
            <PageHeader title="Rekap Nilai" description="Lihat dan ekspor rekap nilai siswa." breadcrumbs={["Admin", "Nilai"]}
                actions={<><button className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-900"><Filter className="w-4 h-4" />Filter</button><button className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Download className="w-4 h-4" />Export Excel</button></>} />
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 grid sm:grid-cols-4 gap-3">
                    <select className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"><option>Semua Kelas</option><option>X IPA 1</option><option>X IPA 2</option></select>
                    <select className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"><option>Semua Mapel</option><option>Matematika</option></select>
                    <select className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"><option>Semester Genap</option><option>Semester Ganjil</option></select>
                    <select className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"><option>2024/2025</option><option>2023/2024</option></select>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-slate-50/50">
                        <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                            <th className="px-6 py-3">Siswa</th><th className="px-6 py-3">Harian</th><th className="px-6 py-3">UTS</th><th className="px-6 py-3">UAS</th><th className="px-6 py-3">Rerata</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map(s => (
                            <tr key={s.id || s.studentId} className="hover:bg-brand-50/30" data-testid={`score-${s.id || s.studentId}`}>
                                <td className="px-6 py-3 font-semibold text-brand-950">{s.name}</td>
                                <td className="px-6 py-3">{s.harian ?? s.h1 ?? "-"}</td>
                                <td className="px-6 py-3">{s.uts ?? "-"}</td>
                                <td className="px-6 py-3">{s.uas ?? "-"}</td>
                                <td className="px-6 py-3"><span className={`font-display font-black text-lg ${(s.rerata ?? s.final ?? 0) >= 85 ? "text-emerald-700" : (s.rerata ?? s.final ?? 0) >= 75 ? "text-brand-700" : "text-amber-700"}`}>{s.rerata ?? s.final ?? "-"}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
