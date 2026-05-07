import React, { useEffect, useState } from "react";
import { Plus, Newspaper, Images, Megaphone, BookMarked, CalendarRange, MessageSquareQuote, HelpCircle, X, Save, Star, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/shared/Primitives";
import RichEditor from "../../components/dashboard/RichEditor";
import { initPublicData, news, galleries, announcements, studentWorks, events, reflections, faqs, EXTRACURRICULAR_CATEGORIES } from "../../data/mockData";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useRecordType } from "../../hooks/useRecordType";
import { apiCreateRecordWithFile, apiUpdateRecordWithFile } from "../../lib/backend";

const TYPES = [
    { id: "news", label: "Berita", icon: Newspaper, data: news, accent: "bg-brand-50 text-brand-800" },
    { id: "reflection", label: "Refleksi", icon: MessageSquareQuote, data: reflections, accent: "bg-amber-50 text-amber-800" },
    { id: "gallery", label: "Galeri", icon: Images, data: galleries, accent: "bg-blue-50 text-blue-800" },
    { id: "announcement", label: "Pengumuman", icon: Megaphone, data: announcements, accent: "bg-rose-50 text-rose-800" },
    { id: "works", label: "Karya Siswa", icon: BookMarked, data: studentWorks, accent: "bg-emerald-50 text-emerald-800" },
    { id: "events", label: "Agenda", icon: CalendarRange, data: events, accent: "bg-purple-50 text-purple-800" },
    { id: "faq", label: "FAQ", icon: HelpCircle, data: faqs, accent: "bg-slate-50 text-slate-800" },
];

export default function AdminContent() {
    const [active, setActive] = useState(TYPES[0].id);
    const [editor, setEditor] = useState(null); // { mode, item }
    const [form, setForm] = useState({ title: "", category: "Akademik", excerpt: "", content: "", image: "", featured: false, status: "approved" });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const newsStore = useRecordType("news", news);
    const reflectionsStore = useRecordType("reflections", reflections);
    const galleriesStore = useRecordType("galleries", galleries);
    const announcementsStore = useRecordType("announcements", announcements);
    const worksStore = useRecordType("studentWorks", studentWorks);
    const eventsStore = useRecordType("events", events);
    const faqsStore = useRecordType("faqs", faqs);

    const current = TYPES.find(t => t.id === active);
    const storeByActive = {
        news: newsStore,
        reflection: reflectionsStore,
        gallery: galleriesStore,
        announcement: announcementsStore,
        works: worksStore,
        events: eventsStore,
        faq: faqsStore,
    };
    const currentStore = storeByActive[active];

    const defaultCategory = (tab) => {
        if (tab === "gallery") return EXTRACURRICULAR_CATEGORIES[0]?.value || "multimedia";
        return "Akademik";
    };

    const openCreate = () => {
        setForm({ title: "", category: defaultCategory(active), excerpt: "", content: "", image: "", featured: false, status: "approved" });
        setImageFile(null);
        setImagePreview("");
        setEditor({ mode: "create" });
    };
    const openEdit = (it) => {
        setForm({
            title: it.title || it.name || it.q || "",
            category: it.category || defaultCategory(active),
            excerpt: it.excerpt || it.a || "",
            content: it.content || "",
            image: it.image || it.cover || it.photo || "",
            featured: it.is_featured || it.pinned || false,
            status: it.status || "approved",
        });
        setImageFile(null);
        setImagePreview("");
        setEditor({ mode: "edit", item: it });
    };
    const slugify = (s) => (s || "").toString().toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    const getRecordType = () => {
        if (active === "news") return "news";
        if (active === "reflection") return "reflections";
        if (active === "gallery") return "galleries";
        if (active === "announcement") return "announcements";
        if (active === "works") return "studentWorks";
        if (active === "events") return "events";
        if (active === "faq") return "faqs";
        return null;
    };

    const getFileField = () => {
        const recordType = getRecordType();
        if (recordType === "galleries") return "cover";
        if (recordType === "news") return "image";
        if (recordType === "reflections") return "image";
        if (recordType === "studentWorks") return "image";
        return null;
    };

    useEffect(() => {
        if (!imageFile) { setImagePreview(""); return; }
        const url = URL.createObjectURL(imageFile);
        setImagePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFile]);

    const buildPayload = (existing, statusOverride) => {
        const today = new Date().toISOString().slice(0, 10);
        const recordType = getRecordType();
        if (!recordType) return null;
        const status = statusOverride || form.status || existing?.status || "approved";

        if (recordType === "news") {
            return {
                slug: existing?.slug || slugify(form.title),
                title: form.title,
                category: form.category,
                excerpt: form.excerpt,
                content: form.content,
                image: form.image,
                author: existing?.author || "Admin",
                date: existing?.date || today,
                views: existing?.views ?? 0,
                is_featured: !!form.featured,
                status,
            };
        }

        if (recordType === "reflections") {
            return {
                slug: existing?.slug || slugify(form.title),
                title: form.title,
                author: existing?.author || "Admin",
                date: existing?.date || today,
                image: form.image,
                excerpt: form.excerpt,
                content: form.content,
                status,
            };
        }

        if (recordType === "galleries") {
            return {
                title: form.title,
                cover: form.image,
                category: form.category,
                date: existing?.date || today,
                count: existing?.count ?? 0,
                status,
            };
        }

        if (recordType === "announcements") {
            return {
                title: form.title,
                date: existing?.date || today,
                pinned: !!form.featured,
                content: form.excerpt || form.content,
                status,
            };
        }

        if (recordType === "studentWorks") {
            return {
                title: form.title,
                author: existing?.author || "OSIS",
                image: form.image,
                downloads: existing?.downloads ?? 0,
                fileSize: existing?.fileSize || "-",
                category: form.category,
                status,
            };
        }

        if (recordType === "events") {
            return {
                title: form.title,
                date: existing?.date || today,
                time: existing?.time || "08:00",
                location: existing?.location || "Madrasah",
                type: form.category,
                status,
            };
        }

        if (recordType === "faqs") {
            return {
                category: form.category,
                q: form.title,
                a: form.excerpt || form.content,
                status,
            };
        }

        return null;
    };

    const renderCategorySelect = () => {
        if (active === "gallery") {
            return (
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                    {EXTRACURRICULAR_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            );
        }

        return (
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                <option>Akademik</option><option>Prestasi</option><option>Kegiatan</option><option>Pengumuman</option>
            </select>
        );
    };

    const categoryLabel = (value) => EXTRACURRICULAR_CATEGORIES.find((c) => c.value === value)?.label || value;
    const itemMeta = (d) => {
        if (d.date) return format(new Date(d.date), "d MMM yyyy", { locale: idLocale });
        if (d.author) return d.author;
        if (active === "gallery" && d.category) return categoryLabel(d.category);
        return d.category;
    };

    const save = async ({ status } = {}) => {
        const recordType = getRecordType();
        if (!recordType || !currentStore) return;
        if (!currentStore.hasToken) { toast.error("Silakan login dulu"); return; }

        try {
            if (editor.mode === "create") {
                const payload = buildPayload(null, status);
                if (!payload) { toast.error("Data belum lengkap"); return; }
                if (imageFile && getFileField()) {
                    const created = await apiCreateRecordWithFile(recordType, payload, imageFile, getFileField());
                    currentStore.setItems((prev) => [created, ...(prev || [])]);
                } else {
                    await currentStore.createItem(payload);
                }
                initPublicData().catch(() => {});
                toast.success(status === "draft" ? "Disimpan sebagai draft" : `${current.label} baru berhasil dipublish`);
                setEditor(null);
                return;
            }

            const existing = editor.item;
            if (typeof existing?.id !== "string") {
                toast.error("Item ini masih data demo (belum tersinkron ke backend). Buat entri baru untuk menyimpan ke backend.");
                return;
            }

            const payload = buildPayload(existing, status);
            if (!payload) { toast.error("Data belum lengkap"); return; }
            if (imageFile && getFileField()) {
                const updated = await apiUpdateRecordWithFile(existing.id, payload, imageFile, getFileField());
                currentStore.setItems((prev) => (prev || []).map((x) => (x.id === existing.id ? updated : x)));
            } else {
                await currentStore.updateItem(existing.id, payload);
            }
            initPublicData().catch(() => {});
            toast.success(status === "draft" ? "Draft diperbarui" : `${current.label} berhasil diperbarui`);
            setEditor(null);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Gagal menyimpan");
        }
    };
    const onImageFile = (e) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
    };

    return (
        <div data-testid="admin-content">
            <PageHeader title="Manajemen Konten" description="Satu tempat untuk mengelola semua konten publik: berita, galeri, pengumuman, hingga FAQ." breadcrumbs={["Admin", "Konten"]}
                actions={<button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold" data-testid="content-create-btn"><Plus className="w-4 h-4" />Buat {current.label}</button>} />

            <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3 space-y-2">
                    {TYPES.map(t => (
                        <button key={t.id} onClick={() => setActive(t.id)} data-testid={`content-type-${t.id}`}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${active === t.id ? "bg-white border border-brand-200 text-brand-900 shadow-sm" : "text-slate-700 hover:bg-white/60"}`}>
                            <span className={`w-9 h-9 rounded-xl ${t.accent} flex items-center justify-center`}><t.icon className="w-4 h-4" /></span>
                            <span className="flex-1 text-left">{t.label}</span>
                            <span className="text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">{(storeByActive[t.id]?.items || []).length}</span>
                        </button>
                    ))}
                </div>
                <div className="lg:col-span-9">
                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                            <current.icon className="w-5 h-5 text-brand-700" />
                            <h3 className="font-display font-bold text-lg text-brand-950">{current.label}</h3>
                            <span className="text-xs text-slate-500 ml-auto">{(currentStore?.items || []).length} entri</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {(currentStore?.items || []).slice(0, 8).map((d) => (
                                <div key={d.id} className="flex items-center gap-4 p-5 hover:bg-brand-50/30" data-testid={`content-item-${active}-${d.id}`}>
                                    {(d.image || d.cover || d.photo) ? <img src={d.image || d.cover || d.photo} className="w-12 h-12 rounded-xl object-cover" alt="" /> : <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center"><current.icon className="w-4 h-4" /></div>}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-brand-950 truncate">{d.title || d.name || d.q}</div>
                                        <div className="text-xs text-slate-600 mt-0.5">{itemMeta(d)}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openEdit(d)} className="text-xs font-bold text-brand-700 hover:text-brand-900 px-3 py-1.5 rounded-lg hover:bg-brand-50" data-testid={`content-edit-${d.id}`}>Edit</button>
                                        <button
                                            onClick={async () => {
                                                if (!currentStore?.hasToken) { toast.error("Silakan login dulu"); return; }
                                                if (typeof d.id !== "string") {
                                                    toast.error("Item demo tidak bisa dihapus dari backend");
                                                    return;
                                                }
                                                try {
                                                    await currentStore.deleteItem(d.id);
                                                    initPublicData().catch(() => {});
                                                    toast.success("Konten dihapus");
                                                } catch (err) {
                                                    toast.error(err?.response?.data?.message || err.message || "Gagal menghapus");
                                                }
                                            }}
                                            className="text-xs font-bold text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg hover:bg-red-50"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => { setEditor(null); setImageFile(null); setImagePreview(""); }} data-testid="content-editor-modal">
                    <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto thin-scroll" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">{editor.mode === "create" ? "Buat baru" : "Edit"}</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{current.label}</h3>
                            </div>
                            <button onClick={() => { setEditor(null); setImageFile(null); setImagePreview(""); }} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7 space-y-5">
                            <div>
                                <label className="text-sm font-semibold text-brand-950">Judul</label>
                                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Tulis judul yang menarik..." className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="content-form-title" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-brand-950">Kategori</label>
                                    {renderCategorySelect()}
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-brand-950">Atribut</label>
                                    <div className="mt-1.5 flex gap-2">
                                        <button type="button" onClick={() => setForm({...form, featured: !form.featured})} className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${form.featured ? "gradient-brand text-white" : "bg-white border border-slate-200 text-brand-900"}`}>
                                            <Star className={`w-4 h-4 ${form.featured ? "fill-white" : ""}`} /> Unggulan
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-brand-950">Status Publikasi</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                                    <option value="approved">Publish</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-brand-950">Ringkasan / Excerpt</label>
                                <textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={2} placeholder="Ringkasan singkat (1-2 kalimat)..." className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 resize-none" />
                            </div>
                            {!!getFileField() && (
                                <div>
                                    <label className="text-sm font-semibold text-brand-950">Gambar Utama</label>
                                    <div className="mt-1.5 grid grid-cols-[auto,1fr] gap-3 items-start">
                                        <div className="w-32 h-24 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                                            {(imagePreview || form.image) ? <img src={imagePreview || form.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-slate-400" />}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block">
                                                <div className="border border-dashed border-brand-200 rounded-xl px-4 py-2 text-xs text-center font-semibold text-brand-800 cursor-pointer hover:bg-brand-50/40">Upload dari komputer</div>
                                                <input type="file" accept="image/*" className="hidden" onChange={onImageFile} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-semibold text-brand-950">Konten</label>
                                <div className="mt-1.5">
                                    <RichEditor value={form.content} onChange={(v) => setForm({...form, content: v})} placeholder="Tulis isi artikel di sini..." />
                                </div>
                            </div>
                        </div>
                        <div className="px-7 py-4 border-t border-slate-100 flex gap-3 sticky bottom-0 bg-white">
                            <button onClick={() => { setEditor(null); setImageFile(null); setImagePreview(""); }} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button onClick={() => save({ status: "draft" })} className="flex-1 rounded-xl bg-white border-2 border-brand-200 text-brand-800 py-3 text-sm font-bold hover:bg-brand-50">Simpan Draft</button>
                            <button onClick={() => save({ status: "approved" })} className="flex-1 rounded-xl gradient-brand text-white py-3 text-sm font-bold inline-flex items-center justify-center gap-2" data-testid="content-form-publish"><Save className="w-4 h-4" />{editor.mode === "create" ? "Publish" : "Simpan"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
