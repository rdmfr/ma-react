import React, { useState } from "react";
import { Plus, BookCopy, Download, Pencil, Trash2, X } from "lucide-react";
import { PageHeader } from "../../components/shared/Primitives";
import { initPublicData, modules } from "../../data/mockData";
import { toast } from "sonner";
import { useRecordType } from "../../hooks/useRecordType";
import { apiCreateRecordWithFile, apiUpdateRecordWithFile } from "../../lib/backend";
import { apiPublicDownloadModule } from "../../lib/backend";

export default function AdminModules() {
    const { items, setItems, createItem, updateItem, deleteItem, hasToken } = useRecordType("modules", modules);
    const [editor, setEditor] = useState(null);
    const [form, setForm] = useState({ title: "", subject: "", grade: "X", fileSize: "", downloads: 0, updatedAt: "", url: "", status: "approved" });
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

    const openCreate = () => {
        const today = new Date().toISOString().slice(0, 10);
        setForm({ title: "", subject: "", grade: "X", fileSize: "", downloads: 0, updatedAt: today, url: "", status: "approved" });
        setFile(null);
        setEditor({ mode: "create" });
    };
    const openEdit = (m) => {
        setForm({
            title: m.title || "",
            subject: m.subject || "",
            grade: m.grade || "X",
            fileSize: m.fileSize || "",
            downloads: m.downloads ?? 0,
            updatedAt: m.updatedAt || new Date().toISOString().slice(0, 10),
            url: m.url || "",
            status: m.status || "approved",
        });
        setFile(null);
        setEditor({ mode: "edit", item: m });
    };

    const save = async () => {
        if (!hasToken) { toast.error("Silakan login dulu"); return; }
        try {
            const payload = {
                title: form.title,
                subject: form.subject,
                grade: form.grade,
                fileSize: form.fileSize || (file ? formatBytes(file.size) : ""),
                downloads: Number(form.downloads) || 0,
                updatedAt: form.updatedAt || new Date().toISOString().slice(0, 10),
                url: form.url || "",
                status: form.status || "approved",
            };
            if (editor.mode === "create") {
                if (!file) { toast.error("Silakan pilih file modul"); return; }
                const created = await apiCreateRecordWithFile("modules", payload, file, "url");
                setItems((prev) => [created, ...(prev || [])]);
                initPublicData().catch(() => {});
                toast.success("Modul berhasil dibuat");
                setEditor(null);
                return;
            }
            const it = editor.item;
            if (typeof it?.id !== "string") { toast.error("Item demo tidak bisa diubah. Buat entri baru untuk menyimpan ke backend."); return; }
            if (file) {
                const updated = await apiUpdateRecordWithFile(it.id, payload, file, "url");
                setItems((prev) => (prev || []).map((x) => (x.id === it.id ? updated : x)));
            } else {
                await updateItem(it.id, payload);
            }
            initPublicData().catch(() => {});
            toast.success("Modul berhasil diperbarui");
            setEditor(null);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Gagal menyimpan");
        }
    };

    return (
        <div data-testid="admin-modules">
            <PageHeader title="Manajemen Modul" description="Kelola modul pembelajaran yang bisa diunduh publik." breadcrumbs={["Admin", "Modul"]}
                actions={<button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Plus className="w-4 h-4" />Unggah Modul</button>} />
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50/50">
                        <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                            <th className="px-6 py-3">Modul</th><th className="px-6 py-3">Mapel</th><th className="px-6 py-3">Kelas</th><th className="px-6 py-3">Unduhan</th><th className="px-6 py-3">Diperbarui</th><th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map(m => (
                            <tr key={m.id} className="hover:bg-brand-50/30" data-testid={`module-${m.id}`}>
                                <td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg gradient-brand text-white flex items-center justify-center"><BookCopy className="w-4 h-4" /></div><span className="font-semibold text-brand-950">{m.title}</span></div></td>
                                <td className="px-6 py-3 text-slate-700">{m.subject}</td>
                                <td className="px-6 py-3">{m.grade}</td>
                                <td className="px-6 py-3 font-semibold">{(m.downloads ?? 0).toLocaleString?.() || m.downloads}</td>
                                <td className="px-6 py-3 text-slate-600 text-xs">{m.updatedAt}</td>
                                <td className="px-6 py-3 text-right">
                                    <div className="inline-flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                if (typeof m.id !== "string") {
                                                    if (m.url) window.open(m.url, "_blank", "noopener,noreferrer");
                                                    else toast.error("File belum tersedia");
                                                    return;
                                                }
                                                apiPublicDownloadModule(m.id)
                                                    .then((res) => {
                                                        setItems((prev) => (prev || []).map((x) => (x.id === m.id ? { ...x, downloads: res?.downloads ?? x.downloads } : x)));
                                                        if (res?.url) window.open(res.url, "_blank", "noopener,noreferrer");
                                                        else toast.error("File belum tersedia");
                                                    })
                                                    .catch((err) => {
                                                        if (m.url) window.open(m.url, "_blank", "noopener,noreferrer");
                                                        else toast.error(err?.response?.data?.message || err.message || "Gagal mengunduh");
                                                    });
                                            }}
                                            className="w-8 h-8 rounded-lg hover:bg-brand-50 text-brand-700 flex items-center justify-center"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => openEdit(m)} className="w-8 h-8 rounded-lg hover:bg-brand-50 text-brand-700 flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button>
                                        <button
                                            onClick={async () => {
                                                if (!hasToken) { toast.error("Silakan login dulu"); return; }
                                                if (typeof m.id !== "string") { toast.error("Item demo tidak bisa dihapus"); return; }
                                                try { await deleteItem(m.id); initPublicData().catch(() => {}); toast.success("Modul dihapus"); } catch (err) { toast.error(err?.response?.data?.message || err.message || "Gagal menghapus"); }
                                            }}
                                            className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => setEditor(null)}>
                    <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">{editor.mode === "create" ? "Unggah Modul" : "Edit Modul"}</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{form.title || "Modul"}</h3>
                            </div>
                            <button onClick={() => setEditor(null)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <div><label className="text-sm font-semibold text-brand-950">Judul</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Mapel</label><input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Kelas</label><input value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Ukuran File</label><input value={form.fileSize} onChange={e => setForm({ ...form, fileSize: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div>
                                    <label className="text-sm font-semibold text-brand-950">File Modul</label>
                                    <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 bg-white" />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Unduhan</label><input type="number" value={form.downloads} onChange={e => setForm({ ...form, downloads: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Diperbarui</label><input value={form.updatedAt} onChange={e => setForm({ ...form, updatedAt: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 font-mono" /></div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-brand-950">Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                                    <option value="approved">approved</option>
                                    <option value="pending">pending</option>
                                    <option value="draft">draft</option>
                                    <option value="rejected">rejected</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-7 py-4 border-t border-slate-100 flex gap-3">
                            <button onClick={() => setEditor(null)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button onClick={save} className="flex-1 rounded-xl gradient-brand text-white py-3 text-sm font-bold">Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
