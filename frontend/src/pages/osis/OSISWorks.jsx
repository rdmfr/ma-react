import React, { useMemo, useState } from "react";
import { Plus, BookMarked, Download, X } from "lucide-react";
import { PageHeader, StatusBadge } from "../../components/shared/Primitives";
import { studentWorks } from "../../data/mockData";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { apiCreateRecord, apiCreateRecordWithFile, apiUpdateRecordWithFile } from "../../lib/backend";
import { useRecordType } from "../../hooks/useRecordType";

export default function OSISWorks() {
    const { user } = useAuth();
    const worksApi = useRecordType("studentWorks", studentWorks);
    const [editor, setEditor] = useState(false);
    const [form, setForm] = useState({ title: "", author: "", image: "", fileSize: "", category: "Sastra", url: "" });
    const [imageFile, setImageFile] = useState(null);
    const [workFile, setWorkFile] = useState(null);

    const formatBytes = (bytes) => {
        const n = Number(bytes) || 0;
        if (!n) return "";
        const units = ["B", "KB", "MB", "GB"];
        const i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
        const v = n / Math.pow(1024, i);
        const fixed = i === 0 ? 0 : v < 10 ? 1 : 0;
        return `${v.toFixed(fixed)} ${units[i]}`;
    };

    const myItems = useMemo(() => {
        const email = user?.email || "";
        return worksApi.items.filter((w) => !w.submittedBy || w.submittedBy === email);
    }, [worksApi.items, user]);

    return (
        <div data-testid="osis-works">
            <PageHeader title="Karya Siswa" description="Ajukan karya siswa untuk ditampilkan di halaman publik." breadcrumbs={["OSIS", "Karya"]}
                actions={<button onClick={() => { setForm({ title: "", author: "", image: "", fileSize: "", category: "Sastra", url: "" }); setImageFile(null); setWorkFile(null); setEditor(true); }} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Plus className="w-4 h-4" />Unggah Karya</button>} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {myItems.map((k, i) => (
                    <div key={k.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden card-lift">
                        <div className="aspect-[4/3] overflow-hidden"><img src={k.image} alt={k.title} className="w-full h-full object-cover" /></div>
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 rounded-full px-2 py-0.5">{k.category}</span>
                                <StatusBadge status={k.status || (i % 3 === 0 ? "pending" : "approved")} />
                            </div>
                            <h3 className="font-display font-bold text-brand-950 mt-3 leading-tight">{k.title}</h3>
                            <div className="flex items-center justify-between mt-3 text-xs text-slate-600">
                                <span>{k.fileSize}</span>
                                <span className="inline-flex items-center gap-1"><Download className="w-3 h-3" />{k.downloads}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => { setEditor(false); setImageFile(null); setWorkFile(null); }}>
                    <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">Unggah Karya</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{form.title || "Karya"}</h3>
                            </div>
                            <button onClick={() => { setEditor(false); setImageFile(null); setWorkFile(null); }} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <div><label className="text-sm font-semibold text-brand-950">Judul</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Penulis</label><input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Kategori</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-brand-950">Cover</label>
                                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 bg-white" />
                                <div className="mt-2 text-xs text-slate-500">Atau isi URL cover (opsional)</div>
                                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" placeholder="https://..." />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-brand-950">File Karya</label>
                                <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv" onChange={(e) => { const f = e.target.files?.[0] || null; setWorkFile(f); if (f) setForm((p) => ({ ...p, fileSize: p.fileSize || formatBytes(f.size) })); }} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 bg-white" />
                                <div className="mt-2 text-xs text-slate-500">Atau isi URL file (opsional)</div>
                                <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" placeholder="https://..." />
                            </div>
                            <div><label className="text-sm font-semibold text-brand-950">Ukuran File</label><input value={form.fileSize} onChange={e => setForm({ ...form, fileSize: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                        </div>
                        <div className="px-7 py-4 border-t border-slate-100 flex gap-3">
                            <button onClick={() => { setEditor(false); setImageFile(null); setWorkFile(null); }} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button
                                onClick={async () => {
                                    if (!worksApi.hasToken) { toast.error("Silakan login dulu"); return; }
                                    try {
                                        const today = new Date().toISOString().slice(0, 10);
                                        const payload = { title: form.title, author: form.author, image: form.image, downloads: 0, fileSize: form.fileSize || (workFile ? formatBytes(workFile.size) : ""), category: form.category, url: form.url, status: "pending", submittedBy: user?.email, date: today };

                                        let created = null;
                                        if (imageFile) {
                                            created = await apiCreateRecordWithFile("studentWorks", payload, imageFile, "image");
                                            worksApi.setItems((prev) => [created, ...(prev || [])]);
                                        } else {
                                            created = await worksApi.createItem(payload);
                                        }

                                        if (workFile && typeof created?.id === "string") {
                                            const updated = await apiUpdateRecordWithFile(created.id, { ...payload, image: created.image || payload.image, url: payload.url }, workFile, "url");
                                            worksApi.setItems((prev) => (prev || []).map((x) => (x.id === created.id ? updated : x)));
                                            created = updated;
                                        }

                                        await apiCreateRecord("approvalQueue", { type: "Karya Siswa", title: created.title || form.title, submittedBy: user?.email, date: today, status: "pending", refType: "studentWorks", refId: created.id });
                                        toast.success("Karya diajukan ke admin");
                                        setEditor(false);
                                        setImageFile(null);
                                        setWorkFile(null);
                                    } catch (err) {
                                        toast.error(err?.response?.data?.message || err.message || "Gagal mengirim");
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
