import React, { useState } from "react";
import { Upload, RefreshCw, Palette, Save, Image as ImageIcon, Building2, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/shared/Primitives";
import { useBranding } from "../../context/BrandingContext";

export default function AdminSettings() {
    const { branding, updateBranding, resetBranding } = useBranding();
    const [form, setForm] = useState(branding);
    const [tab, setTab] = useState("branding");

    const save = () => { updateBranding(form); toast.success("Pengaturan tersimpan. Perubahan aktif di seluruh aplikasi."); };
    const onLogoFile = (e) => {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setForm(f => ({ ...f, logoUrl: reader.result }));
        reader.readAsDataURL(file);
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
                    <button onClick={save} className="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-2.5 text-sm font-bold shadow-lg shadow-brand-900/20" data-testid="settings-save"><Save className="w-4 h-4" />Simpan</button>
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
                                <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 p-1"><img src={form.logoUrl} alt="" className="w-full h-full object-contain" /></div>
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
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-100 p-8">
                                <h3 className="font-display font-bold text-xl text-brand-950 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-brand-700" />Logo Sekolah</h3>
                                <p className="text-sm text-slate-600 mt-1">Rasio persegi. PNG transparan direkomendasikan. Maks 2MB.</p>
                                <div className="mt-6 grid sm:grid-cols-[auto,1fr] gap-6 items-start">
                                    <div className="w-40 h-40 rounded-2xl border border-brand-100 bg-brand-50/50 p-4 flex items-center justify-center"><img src={form.logoUrl} alt="logo preview" className="max-w-full max-h-full object-contain" data-testid="settings-logo-preview" /></div>
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
