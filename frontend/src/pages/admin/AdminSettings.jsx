import React, { useEffect, useMemo, useState } from "react";
import { Upload, RefreshCw, Palette, Save, Image as ImageIcon, Building2, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/shared/Primitives";
import { useBranding } from "../../context/BrandingContext";
import { apiCreateRecord, apiListRecords, apiUpdateRecord, apiUpdateRecordWithFile } from "../../lib/backend";

export default function AdminSettings() {
    const { branding, updateBranding, resetBranding } = useBranding();
    const [form, setForm] = useState(branding);
    const [tab, setTab] = useState("branding");
    const [saving, setSaving] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [heroFile, setHeroFile] = useState(null);
    const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
    const [heroPreviewUrl, setHeroPreviewUrl] = useState("");

    useEffect(() => {
        return () => {
            if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
            if (heroPreviewUrl) URL.revokeObjectURL(heroPreviewUrl);
        };
    }, [logoPreviewUrl, heroPreviewUrl]);

    const previewLogoSrc = useMemo(() => logoPreviewUrl || form.logoUrl, [logoPreviewUrl, form.logoUrl]);
    const previewHeroSrc = useMemo(() => heroPreviewUrl || form.heroImageUrl, [heroPreviewUrl, form.heroImageUrl]);

    const save = async () => {
        if (saving) return;
        setSaving(true);
        try {
            const existing = await apiListRecords("branding", 1);
            const first = Array.isArray(existing) ? existing[0] : null;
            const baseData = { ...form };
            if (logoFile) delete baseData.logoUrl;
            if (heroFile) delete baseData.heroImageUrl;

            let current;
            if (first?.id) {
                current = await apiUpdateRecord(first.id, baseData);
            } else {
                current = await apiCreateRecord("branding", baseData);
            }

            if (logoFile) {
                const { id, ...data } = current || {};
                current = await apiUpdateRecordWithFile(id, data, logoFile, "logoUrl");
            }
            if (heroFile) {
                const { id, ...data } = current || {};
                current = await apiUpdateRecordWithFile(id, data, heroFile, "heroImageUrl");
            }

            if (current) {
                const { id, ...data } = current;
                updateBranding(data);
                setForm(data);
            } else {
                updateBranding(form);
            }
            setLogoFile(null);
            setHeroFile(null);
            if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
            if (heroPreviewUrl) URL.revokeObjectURL(heroPreviewUrl);
            setLogoPreviewUrl("");
            setHeroPreviewUrl("");
            toast.success("Pengaturan tersimpan. Perubahan akan tampil di halaman publik.");
        } catch (e) {
            toast.error("Gagal menyimpan pengaturan. Coba lagi.");
        } finally {
            setSaving(false);
        }
    };
    const onLogoFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Logo maksimal 2MB");
            e.target.value = "";
            return;
        }
        setLogoFile(file);
        if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
        setLogoPreviewUrl(URL.createObjectURL(file));
    };

    const onHeroFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) {
            toast.error("Gambar hero maksimal 3MB");
            e.target.value = "";
            return;
        }
        setHeroFile(file);
        if (heroPreviewUrl) URL.revokeObjectURL(heroPreviewUrl);
        setHeroPreviewUrl(URL.createObjectURL(file));
    };
    const doReset = () => { resetBranding(); setForm({ ...branding }); toast.success("Pengaturan dikembalikan ke default"); setTimeout(() => window.location.reload(), 400); };

    const TABS = [
        { id: "branding", label: "Branding", icon: Palette },
        { id: "kontak", label: "Kontak & Alamat", icon: MapPin },
        { id: "sosmed", label: "Media Sosial", icon: ImageIcon },
    ];

    return (
        <div data-testid="admin-settings">
            <PageHeader title="Pengaturan & Branding" description="Ubah identitas sekolah — logo, nama, dan kontak — yang akan aktif di login page hingga dashboard public." breadcrumbs={["Admin", "Pengaturan"]} actions={
                <>
                    <button onClick={doReset} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-900 hover:bg-slate-50" data-testid="settings-reset"><RefreshCw className="w-4 h-4" />Reset</button>
                    <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-2.5 text-sm font-bold shadow-lg shadow-brand-900/20 disabled:opacity-60 disabled:cursor-not-allowed" data-testid="settings-save"><Save className="w-4 h-4" />{saving ? "Menyimpan..." : "Simpan"}</button>
                </>
            } />

            <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl border border-slate-100 p-2">
                        {TABS.map(t => (
                            <button key={t.id} onClick={() => setTab(t.id)} data-testid={`settings-tab-${t.id}`}
                                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-semibold text-sm transition ${tab === t.id ? "bg-brand-50 text-brand-900" : "text-slate-700 hover:bg-slate-50"}`}>
                                <t.icon className="w-4 h-4" />{t.label}
                            </button>
                        ))}
                    </div>
                    <div className="mt-5 rounded-2xl bg-brand-50/60 border border-brand-100 p-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-brand-700">Live Preview</div>
                        <div className="mt-3 bg-white rounded-xl p-4 border border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 p-1"><img src={previewLogoSrc} alt="" className="w-full h-full object-contain" /></div>
                                <div className="leading-tight">
                                    <div className="font-display font-extrabold text-brand-950 text-sm">{form.schoolName}</div>
                                    <div className="text-[9px] text-brand-700">{form.schoolTagline}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-9 space-y-6">
                    {tab === "branding" && (
                        <>
                            <div className="bg-white rounded-3xl border border-slate-100 p-8">
                                <h3 className="font-display font-bold text-xl text-brand-950 flex items-center gap-2"><Building2 className="w-5 h-5 text-brand-700" />Identitas Sekolah</h3>
                                <p className="text-sm text-slate-600 mt-1">Nama dan tagline ini muncul di navbar, footer, login page, dan seluruh dashboard.</p>
                                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-brand-950">Nama Sekolah</label>
                                        <input value={form.schoolName} onChange={e => setForm({...form, schoolName: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="settings-school-name" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-brand-950">Singkatan / Kode</label>
                                        <input value={form.schoolShort} onChange={e => setForm({...form, schoolShort: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="settings-school-short" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-sm font-semibold text-brand-950">Tagline</label>
                                        <input value={form.schoolTagline} onChange={e => setForm({...form, schoolTagline: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="settings-school-tagline" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-brand-950">Akreditasi</label>
                                        <input value={form.accreditationLabel || ""} onChange={e => setForm({ ...form, accreditationLabel: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" placeholder="B" data-testid="settings-accreditation" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-100 p-8">
                                <h3 className="font-display font-bold text-xl text-brand-950 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-brand-700" />Logo Sekolah</h3>
                                <p className="text-sm text-slate-600 mt-1">Rasio persegi. PNG transparan direkomendasikan. Maks 2MB.</p>
                                <div className="mt-6 grid sm:grid-cols-[auto,1fr] gap-6 items-start">
                                    <div className="w-40 h-40 rounded-2xl border border-brand-100 bg-brand-50/50 p-4 flex items-center justify-center"><img src={previewLogoSrc} alt="logo preview" className="max-w-full max-h-full object-contain" data-testid="settings-logo-preview" /></div>
                                    <div className="space-y-3">
                                        <label className="block">
                                            <div className="text-sm font-semibold text-brand-950 mb-1.5">URL Logo</div>
                                            <input value={form.logoUrl} onChange={e => setForm({...form, logoUrl: e.target.value})} placeholder="https://..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="settings-logo-url" />
                                        </label>
                                        <div className="text-xs text-slate-500 text-center relative">
                                            <span className="bg-white px-3">atau</span>
                                            <span className="absolute inset-x-0 top-1/2 -z-10 h-px bg-slate-200" />
                                        </div>
                                        <label className="block cursor-pointer">
                                            <div className="border-2 border-dashed border-brand-200 rounded-xl p-6 text-center hover:bg-brand-50/40 transition">
                                                <Upload className="w-5 h-5 text-brand-700 mx-auto" />
                                                <div className="text-sm font-semibold text-brand-900 mt-2">Upload dari komputer</div>
                                                <div className="text-xs text-slate-500">PNG/JPG · Maks 2MB</div>
                                            </div>
                                            <input type="file" accept="image/*" className="hidden" onChange={onLogoFile} data-testid="settings-logo-file" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-100 p-8">
                                <h3 className="font-display font-bold text-xl text-brand-950 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-brand-700" />Gambar Utama (Hero)</h3>
                                <p className="text-sm text-slate-600 mt-1">Gambar ini tampil di bagian utama halaman Home publik. JPG/PNG · Maks 3MB.</p>
                                <div className="mt-6 grid sm:grid-cols-[auto,1fr] gap-6 items-start">
                                    <div className="w-40 h-40 rounded-2xl border border-brand-100 bg-brand-50/50 p-2 overflow-hidden">
                                        <img src={previewHeroSrc} alt={form.heroImageAlt || "hero"} className="w-full h-full object-cover rounded-xl" data-testid="settings-hero-preview" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block">
                                            <div className="text-sm font-semibold text-brand-950 mb-1.5">URL Gambar Hero</div>
                                            <input value={form.heroImageUrl || ""} onChange={e => setForm({ ...form, heroImageUrl: e.target.value })} placeholder="https://..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="settings-hero-url" />
                                        </label>
                                        <label className="block">
                                            <div className="text-sm font-semibold text-brand-950 mb-1.5">Alt Text</div>
                                            <input value={form.heroImageAlt || ""} onChange={e => setForm({ ...form, heroImageAlt: e.target.value })} placeholder="Kegiatan siswa" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="settings-hero-alt" />
                                        </label>
                                        <div className="text-xs text-slate-500 text-center relative">
                                            <span className="bg-white px-3">atau</span>
                                            <span className="absolute inset-x-0 top-1/2 -z-10 h-px bg-slate-200" />
                                        </div>
                                        <label className="block cursor-pointer">
                                            <div className="border-2 border-dashed border-brand-200 rounded-xl p-6 text-center hover:bg-brand-50/40 transition">
                                                <Upload className="w-5 h-5 text-brand-700 mx-auto" />
                                                <div className="text-sm font-semibold text-brand-900 mt-2">Upload gambar hero</div>
                                                <div className="text-xs text-slate-500">JPG/PNG · Maks 3MB</div>
                                            </div>
                                            <input type="file" accept="image/*" className="hidden" onChange={onHeroFile} data-testid="settings-hero-file" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {tab === "kontak" && (
                        <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
                            <h3 className="font-display font-bold text-xl text-brand-950">Kontak & Alamat</h3>
                            <div><label className="text-sm font-semibold text-brand-950">Alamat</label><input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="settings-address" /></div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Email</label><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="settings-email" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Telepon</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="settings-phone" /></div>
                            </div>
                            <div><label className="text-sm font-semibold text-brand-950">URL Embed Peta</label><input value={form.mapEmbed} onChange={e => setForm({...form, mapEmbed: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="settings-map" /></div>
                        </div>
                    )}

                    {tab === "sosmed" && (
                        <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
                            <h3 className="font-display font-bold text-xl text-brand-950">Media Sosial</h3>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Instagram</label><input value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Facebook</label><input value={form.facebook} onChange={e => setForm({...form, facebook: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">YouTube</label><input value={form.youtube} onChange={e => setForm({...form, youtube: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
