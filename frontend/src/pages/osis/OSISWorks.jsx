import React, { useMemo, useState } from "react";
import { Plus, BookMarked, Download, X } from "lucide-react";
import { PageHeader, StatusBadge } from "../../components/shared/Primitives";
import { studentWorks } from "../../data/mockData";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { apiCreateRecord } from "../../lib/backend";
import { useRecordType } from "../../hooks/useRecordType";

export default function OSISWorks() {
    const { user } = useAuth();
    const worksApi = useRecordType("studentWorks", studentWorks);
    const [editor, setEditor] = useState(false);
    const [form, setForm] = useState({ title: "", author: "", image: "", fileSize: "", category: "Sastra", url: "" });

    const myItems = useMemo(() => {
        const email = user?.email || "";
        return worksApi.items.filter((w) => !w.submittedBy || w.submittedBy === email);
    }, [worksApi.items, user]);

    return (
        <div data-testid="osis-works">
            <PageHeader title="Karya Siswa" description="Ajukan karya siswa untuk ditampilkan di halaman publik." breadcrumbs={["OSIS", "Karya"]}
                actions={<button onClick={() => { setForm({ title: "", author: "", image: "", fileSize: "", category: "Sastra", url: "" }); setEditor(true); }} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Plus className="w-4 h-4" />Unggah Karya</button>} />
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
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => setEditor(false)}>
                    <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">Unggah Karya</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{form.title || "Karya"}</h3>
                            </div>
                            <button onClick={() => setEditor(false)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <div><label className="text-sm font-semibold text-brand-950">Judul</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Penulis</label><input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Kategori</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Gambar (URL)</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Ukuran File</label><input value={form.fileSize} onChange={e => setForm({ ...form, fileSize: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            </div>
                            <div><label className="text-sm font-semibold text-brand-950">URL File (opsional)</label><input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                        </div>
                        <div className="px-7 py-4 border-t border-slate-100 flex gap-3">
                            <button onClick={() => setEditor(false)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button
                                onClick={async () => {
                                    if (!worksApi.hasToken) { toast.error("Silakan login dulu"); return; }
                                    try {
                                        const today = new Date().toISOString().slice(0, 10);
                                        const created = await worksApi.createItem({ title: form.title, author: form.author, image: form.image, downloads: 0, fileSize: form.fileSize, category: form.category, url: form.url, status: "pending", submittedBy: user?.email, date: today });
                                        await apiCreateRecord("approvalQueue", { type: "Karya Siswa", title: form.title, submittedBy: user?.email, date: today, status: "pending", refType: "studentWorks", refId: created.id });
                                        toast.success("Karya diajukan ke admin");
                                        setEditor(false);
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
