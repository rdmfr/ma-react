import React, { useMemo, useState } from "react";
import { Plus, Trophy, X } from "lucide-react";
import { PageHeader } from "../../components/shared/Primitives";
import { extracurriculars } from "../../data/mockData";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { apiCreateRecord } from "../../lib/backend";
import { useRecordType } from "../../hooks/useRecordType";

export default function OSISExtra() {
    const { user } = useAuth();
    const extraApi = useRecordType("extracurriculars", extracurriculars);
    const [editor, setEditor] = useState(false);
    const [form, setForm] = useState({ name: "", image: "", description: "", schedule: "", coach: "", slug: "" });

    const myItems = useMemo(() => {
        const email = user?.email || "";
        return extraApi.items.filter((e) => !e.submittedBy || e.submittedBy === email);
    }, [extraApi.items, user]);

    return (
        <div data-testid="osis-extra">
            <PageHeader title="Ekstrakurikuler" description="Ajukan konten ekstrakurikuler beserta galerinya." breadcrumbs={["OSIS", "Ekstrakurikuler"]}
                actions={<button onClick={() => { setForm({ name: "", image: "", description: "", schedule: "", coach: "", slug: "" }); setEditor(true); }} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Plus className="w-4 h-4" />Ajukan Ekskul Baru</button>} />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myItems.slice(0, 12).map(e => (
                    <div key={e.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden card-lift">
                        <div className="aspect-[16/10] overflow-hidden"><img src={e.image} alt={e.name} className="w-full h-full object-cover" /></div>
                        <div className="p-5">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-display font-bold text-brand-950">{e.name}</h3>
                                <Trophy className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                            </div>
                            <div className="text-xs text-slate-600 mt-2">{e.schedule} · {e.coach}</div>
                        </div>
                    </div>
                ))}
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => setEditor(false)}>
                    <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">Ajukan Ekskul</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{form.name || "Ekstrakurikuler"}</h3>
                            </div>
                            <button onClick={() => setEditor(false)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <div><label className="text-sm font-semibold text-brand-950">Nama</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div><label className="text-sm font-semibold text-brand-950">Gambar (URL)</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div><label className="text-sm font-semibold text-brand-950">Deskripsi</label><textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 resize-none" /></div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Jadwal</label><input value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Pembina</label><input value={form.coach} onChange={e => setForm({ ...form, coach: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            </div>
                        </div>
                        <div className="px-7 py-4 border-t border-slate-100 flex gap-3">
                            <button onClick={() => setEditor(false)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button
                                onClick={async () => {
                                    if (!extraApi.hasToken) { toast.error("Silakan login dulu"); return; }
                                    try {
                                        const slug = (form.slug || form.name || "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
                                        const created = await extraApi.createItem({ slug, name: form.name, image: form.image, description: form.description, schedule: form.schedule, coach: form.coach, status: "pending", submittedBy: user?.email });
                                        const today = new Date().toISOString().slice(0, 10);
                                        await apiCreateRecord("approvalQueue", { type: "Ekskul", title: form.name, submittedBy: user?.email, date: today, status: "pending", refType: "extracurriculars", refId: created.id });
                                        toast.success("Ekskul diajukan ke admin");
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
