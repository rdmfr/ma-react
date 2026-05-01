import React, { useMemo, useState } from "react";
import { Plus, FileText, Pencil, Trash2, X } from "lucide-react";
import { PageHeader, StatusBadge } from "../../components/shared/Primitives";
import { approvalQueue } from "../../data/mockData";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { apiCreateRecord, apiDeleteRecord, apiGetRecord, apiUpdateRecord } from "../../lib/backend";
import { useRecordType } from "../../hooks/useRecordType";

export default function TeacherSubmissions() {
    const { user } = useAuth();
    const queueApi = useRecordType("approvalQueue", approvalQueue);
    const [editor, setEditor] = useState(null);
    const [form, setForm] = useState({ type: "Berita", title: "", content: "" });

    const myQueue = useMemo(() => {
        const email = user?.email || "";
        return queueApi.items.filter((a) => !a.submittedBy || a.submittedBy === email);
    }, [queueApi.items, user]);

    return (
        <div data-testid="teacher-submissions">
            <PageHeader title="Submisi Konten" description="Kelola berita, refleksi, dan konten lainnya yang Anda ajukan." breadcrumbs={["Guru", "Submisi"]}
                actions={<button onClick={() => { setForm({ type: "Berita", title: "", content: "" }); setEditor({ mode: "create" }); }} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Plus className="w-4 h-4" />Buat Submisi</button>} />
            <div className="space-y-3">
                {myQueue.map(a => (
                    <div key={a.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl gradient-brand text-white flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] uppercase tracking-wider text-brand-600 font-bold">{a.type}</div>
                            <div className="font-display font-bold text-brand-950">{a.title}</div>
                            <div className="text-xs text-slate-600 mt-0.5">{a.date}</div>
                        </div>
                        <StatusBadge status={a.status} />
                        <div className="flex gap-1">
                            <button onClick={() => { setForm({ type: a.type || "Berita", title: a.title || "", content: a.content || "" }); setEditor({ mode: "edit", item: a }); }} className="w-8 h-8 rounded-lg hover:bg-brand-50 text-brand-700 flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button>
                            <button
                                onClick={async () => {
                                    if (!queueApi.hasToken) { toast.error("Silakan login dulu"); return; }
                                    if (typeof a.id !== "string") { toast.error("Item demo tidak bisa dihapus"); return; }
                                    try {
                                        if (a.refId && typeof a.refId === "string") {
                                            await apiDeleteRecord(a.refId);
                                        }
                                        await queueApi.deleteItem(a.id);
                                        toast.success("Submisi dihapus");
                                    } catch (err) {
                                        toast.error(err?.response?.data?.message || err.message || "Gagal menghapus");
                                    }
                                }}
                                className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => setEditor(null)}>
                    <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">{editor.mode === "create" ? "Buat Submisi" : "Edit Submisi"}</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{form.title || "Konten"}</h3>
                            </div>
                            <button onClick={() => setEditor(null)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-brand-950">Tipe</label>
                                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                                    <option value="Berita">Berita</option>
                                    <option value="Refleksi">Refleksi</option>
                                </select>
                            </div>
                            <div><label className="text-sm font-semibold text-brand-950">Judul</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div><label className="text-sm font-semibold text-brand-950">Isi</label><textarea rows={6} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 resize-none" /></div>
                        </div>
                        <div className="px-7 py-4 border-t border-slate-100 flex gap-3">
                            <button onClick={() => setEditor(null)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button
                                onClick={async () => {
                                    if (!queueApi.hasToken) { toast.error("Silakan login dulu"); return; }
                                    try {
                                        const today = new Date().toISOString().slice(0, 10);
                                        const contentType = form.type === "Berita" ? "news" : "reflections";
                                        const contentPayload = form.type === "Berita"
                                            ? { title: form.title, category: "Akademik", excerpt: form.content.slice(0, 140), content: form.content, image: "", author: user?.name || "Guru", date: today, views: 0, slug: (form.title || "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-"), status: "pending", submittedBy: user?.email }
                                            : { title: form.title, author: user?.name || "Guru", date: today, image: "", excerpt: form.content.slice(0, 140), content: form.content, slug: (form.title || "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-"), status: "pending", submittedBy: user?.email };

                                        if (editor.mode === "create") {
                                            const createdContent = await apiCreateRecord(contentType, contentPayload);
                                            await apiCreateRecord("approvalQueue", { type: form.type, title: form.title, submittedBy: user?.email, date: today, status: "pending", refType: contentType, refId: createdContent.id });
                                            toast.success("Submisi dikirim ke admin");
                                            setEditor(null);
                                            return;
                                        }

                                        const it = editor.item;
                                        if (typeof it?.id !== "string") { toast.error("Item demo tidak bisa diubah"); return; }
                                        if (it.refId && typeof it.refId === "string") {
                                            const rec = await apiGetRecord(it.refId);
                                            await apiUpdateRecord(it.refId, { ...rec, ...contentPayload, status: rec.status || "pending" });
                                        }
                                        await queueApi.updateItem(it.id, { ...it, title: form.title });
                                        toast.success("Submisi diperbarui");
                                        setEditor(null);
                                    } catch (err) {
                                        toast.error(err?.response?.data?.message || err.message || "Gagal menyimpan");
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
