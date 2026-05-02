import React, { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { PageHeader } from "../../components/shared/Primitives";
import { scores, students } from "../../data/mockData";
import { useRecordType } from "../../hooks/useRecordType";

export default function AdminScores() {
    const { items } = useRecordType("scores", scores);
    const studentsStore = useRecordType("students", students);
    const [q, setQ] = useState("");
    const [cls, setCls] = useState("Semua");

    const studentById = useMemo(() => {
        const map = new Map();
        (studentsStore.items || []).forEach((s) => {
            map.set(String(s.id), s);
            if (s.nis) map.set(String(s.nis), s);
        });
        return map;
    }, [studentsStore.items]);

    const rows = useMemo(() => {
        return (items || []).map((sc) => {
            const sid = sc.studentId ?? sc.student_id ?? sc.student ?? sc.nis ?? sc.id;
            const st = sid != null ? studentById.get(String(sid)) : null;
            return { ...sc, _class: st?.class || sc.class || "" };
        });
    }, [items, studentById]);

    const classes = useMemo(() => Array.from(new Set((studentsStore.items || []).map((s) => s.class).filter(Boolean))), [studentsStore.items]);
    const filtered = useMemo(() => {
        return rows.filter((s) => (cls === "Semua" || s._class === cls) && ((s.name || "").toLowerCase().includes(q.toLowerCase())));
    }, [rows, cls, q]);

    const exportCsv = () => {
        const header = ["Kelas", "Siswa", "Harian", "UTS", "UAS", "Rerata"];
        const lines = [header.join(",")].concat(filtered.map((s) => {
            const val = (x) => `"${String(x ?? "").replaceAll('"', '""')}"`;
            return [val(s._class), val(s.name), val(s.harian ?? s.h1 ?? ""), val(s.uts ?? ""), val(s.uas ?? ""), val(s.rerata ?? s.final ?? "")].join(",");
        }));
        const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "rekap-nilai.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <div data-testid="admin-scores">
            <PageHeader title="Rekap Nilai" description="Lihat dan ekspor rekap nilai siswa." breadcrumbs={["Admin", "Nilai"]}
                actions={<button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Download className="w-4 h-4" />Export CSV</button>} />
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4">
                        <Search className="w-4 h-4 text-slate-500" />
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari siswa..." className="flex-1 py-2.5 bg-transparent outline-none text-sm" />
                    </div>
                    <select value={cls} onChange={(e) => setCls(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
                        <option>Semua</option>
                        {classes.map((c) => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-slate-50/50">
                        <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                            <th className="px-6 py-3">Kelas</th><th className="px-6 py-3">Siswa</th><th className="px-6 py-3">Harian</th><th className="px-6 py-3">UTS</th><th className="px-6 py-3">UAS</th><th className="px-6 py-3">Rerata</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map(s => (
                            <tr key={s.id || s.studentId} className="hover:bg-brand-50/30" data-testid={`score-${s.id || s.studentId}`}>
                                <td className="px-6 py-3"><span className="inline-flex text-[11px] font-bold bg-brand-100 text-brand-800 rounded-full px-2.5 py-0.5">{s._class || "-"}</span></td>
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
