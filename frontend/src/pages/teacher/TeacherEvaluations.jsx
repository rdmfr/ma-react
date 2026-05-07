import React, { useState } from "react";
import { Plus, Calendar, Trash2, X } from "lucide-react";
import { PageHeader } from "../../components/shared/Primitives";
import { evaluations } from "../../data/mockData";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import { useRecordType } from "../../hooks/useRecordType";

export default function TeacherEvaluations() {
    const evalApi = useRecordType("evaluations", evaluations);
    const [editor, setEditor] = useState(null);
    const [form, setForm] = useState({ title: "", subject: "", class: "", date: "", type: "Ulangan" });

    return (
        <div data-testid="teacher-evaluations">
            <PageHeader title="Jadwal Evaluasi" description="Jadwal ujian dan ulangan untuk mata pelajaran Anda." breadcrumbs={["Guru", "Evaluasi"]}
                actions={<button onClick={() => { setForm({ title: "", subject: "", class: "", date: new Date().toISOString().slice(0, 10), type: "Ulangan" }); setEditor({ mode: "create" }); }} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Plus className="w-4 h-4" />Jadwal Baru</button>} />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {evalApi.items.map(e => (
                    <button key={e.id} onClick={() => { setForm({ title: e.title || "", subject: e.subject || "", class: e.class || "", date: e.date || new Date().toISOString().slice(0, 10), type: e.type || "Ulangan" }); setEditor({ mode: "edit", item: e }); }} className="bg-white rounded-2xl border border-slate-100 p-6 card-lift text-left">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 rounded-full px-2.5 py-1">{e.type}</span>
                            <Calendar className="w-4 h-4 text-brand-600" />
                        </div>
                        <div className="font-display font-extrabold text-lg text-brand-950 mt-4 leading-tight">{e.title}</div>
                        <div className="mt-3 text-xs text-slate-600">{e.subject} · {e.class}</div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-sm font-semibold text-brand-800">{format(new Date(e.date), "EEEE, d MMMM yyyy", { locale: idLocale })}</div>
                    </button>
                ))}
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => setEditor(null)}>
                    <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">{editor.mode === "create" ? "Jadwal Baru" : "Edit Jadwal"}</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{form.title || "Evaluasi"}</h3>
                            </div>
                            <button onClick={() => setEditor(null)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <div><label className="text-sm font-semibold text-brand-950">Judul</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Mapel</label><input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Kelas</label><input value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Tanggal</label><input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 font-mono" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Tipe</label>
                                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                                        <option value="Ulangan">Ulangan</option>
                                        <option value="Ujian">Ujian</option>
                                        <option value="Praktik">Praktik</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="px-7 py-4 border-t border-slate-100 flex gap-3">
                            {editor.mode === "edit" && (
                                <button
                                    onClick={async () => {
                                        if (!evalApi.hasToken) { toast.error("Silakan login dulu"); return; }
                                        const it = editor.item;
                                        if (typeof it?.id !== "string") { toast.error("Item demo tidak bisa dihapus"); return; }
                                        try { await evalApi.deleteItem(it.id); toast.success("Jadwal dihapus"); setEditor(null); } catch (err) { toast.error(err?.response?.data?.message || err.message || "Gagal menghapus"); }
                                    }}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 text-red-700 px-5 py-3 text-sm font-bold"
                                >
                                    <Trash2 className="w-4 h-4" />Hapus
                                </button>
                            )}
                            <button onClick={() => setEditor(null)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button
                                onClick={async () => {
                                    if (!evalApi.hasToken) { toast.error("Silakan login dulu"); return; }
                                    try {
                                        const payload = { title: form.title, subject: form.subject, class: form.class, date: form.date, type: form.type };
                                        if (editor.mode === "create") await evalApi.createItem(payload);
                                        else {
                                            const it = editor.item;
                                            if (typeof it?.id !== "string") { toast.error("Item demo tidak bisa diubah. Buat entri baru untuk menyimpan ke backend."); return; }
                                            await evalApi.updateItem(it.id, payload);
                                        }
                                        toast.success("Jadwal disimpan");
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
