import React, { useMemo, useState } from "react";
import { Plus, Upload, Images, X } from "lucide-react";
import { PageHeader, StatusBadge } from "../../components/shared/Primitives";
import { galleries } from "../../data/mockData";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { apiCreateRecord, apiCreateRecordWithFile } from "../../lib/backend";
import { useRecordType } from "../../hooks/useRecordType";

export default function OSISGallery() {
    const { user } = useAuth();
    const galleriesApi = useRecordType("galleries", galleries);
    const [editor, setEditor] = useState(false);
    const [form, setForm] = useState({ title: "", cover: "", date: new Date().toISOString().slice(0, 10), count: 0 });
    const [coverFile, setCoverFile] = useState(null);

    const myItems = useMemo(() => {
        const email = user?.email || "";
        return galleriesApi.items.filter((g) => !g.submittedBy || g.submittedBy === email);
    }, [galleriesApi.items, user]);

    return (
        <div data-testid="osis-gallery">
            <PageHeader title="Galeri Kegiatan" description="Unggah album foto kegiatan untuk ditampilkan di galeri publik." breadcrumbs={["OSIS", "Galeri"]}
                actions={<button onClick={() => { setForm({ title: "", cover: "", date: new Date().toISOString().slice(0, 10), count: 0 }); setCoverFile(null); setEditor(true); }} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Plus className="w-4 h-4" />Album Baru</button>} />
            <button
                onClick={() => { setForm({ title: "", cover: "", date: new Date().toISOString().slice(0, 10), count: 0 }); setCoverFile(null); setEditor(true); }}
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer?.files?.[0];
                    if (!f) return;
                    setCoverFile(f);
                    setEditor(true);
                }}
                type="button"
                className="border-2 border-dashed border-brand-200 rounded-3xl p-10 text-center bg-brand-50/40 mb-8 w-full"
            >
                <Upload className="w-10 h-10 text-brand-700 mx-auto" />
                <div className="font-display font-bold text-brand-950 text-lg mt-3">Seret foto ke sini untuk upload cepat</div>
                <div className="text-sm text-slate-600 mt-1">JPG, PNG, WEBP · Maks 5MB per foto</div>
            </button>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myItems.map((g, i) => (
                    <div key={g.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden card-lift">
                        <div className="aspect-[4/3] overflow-hidden relative"><img src={g.cover} alt={g.title} className="w-full h-full object-cover" /></div>
                        <div className="p-5">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="font-display font-bold text-brand-950">{g.title}</h3>
                                <StatusBadge status={g.status || (i % 3 === 0 ? "pending" : "approved")} />
                            </div>
                            <div className="mt-2 text-xs text-slate-600 inline-flex items-center gap-1"><Images className="w-3 h-3" />{g.count} foto · {g.date}</div>
                        </div>
                    </div>
                ))}
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => { setEditor(false); setCoverFile(null); }}>
                    <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">Album Baru</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{form.title || "Album"}</h3>
                            </div>
                            <button onClick={() => { setEditor(false); setCoverFile(null); }} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <div><label className="text-sm font-semibold text-brand-950">Judul</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div>
                                <label className="text-sm font-semibold text-brand-950">Cover</label>
                                <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 bg-white" />
                                <div className="mt-2 text-xs text-slate-500">Atau isi URL cover (opsional)</div>
                                <input value={form.cover} onChange={e => setForm({ ...form, cover: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" placeholder="https://..." />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Tanggal</label><input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 font-mono" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Jumlah Foto</label><input type="number" value={form.count} onChange={e => setForm({ ...form, count: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            </div>
                        </div>
                        <div className="px-7 py-4 border-t border-slate-100 flex gap-3">
                            <button onClick={() => setEditor(false)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button
                                onClick={async () => {
                                    if (!galleriesApi.hasToken) { toast.error("Silakan login dulu"); return; }
                                    try {
                                        const payload = { title: form.title, cover: form.cover, date: form.date, count: Number(form.count) || 0, status: "pending", submittedBy: user?.email };
                                        const created = coverFile
                                            ? await apiCreateRecordWithFile("galleries", payload, coverFile, "cover")
                                            : await galleriesApi.createItem(payload);
                                        if (coverFile) galleriesApi.setItems((prev) => [created, ...(prev || [])]);
                                        await apiCreateRecord("approvalQueue", { type: "Gallery", title: form.title, submittedBy: user?.email, date: form.date, status: "pending", refType: "galleries", refId: created.id });
                                        toast.success("Album diajukan ke admin");
                                        setEditor(false);
                                        setCoverFile(null);
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
