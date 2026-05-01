import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth, DEMO_CREDENTIALS } from "../../context/AuthContext";
import { useBranding } from "../../context/BrandingContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const { branding } = useBranding();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const u = await login(email, password);
            toast.success(`Selamat datang, ${u.name}!`);
            navigate(`/${u.role}`);
        } catch (err) {
            setError(err.message || "Gagal masuk");
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (c) => { setEmail(c.email); setPassword(c.password); };

    return (
        <div className="min-h-screen flex bg-[#fbfcf9]" data-testid="login-page">
            {/* LEFT — Brand panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 text-white">
                <div className="absolute inset-0 noise-overlay opacity-30" />
                <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-brand-400/20 blur-3xl" />
                <div className="absolute -bottom-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-emerald-300/15 blur-3xl" />
                <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
                    <Link to="/" className="inline-flex items-center gap-3 w-fit">
                        <div className="w-12 h-12 rounded-xl bg-white p-2"><img src={branding.logoUrl} alt={branding.schoolName} className="w-full h-full object-contain" /></div>
                        <div>
                            <div className="font-display font-extrabold text-xl">{branding.schoolName}</div>
                            <div className="text-[11px] text-brand-300 uppercase tracking-wider">{branding.schoolTagline}</div>
                        </div>
                    </Link>
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-3 py-1 text-xs font-semibold">
                            <Sparkles className="w-3 h-3 text-brand-300" /> Sistem Akademik Terpadu
                        </div>
                        <h1 className="font-display text-5xl xl:text-6xl font-black mt-6 leading-[0.95] tracking-tight">
                            Selamat datang kembali,<br />
                            <span className="font-editorial italic font-semibold text-brand-300">keluarga besar.</span>
                        </h1>
                        <p className="mt-5 text-brand-100/85 max-w-md leading-relaxed">
                            Masuk untuk mengelola akademik, konten, dan administrasi {branding.schoolName}. Satu portal untuk admin, guru, dan OSIS.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="glass-dark rounded-2xl p-4">
                            <ShieldCheck className="w-5 h-5 text-brand-300" />
                            <div className="text-sm font-bold mt-3">Aman</div>
                            <div className="text-xs text-brand-300">Enkripsi end-to-end</div>
                        </div>
                        <div className="glass-dark rounded-2xl p-4">
                            <div className="font-display font-black text-3xl">842+</div>
                            <div className="text-xs text-brand-300 mt-1">Siswa aktif</div>
                        </div>
                        <div className="glass-dark rounded-2xl p-4">
                            <div className="font-display font-black text-3xl">A</div>
                            <div className="text-xs text-brand-300 mt-1">Akreditasi</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT — Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-brand-100/70 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-brand-50 blur-3xl" />
                <div className="w-full max-w-md relative">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 rounded-xl bg-white border border-brand-100 p-2"><img src={branding.logoUrl} alt={branding.schoolName} className="w-full h-full object-contain" /></div>
                        <div>
                            <div className="font-display font-extrabold text-brand-950">{branding.schoolName}</div>
                            <div className="text-xs text-brand-700">{branding.schoolTagline}</div>
                        </div>
                    </div>
                    <h2 className="font-display text-4xl font-extrabold text-brand-950 tracking-tight">Masuk</h2>
                    <p className="text-slate-600 mt-2">Silakan masuk untuk melanjutkan ke dashboard.</p>

                    {error && (
                        <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="mt-7 space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-brand-950 mb-2">Email</label>
                            <input data-testid="login-email-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@mapulosari.sch.id"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-brand-950">Kata Sandi</label>
                                <Link to="/forgot-password" className="text-xs font-semibold text-brand-700 hover:text-brand-900">Lupa kata sandi?</Link>
                            </div>
                            <div className="relative">
                                <input data-testid="login-password-input" type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition" />
                                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-700" data-testid="login-toggle-password">
                                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <label className="flex items-center gap-2 text-sm text-slate-700 select-none">
                            <input type="checkbox" className="rounded border-slate-300 text-brand-700 focus:ring-brand-500" />
                            Ingatkan saya
                        </label>

                        <button type="submit" disabled={loading} data-testid="login-submit-btn"
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white py-3.5 font-bold shadow-lg shadow-brand-900/20 disabled:opacity-60 transition">
                            {loading ? "Memproses..." : <>Masuk <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <div className="mt-8 rounded-2xl bg-brand-50/60 border border-brand-100 p-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-3">Demo Akun</div>
                        <div className="space-y-1.5">
                            {DEMO_CREDENTIALS.map((c) => (
                                <button key={c.email} type="button" onClick={() => fillDemo(c)} data-testid={`demo-btn-${c.role.toLowerCase()}`}
                                    className="w-full flex items-center justify-between text-left rounded-lg hover:bg-white px-3 py-2 transition">
                                    <div>
                                        <span className="text-xs font-bold text-brand-950">{c.role}</span>
                                        <div className="text-[11px] text-slate-600">{c.email}</div>
                                    </div>
                                    <span className="text-[10px] text-brand-700 font-semibold">Klik untuk isi →</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm text-slate-600">
                        Kembali ke <Link to="/" className="font-bold text-brand-700 hover:text-brand-900">Beranda</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
