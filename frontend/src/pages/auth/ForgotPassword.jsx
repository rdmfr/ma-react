import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useBranding } from "../../context/BrandingContext";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const { branding } = useBranding();

    const onSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        toast.success("Tautan reset telah dikirim ke email Anda");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fbfcf9] p-6 relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-brand-100/70 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] rounded-full bg-brand-50 blur-3xl" />
            <div className="w-full max-w-md relative">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900 mb-8">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke login
                </Link>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-white border border-brand-100 p-2"><img src={branding.logoUrl} alt={branding.schoolName} className="w-full h-full object-contain" /></div>
                    <div>
                        <div className="font-display font-extrabold text-brand-950">{branding.schoolName}</div>
                    </div>
                </div>
                {!sent ? (
                    <>
                        <h1 className="font-display text-3xl font-extrabold text-brand-950">Lupa kata sandi?</h1>
                        <p className="text-slate-600 mt-2 text-sm">Masukkan email Anda dan kami akan mengirim tautan untuk reset password.</p>
                        <form onSubmit={onSubmit} className="mt-7 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-brand-950 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="forgot-email-input"
                                        placeholder="nama@mapulosari.sch.id" className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none" />
                                </div>
                            </div>
                            <button type="submit" data-testid="forgot-submit-btn" className="w-full rounded-xl gradient-brand gradient-brand-hover text-white py-3.5 font-bold shadow-lg shadow-brand-900/20">Kirim Tautan Reset</button>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-brand-100 text-brand-700 flex items-center justify-center"><CheckCircle2 className="w-8 h-8" /></div>
                        <h1 className="font-display text-3xl font-extrabold text-brand-950 mt-6">Cek Email Anda</h1>
                        <p className="text-slate-600 mt-2">Kami telah mengirim tautan reset ke <span className="font-semibold text-brand-900">{email}</span>. Tautan berlaku 60 menit.</p>
                        <Link to="/login" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-5 py-3 font-bold text-brand-900">Kembali ke login</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
