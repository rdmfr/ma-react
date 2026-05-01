import React, { useState } from "react";
import { Plus, BookOpen, Pencil, Trash2, X } from "lucide-react";
import { PageHeader } from "../../components/shared/Primitives";
import { subjects } from "../../data/mockData";
import { toast } from "sonner";
import { useRecordType } from "../../hooks/useRecordType";

export default function AdminSubjects() {
    const { items, createItem, updateItem, deleteItem, hasToken } = useRecordType("subjects", subjects);
    const [editor, setEditor] = useState(null);
    const [form, setForm] = useState({ name: "", code: "" });

    const openCreate = () => { setForm({ name: "", code: "" }); setEditor({ mode: "create" }); };
    const openEdit = (it) => { setForm({ name: it.name || "", code: it.code || "" }); setEditor({ mode: "edit", item: it }); };

    const save = async () => {
        if (!hasToken) {
            toast.error("Silakan login dulu");
            return;
        }
        try {
            if (editor.mode === "create") {
                await createItem({ name: form.name, code: form.code });
                toast.success("Mapel berhasil dibuat");
                setEditor(null);
                return;
            }
            const it = editor.item;
            if (typeof it?.id !== "string") {
                toast.error("Item demo tidak bisa diubah. Buat entri baru untuk menyimpan ke backend.");
                return;
            }
            await updateItem(it.id, { name: form.name, code: form.code });
            toast.success("Mapel berhasil diperbarui");
            setEditor(null);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Gagal menyimpan");
        }
    };

    return (
        <div data-testid="admin-subjects">
            <PageHeader title="Mata Pelajaran" description="Kelola daftar mata pelajaran." breadcrumbs={["Admin", "Mapel"]}
                actions={<button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Plus className="w-4 h-4" />Tambah Mapel</button>} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(s => (
                    <div key={s.id} className="bg-white rounded-2xl border border-slate-100 p-5 card-lift" data-testid={`subject-${s.id}`}>
                        <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-xl gradient-brand text-white flex items-center justify-center"><BookOpen className="w-4 h-4" /></div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => openEdit(s)} className="w-8 h-8 rounded-lg hover:bg-brand-50 text-brand-700 flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button>
                                <button
                                    onClick={async () => {
                                        if (!hasToken) { toast.error("Silakan login dulu"); return; }
                                        if (typeof s.id !== "string") { toast.error("Item demo tidak bisa dihapus"); return; }
                                        try { await deleteItem(s.id); toast.success("Mapel dihapus"); } catch (err) { toast.error(err?.response?.data?.message || err.message || "Gagal menghapus"); }
                                    }}
                                    className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        <div className="font-display font-bold text-brand-950 mt-4">{s.name}</div>
                        <div className="text-xs text-slate-500 mt-1 font-mono">{s.code}</div>
                    </div>
                ))}
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => setEditor(null)}>
                    <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">{editor.mode === "create" ? "Tambah Mapel" : "Edit Mapel"}</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{form.name || "Mata Pelajaran"}</h3>
                            </div>
                            <button onClick={() => setEditor(null)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <div><label className="text-sm font-semibold text-brand-950">Nama</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div><label className="text-sm font-semibold text-brand-950">Kode</label><input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 font-mono" /></div>
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
