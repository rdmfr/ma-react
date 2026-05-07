import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useBranding } from "../../context/BrandingContext";

export default function ResetPassword() {
    const [p1, setP1] = useState("");
    const [p2, setP2] = useState("");
    const [done, setDone] = useState(false);
    const { branding } = useBranding();
    const nav = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        if (p1 !== p2) { toast.error("Kata sandi tidak cocok"); return; }
        if (p1.length < 6) { toast.error("Minimal 6 karakter"); return; }
        setDone(true);
        toast.success("Kata sandi berhasil diperbarui");
        setTimeout(() => nav("/login"), 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fbfcf9] p-6 relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-brand-100/70 blur-3xl" />
            <div className="w-full max-w-md relative">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 mb-8"><ArrowLeft className="w-4 h-4" /> Kembali</Link>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-white border border-brand-100 p-2"><img src={branding.logoUrl} alt={branding.schoolName} className="w-full h-full object-contain" /></div>
                    <div className="font-display font-extrabold text-brand-950">{branding.schoolName}</div>
                </div>
                {done ? (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-brand-100 text-brand-700 flex items-center justify-center"><CheckCircle2 className="w-8 h-8" /></div>
                        <h1 className="font-display text-3xl font-extrabold text-brand-950 mt-6">Berhasil!</h1>
                        <p className="text-slate-600 mt-2">Mengalihkan ke halaman masuk...</p>
                    </div>
                ) : (
                    <>
                        <h1 className="font-display text-3xl font-extrabold text-brand-950">Atur Ulang Kata Sandi</h1>
                        <p className="text-slate-600 mt-2 text-sm">Buat kata sandi baru yang aman dan mudah diingat.</p>
                        <form onSubmit={onSubmit} className="mt-7 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-brand-950 mb-2">Kata Sandi Baru</label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input required type="password" value={p1} onChange={(e) => setP1(e.target.value)} data-testid="reset-p1" placeholder="••••••••"
                                        className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-brand-950 mb-2">Ulangi Kata Sandi</label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input required type="password" value={p2} onChange={(e) => setP2(e.target.value)} data-testid="reset-p2" placeholder="••••••••"
                                        className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none" />
                                </div>
                            </div>
                            <button type="submit" data-testid="reset-submit" className="w-full rounded-xl gradient-brand gradient-brand-hover text-white py-3.5 font-bold shadow-lg shadow-brand-900/20">Perbarui Kata Sandi</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
