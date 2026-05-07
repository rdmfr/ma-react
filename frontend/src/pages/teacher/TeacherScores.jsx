import React, { useEffect, useState } from "react";
import { Save, Download } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/shared/Primitives";
import { students } from "../../data/mockData";
import { apiCreateRecord, apiListRecords, apiUpdateRecord, TOKEN_STORAGE_KEY } from "../../lib/backend";
import { useSearchParams } from "react-router-dom";

export default function TeacherScores() {
    const [searchParams] = useSearchParams();
    const [cls, setCls] = useState("X IPA 1");
    const [subject, setSubject] = useState("Matematika");
    const [semester, setSemester] = useState("Semester Genap 2024/2025");
    const [scores, setScores] = useState(students.slice(0, 10).map(s => ({ recordId: null, id: s.id, name: s.name, nis: s.nis, h1: 85, h2: 88, uts: 82, uas: 90 })));

    useEffect(() => {
        const qClass = searchParams.get("class");
        const qSubject = searchParams.get("subject");
        const qSemester = searchParams.get("semester");
        if (qClass) setCls(qClass);
        if (qSubject) setSubject(qSubject);
        if (qSemester) setSemester(qSemester);
    }, [searchParams]);

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (!token) return;
        apiListRecords("scores", 1000)
            .then((list) => {
                const filtered = (list || []).filter((r) => r.class === cls && r.subject === subject && r.semester === semester);
                const byNis = new Map(filtered.map((r) => [r.nis, r]));
                setScores(students.slice(0, 10).map(s => {
                    const rec = byNis.get(s.nis);
                    return {
                        recordId: rec?.id || null,
                        id: s.id,
                        name: s.name,
                        nis: s.nis,
                        h1: rec?.h1 ?? 85,
                        h2: rec?.h2 ?? 88,
                        uts: rec?.uts ?? 82,
                        uas: rec?.uas ?? 90,
                    };
                }));
            })
            .catch(() => {});
    }, [cls, subject, semester]);

    const update = (id, field, val) => setScores(prev => prev.map(s => s.id === id ? { ...s, [field]: Number(val) || 0 } : s));

    const exportCsv = () => {
        const header = ["NIS", "Nama", "Kelas", "Mapel", "Semester", "H1", "H2", "UTS", "UAS", "Akhir"];
        const lines = [header.join(",")].concat((scores || []).map((r) => {
            const final = Number((r.h1 * 0.15 + r.h2 * 0.15 + r.uts * 0.3 + r.uas * 0.4).toFixed(1));
            const val = (x) => `"${String(x ?? "").replaceAll('"', '""')}"`;
            return [val(r.nis), val(r.name), val(cls), val(subject), val(semester), r.h1, r.h2, r.uts, r.uas, final].join(",");
        }));
        const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nilai-${String(cls).replaceAll(" ", "-")}-${String(subject).replaceAll(" ", "-")}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const save = async () => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (!token) { toast.error("Silakan login dulu"); return; }
        try {
            const next = [];
            for (const row of scores) {
                const final = Number((row.h1 * 0.15 + row.h2 * 0.15 + row.uts * 0.3 + row.uas * 0.4).toFixed(1));
                const payload = { studentId: row.id, name: row.name, nis: row.nis, class: cls, subject, semester, h1: row.h1, h2: row.h2, uts: row.uts, uas: row.uas, final };
                if (row.recordId) {
                    await apiUpdateRecord(row.recordId, payload);
                    next.push(row);
                } else {
                    const created = await apiCreateRecord("scores", payload);
                    next.push({ ...row, recordId: created.id });
                }
            }
            setScores(next);
            toast.success("Nilai tersimpan");
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Gagal menyimpan nilai");
        }
    };

    return (
        <div data-testid="teacher-scores">
            <PageHeader title="Input Nilai" description="Masukkan nilai siswa langsung di tabel, lalu simpan." breadcrumbs={["Guru", "Nilai"]}
                actions={<><button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-900"><Download className="w-4 h-4" />Export CSV</button><button onClick={save} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Save className="w-4 h-4" />Simpan Semua</button></>} />
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex gap-3 flex-wrap">
                    <select value={cls} onChange={e => setCls(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"><option>X IPA 1</option><option>XI IPA 2</option></select>
                    <select value={subject} onChange={e => setSubject(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"><option>Matematika</option><option>Bahasa Indonesia</option></select>
                    <select value={semester} onChange={e => setSemester(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"><option>Semester Genap 2024/2025</option><option>Semester Ganjil 2024/2025</option></select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/50">
                            <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                                <th className="px-4 py-3">NIS</th><th className="px-4 py-3">Nama</th><th className="px-3 py-3 text-center">H1</th><th className="px-3 py-3 text-center">H2</th><th className="px-3 py-3 text-center">UTS</th><th className="px-3 py-3 text-center">UAS</th><th className="px-3 py-3 text-center">Rerata</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {scores.map(s => {
                                const avg = ((s.h1 + s.h2) * 0.2 + s.uts * 0.25 + s.uas * 0.35) / 1;
                                const final = (s.h1 * 0.15 + s.h2 * 0.15 + s.uts * 0.3 + s.uas * 0.4).toFixed(1);
                                return (
                                    <tr key={s.id} className="hover:bg-brand-50/20" data-testid={`score-row-${s.id}`}>
                                        <td className="px-4 py-2 font-mono text-xs">{s.nis}</td>
                                        <td className="px-4 py-2 font-semibold text-brand-950">{s.name}</td>
                                        {["h1", "h2", "uts", "uas"].map(f => (
                                            <td key={f} className="px-1 py-1 text-center">
                                                <input type="number" value={s[f]} onChange={e => update(s.id, f, e.target.value)}
                                                    className="w-16 text-center rounded-lg border border-slate-200 py-1.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm" data-testid={`input-${f}-${s.id}`} />
                                            </td>
                                        ))}
                                        <td className="px-3 py-2 text-center font-display font-black text-brand-800">{final}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
