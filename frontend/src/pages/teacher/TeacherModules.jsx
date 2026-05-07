import React, { useMemo, useState } from "react";
import { Upload, BookCopy, X } from "lucide-react";
import { PageHeader, StatusBadge } from "../../components/shared/Primitives";
import { modules } from "../../data/mockData";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { apiCreateRecord, apiCreateRecordWithFile } from "../../lib/backend";
import { useRecordType } from "../../hooks/useRecordType";

export default function TeacherModules() {
    const { user } = useAuth();
    const modulesApi = useRecordType("modules", modules);
    const [editor, setEditor] = useState(false);
    const [form, setForm] = useState({ title: "", subject: "", grade: "X" });
    const [file, setFile] = useState(null);

    const formatBytes = (bytes) => {
        const n = Number(bytes) || 0;
        if (!n) return "";
        const units = ["B", "KB", "MB", "GB"];
        const i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
        const v = n / Math.pow(1024, i);
        const fixed = i === 0 ? 0 : v < 10 ? 1 : 0;
        return `${v.toFixed(fixed)} ${units[i]}`;
    };

    const myModules = useMemo(() => {
        const email = user?.email || "";
        return modulesApi.items.filter((m) => !m.submittedBy || m.submittedBy === email).slice(0, 50);
    }, [modulesApi.items, user]);

    return (
        <div data-testid="teacher-modules">
            <PageHeader title="Unggah Modul" description="Unggah modul pembelajaran. Akan masuk ke antrian persetujuan admin." breadcrumbs={["Guru", "Modul"]}
                actions={<button onClick={() => setEditor(true)} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Upload className="w-4 h-4" />Unggah Modul Baru</button>} />
            <button
                onClick={() => setEditor(true)}
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer?.files?.[0];
                    if (!f) return;
                    setFile(f);
                    setEditor(true);
                }}
                className="border-2 border-dashed border-brand-200 rounded-3xl p-12 text-center bg-brand-50/40 mb-8 w-full"
                type="button"
            >
                <Upload className="w-10 h-10 text-brand-700 mx-auto" />
                <div className="font-display font-bold text-brand-950 text-lg mt-3">Seret file ke sini atau klik untuk pilih</div>
                <div className="text-sm text-slate-600 mt-1">PDF, DOCX · Maks 20MB per file</div>
            </button>
            <h3 className="font-display font-bold text-brand-950 mb-3">Modul Saya</h3>
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50/50">
                        <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                            <th className="px-6 py-3">Modul</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Unduhan</th><th className="px-6 py-3">Diperbarui</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {myModules.slice(0, 8).map(m => (
                            <tr key={m.id} className="hover:bg-brand-50/30">
                                <td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg gradient-brand text-white flex items-center justify-center"><BookCopy className="w-4 h-4" /></div><span className="font-semibold text-brand-950">{m.title}</span></div></td>
                                <td className="px-6 py-3"><StatusBadge status={m.status || "pending"} /></td>
                                <td className="px-6 py-3">{m.downloads ?? 0}</td>
                                <td className="px-6 py-3 text-slate-600 text-xs">{m.updatedAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => { setEditor(false); setFile(null); }}>
                    <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">Unggah Modul</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{form.title || "Modul Baru"}</h3>
                            </div>
                            <button onClick={() => { setEditor(false); setFile(null); }} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <div><label className="text-sm font-semibold text-brand-950">Judul</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Mapel</label><input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Kelas</label><input value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-brand-950">File Modul</label>
                                <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 bg-white" />
                            </div>
                        </div>
                        <div className="px-7 py-4 border-t border-slate-100 flex gap-3">
                            <button onClick={() => { setEditor(false); setFile(null); }} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button
                                onClick={async () => {
                                    if (!modulesApi.hasToken) { toast.error("Silakan login dulu"); return; }
                                    try {
                                        if (!file) { toast.error("Silakan pilih file modul"); return; }
                                        const today = new Date().toISOString().slice(0, 10);
                                        const created = await apiCreateRecordWithFile("modules", {
                                            title: form.title,
                                            subject: form.subject,
                                            grade: form.grade,
                                            fileSize: formatBytes(file.size),
                                            downloads: 0,
                                            updatedAt: today,
                                            status: "pending",
                                            submittedBy: user?.email,
                                        }, file, "url");
                                        modulesApi.setItems((prev) => [created, ...(prev || [])]);
                                        await apiCreateRecord("approvalQueue", {
                                            type: "Modul",
                                            title: form.title,
                                            submittedBy: user?.email,
                                            date: today,
                                            status: "pending",
                                            refType: "modules",
                                            refId: created.id,
                                        });
                                        toast.success("Modul diajukan ke admin");
                                        setEditor(false);
                                        setFile(null);
                                    } catch (err) {
                                        toast.error(err?.response?.data?.message || err.message || "Gagal mengunggah");
                                    }
                                }}
                                className="flex-1 rounded-xl gradient-brand text-white py-3 text-sm font-bold"
                            >
                                Kirim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
