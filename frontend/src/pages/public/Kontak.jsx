import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Youtube } from "lucide-react";
import { toast } from "sonner";
import { useBranding } from "../../context/BrandingContext";
import { apiPublicContact } from "../../lib/backend";

export default function Kontak() {
    const { branding } = useBranding();
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const submit = async (e) => {
        e.preventDefault();
        try {
            await apiPublicContact(form);
            toast.success("Pesan Anda telah terkirim!");
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Gagal mengirim pesan");
        }
    };
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="kontak-page">
            <div className="max-w-3xl">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Hubungi Kami</div>
                <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Jangan ragu untuk <span className="font-editorial italic text-brand-700">menyapa</span>.</h1>
            </div>
            <div className="mt-12 grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-5">
                    <div className="bg-brand-950 text-white rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-500/20 blur-3xl" />
                        <h3 className="font-display font-extrabold text-2xl relative">Informasi Kontak</h3>
                        <div className="mt-6 space-y-5 relative">
                            <div className="flex gap-3"><MapPin className="w-5 h-5 text-brand-300 shrink-0 mt-0.5" /><div><div className="text-xs uppercase tracking-wider text-brand-300">Alamat</div><div className="mt-1">{branding.address}</div></div></div>
                            <div className="flex gap-3"><Mail className="w-5 h-5 text-brand-300 shrink-0 mt-0.5" /><div><div className="text-xs uppercase tracking-wider text-brand-300">Email</div><div className="mt-1">{branding.email}</div></div></div>
                            <div className="flex gap-3"><Phone className="w-5 h-5 text-brand-300 shrink-0 mt-0.5" /><div><div className="text-xs uppercase tracking-wider text-brand-300">Telepon</div><div className="mt-1">{branding.phone}</div></div></div>
                        </div>
                        <div className="mt-8 pt-5 border-t border-brand-800 flex gap-2 relative">
                            <a href="#" className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-brand-500/30"><Instagram className="w-4 h-4" /></a>
                            <a href="#" className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-brand-500/30"><Facebook className="w-4 h-4" /></a>
                            <a href="#" className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-brand-500/30"><Youtube className="w-4 h-4" /></a>
                        </div>
                    </div>
                    <div className="rounded-3xl overflow-hidden h-64 bg-brand-100">
                        <iframe title="map" src={branding.mapEmbed} className="w-full h-full border-0" loading="lazy" />
                    </div>
                </div>
                <div className="lg:col-span-7">
                    <form onSubmit={submit} className="bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
                        <h3 className="font-display font-extrabold text-2xl text-brand-950">Kirim Pesan</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className="text-sm font-semibold text-brand-950">Nama</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="kontak-name" /></div>
                            <div><label className="text-sm font-semibold text-brand-950">Email</label><input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="kontak-email" /></div>
                        </div>
                        <div><label className="text-sm font-semibold text-brand-950">Subjek</label><input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="kontak-subject" /></div>
                        <div><label className="text-sm font-semibold text-brand-950">Pesan</label><textarea required rows={6} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 resize-none" data-testid="kontak-message" /></div>
                        <button type="submit" data-testid="kontak-submit" className="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-6 py-3.5 font-bold shadow-lg shadow-brand-900/20">
                            <Send className="w-4 h-4" /> Kirim Pesan
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
