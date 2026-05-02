import React, { useState } from "react";
import { Plus, CheckCircle2, X } from "lucide-react";
import { PageHeader } from "../../components/shared/Primitives";
import { academicYears, classes } from "../../data/mockData";
import { toast } from "sonner";
import { useRecordType } from "../../hooks/useRecordType";
import { apiAdminBulkUpdateRecords } from "../../lib/backend";

export default function AdminAcademicYears() {
    const yearsApi = useRecordType("academicYears", academicYears);
    const classesApi = useRecordType("classes", classes);
    const [editor, setEditor] = useState(false);
    const [form, setForm] = useState({ year: "", semester: "Ganjil", active: true });

    const openCreate = () => {
        setForm({ year: "", semester: "Ganjil", active: true });
        setEditor(true);
    };

    return (
        <div data-testid="admin-academic">
            <PageHeader title="Tahun Ajaran & Kelas" description="Kelola tahun ajaran aktif dan daftar kelas." breadcrumbs={["Admin", "Akademik"]}
                actions={<button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Plus className="w-4 h-4" />Tahun Ajaran Baru</button>} />
            <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-3">
                    <h3 className="font-display font-bold text-brand-950">Tahun Ajaran</h3>
                    {yearsApi.items.map(y => (
                        <button
                            key={y.id}
                            onClick={async () => {
                                if (!yearsApi.hasToken) return;
                                if (typeof y.id !== "string") { toast.error("Item demo tidak bisa diubah"); return; }
                                try {
                                    const toUpdate = yearsApi.items.filter((it) => typeof it.id === "string").map((it) => ({ ...it, active: it.id === y.id }));
                                    yearsApi.setItems(toUpdate);
                                    await apiAdminBulkUpdateRecords(toUpdate.map((it) => ({ id: it.id, data: it })));
                                    toast.success("Tahun ajaran aktif diperbarui");
                                } catch (err) {
                                    toast.error(err?.response?.data?.message || err.message || "Gagal memperbarui");
                                }
                            }}
                            className={`w-full text-left rounded-2xl p-5 ${y.active ? "gradient-brand text-white" : "bg-white border border-slate-100"}`}
                            data-testid={`year-${y.id}`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-display font-extrabold text-xl">{y.year}</div>
                                    <div className={`text-xs mt-0.5 ${y.active ? "text-brand-100" : "text-slate-600"}`}>Semester {y.semester}</div>
                                </div>
                                {y.active && <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white/20 backdrop-blur rounded-full px-2 py-1"><CheckCircle2 className="w-3 h-3" />Aktif</span>}
                            </div>
                        </button>
                    ))}
                </div>
                <div className="lg:col-span-8">
                    <h3 className="font-display font-bold text-brand-950 mb-3">Daftar Kelas</h3>
                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50/50">
                                <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                                    <th className="px-6 py-3">Kelas</th><th className="px-6 py-3">Tingkat</th><th className="px-6 py-3">Wali Kelas</th><th className="px-6 py-3">Siswa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {classesApi.items.map(c => (
                                    <tr key={c.id} className="hover:bg-brand-50/30" data-testid={`class-${c.id}`}>
                                        <td className="px-6 py-3 font-semibold text-brand-950">{c.name}</td>
                                        <td className="px-6 py-3"><span className="inline-flex text-[11px] font-bold bg-brand-100 text-brand-800 rounded-full px-2.5 py-0.5">Kelas {c.grade}</span></td>
                                        <td className="px-6 py-3 text-slate-700">{c.homeroom}</td>
                                        <td className="px-6 py-3 font-semibold text-brand-800">{c.students} siswa</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => setEditor(false)}>
                    <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">Tahun Ajaran Baru</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{form.year || "Tahun Ajaran"}</h3>
                            </div>
                            <button onClick={() => setEditor(false)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <div><label className="text-sm font-semibold text-brand-950">Tahun</label><input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2025/2026" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div><label className="text-sm font-semibold text-brand-950">Semester</label>
                                <select value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                                    <option value="Ganjil">Ganjil</option>
                                    <option value="Genap">Genap</option>
                                </select>
                            </div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-brand-950 select-none">
                                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-slate-300 text-brand-700 focus:ring-brand-500" />
                                Set aktif
                            </label>
                        </div>
                        <div className="px-7 py-4 border-t border-slate-100 flex gap-3">
                            <button onClick={() => setEditor(false)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button
                                onClick={async () => {
                                    if (!yearsApi.hasToken) { toast.error("Silakan login dulu"); return; }
                                    try {
                                        const created = await yearsApi.createItem({ year: form.year, semester: form.semester, active: !!form.active });
                                        if (form.active && typeof created?.id === "string") {
                                            const toUpdate = yearsApi.items
                                                .filter((it) => typeof it.id === "string")
                                                .map((it) => it.id === created.id ? it : ({ ...it, active: false }));
                                            yearsApi.setItems(toUpdate);
                                            await apiAdminBulkUpdateRecords(toUpdate.map((it) => ({ id: it.id, data: it })));
                                        }
                                        toast.success("Tahun ajaran dibuat");
                                        setEditor(false);
                                    } catch (err) {
                                        toast.error(err?.response?.data?.message || err.message || "Gagal membuat");
                                    }
                                }}
                                className="flex-1 rounded-xl gradient-brand text-white py-3 text-sm font-bold"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
