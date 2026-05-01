import React, { useState } from "react";
import { Plus, Star, Pencil, Trash2, X } from "lucide-react";
import { PageHeader } from "../../components/shared/Primitives";
import { teachers } from "../../data/mockData";
import { toast } from "sonner";
import { useRecordType } from "../../hooks/useRecordType";

export default function AdminTeachers() {
    const { items, createItem, updateItem, deleteItem, hasToken } = useRecordType("teachers", teachers);
    const [editor, setEditor] = useState(null);
    const [form, setForm] = useState({ name: "", subject: "", photo: "", bio: "", education: "", contact: "", slug: "", is_featured: false });

    const slugify = (s) => (s || "").toString().toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    const openCreate = () => {
        setForm({ name: "", subject: "", photo: "", bio: "", education: "", contact: "", slug: "", is_featured: false });
        setEditor({ mode: "create" });
    };
    const openEdit = (t) => {
        setForm({
            name: t.name || "",
            subject: t.subject || "",
            photo: t.photo || "",
            bio: t.bio || "",
            education: t.education || "",
            contact: t.contact || "",
            slug: t.slug || "",
            is_featured: !!t.is_featured,
        });
        setEditor({ mode: "edit", item: t });
    };

    const save = async () => {
        if (!hasToken) { toast.error("Silakan login dulu"); return; }
        try {
            const payload = {
                name: form.name,
                subject: form.subject,
                photo: form.photo,
                bio: form.bio,
                education: form.education,
                contact: form.contact,
                slug: form.slug || slugify(form.name),
                is_featured: !!form.is_featured,
            };

            if (editor.mode === "create") {
                await createItem(payload);
                toast.success("Profil guru dibuat");
                setEditor(null);
                return;
            }

            const it = editor.item;
            if (typeof it?.id !== "string") { toast.error("Item demo tidak bisa diubah. Buat entri baru untuk menyimpan ke backend."); return; }
            await updateItem(it.id, payload);
            toast.success("Profil guru diperbarui");
            setEditor(null);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Gagal menyimpan");
        }
    };

    return (
        <div data-testid="admin-teachers">
            <PageHeader title="Manajemen Guru" description="Kelola profil guru yang tampil di website publik." breadcrumbs={["Admin", "Guru"]}
                actions={<button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-2.5 text-sm font-bold shadow-lg shadow-brand-900/20" data-testid="teachers-add"><Plus className="w-4 h-4" />Tambah Guru</button>} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {items.map(t => (
                    <div key={t.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden card-lift" data-testid={`teacher-card-${t.id}`}>
                        <div className="aspect-square relative"><img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                            {t.is_featured && <span className="absolute top-2 right-2 bg-white/95 backdrop-blur rounded-full px-2 py-1 text-[10px] font-bold text-amber-700 inline-flex items-center gap-1"><Star className="w-3 h-3 fill-amber-500 text-amber-500" />Unggulan</span>}
                        </div>
                        <div className="p-4">
                            <div className="text-[10px] uppercase tracking-wider text-brand-600 font-bold">{t.subject}</div>
                            <div className="font-display font-bold text-brand-950 mt-1">{t.name}</div>
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => openEdit(t)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-bold text-brand-800 hover:bg-slate-50"><Pencil className="w-3 h-3" />Edit</button>
                                <button
                                    onClick={async () => {
                                        if (!hasToken) { toast.error("Silakan login dulu"); return; }
                                        if (typeof t.id !== "string") { toast.error("Item demo tidak bisa dihapus"); return; }
                                        try { await deleteItem(t.id); toast.success("Profil guru dihapus"); } catch (err) { toast.error(err?.response?.data?.message || err.message || "Gagal menghapus"); }
                                    }}
                                    className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => setEditor(null)}>
                    <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto thin-scroll" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">{editor.mode === "create" ? "Tambah Guru" : "Edit Guru"}</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{form.name || "Profil Guru"}</h3>
                            </div>
                            <button onClick={() => setEditor(null)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Nama</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Mapel</label><input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            </div>
                            <div><label className="text-sm font-semibold text-brand-950">Foto URL</label><input value={form.photo} onChange={e => setForm({ ...form, photo: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div><label className="text-sm font-semibold text-brand-950">Bio</label><textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 resize-none" /></div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Pendidikan</label><input value={form.education} onChange={e => setForm({ ...form, education: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Kontak</label><input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Slug (opsional)</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 font-mono" /></div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-brand-950 select-none">
                                        <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded border-slate-300 text-brand-700 focus:ring-brand-500" />
                                        Unggulan
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="px-7 py-4 border-t border-slate-100 flex gap-3 sticky bottom-0 bg-white">
                            <button onClick={() => setEditor(null)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button onClick={save} className="flex-1 rounded-xl gradient-brand text-white py-3 text-sm font-bold">Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
