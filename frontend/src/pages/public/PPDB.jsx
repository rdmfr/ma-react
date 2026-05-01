import React, { useState } from "react";
import { Check, FileText, Upload, Sparkles, ArrowLeft, ArrowRight, User, Users, GraduationCap, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { apiPublicPpdb } from "../../lib/backend";

const STEPS = [
    { id: 1, title: "Data Diri", icon: User, desc: "Informasi pribadi calon siswa" },
    { id: 2, title: "Data Orang Tua", icon: Users, desc: "Informasi wali murid" },
    { id: 3, title: "Pilih Program", icon: GraduationCap, desc: "Peminatan & jalur masuk" },
    { id: 4, title: "Upload Dokumen", icon: Upload, desc: "Berkas pendukung" },
];

export default function PPDB() {
    const [step, setStep] = useState(1);
    const [done, setDone] = useState(false);
    const [form, setForm] = useState({
        name: "", school: "", nisn: "", phone: "", email: "", birth: "", gender: "L", address: "",
        fatherName: "", fatherJob: "", motherName: "", motherJob: "", parentPhone: "",
        program: "MIPA", route: "Reguler",
    });

    const timeline = [
        { step: "Pendaftaran Online", date: "1 Mar - 31 Mei", active: true },
        { step: "Tes Akademik & Wawancara", date: "5 - 10 Juni" },
        { step: "Pengumuman Hasil", date: "15 Juni" },
        { step: "Daftar Ulang", date: "16 - 30 Juni" },
    ];

    const next = () => setStep(s => Math.min(4, s + 1));
    const prev = () => setStep(s => Math.max(1, s - 1));
    const submit = async () => {
        try {
            if (!form.name || !form.school || !form.phone) {
                toast.error("Mohon lengkapi minimal: Nama, Asal Sekolah, dan No. HP/WA");
                return;
            }
            await apiPublicPpdb({ name: form.name, school: form.school, phone: form.phone });
            setDone(true);
            toast.success("Pendaftaran berhasil dikirim!");
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Gagal mengirim pendaftaran");
        }
    };

    return (
        <div className="py-14" data-testid="ppdb-page">
            <section className="relative bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 text-white overflow-hidden">
                <div className="absolute inset-0 noise-overlay opacity-30" />
                <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-brand-400/20 blur-3xl" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/15 px-4 py-1.5 text-xs font-semibold"><Sparkles className="w-3 h-3 text-brand-300" /> PPDB 2025/2026 Dibuka</div>
                    <h1 className="font-display text-5xl lg:text-7xl font-black mt-5 tracking-tight leading-[0.95] text-white">Bergabung dengan<br /><span className="font-editorial italic text-brand-300">keluarga besar</span> kami.</h1>
                    <p className="mt-5 max-w-2xl text-brand-100/85">Pendaftaran Peserta Didik Baru telah dibuka. Tersedia jalur reguler, prestasi, dan beasiswa untuk siswa berprestasi.</p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4">
                    <h2 className="font-display text-3xl font-extrabold text-brand-950">Linimasa PPDB</h2>
                    <div className="mt-8 space-y-6 relative">
                        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-brand-200" />
                        {timeline.map((t, i) => (
                            <div key={i} className="flex gap-4 relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.active ? "gradient-brand text-white" : "bg-white border border-brand-200 text-brand-600"}`}>
                                    {t.active ? <Check className="w-4 h-4" /> : i + 1}
                                </div>
                                <div>
                                    <div className="font-display font-bold text-brand-950">{t.step}</div>
                                    <div className="text-sm text-slate-600 mt-0.5">{t.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 bg-brand-50/60 border border-brand-100 rounded-2xl p-5">
                        <div className="inline-flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2"><FileText className="w-3.5 h-3.5" /> Dokumen yang dibutuhkan</div>
                        <ul className="text-sm text-brand-900 space-y-1.5">
                            <li>• Fotokopi Akte Kelahiran</li>
                            <li>• Fotokopi Kartu Keluarga</li>
                            <li>• Pas foto 3x4 (4 lembar)</li>
                            <li>• Ijazah / SKL terakhir</li>
                            <li>• Sertifikat prestasi (jika ada)</li>
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    {done ? (
                        <div className="bg-white rounded-3xl border border-brand-200 p-12 text-center">
                            <div className="w-20 h-20 mx-auto rounded-full gradient-brand text-white flex items-center justify-center"><CheckCircle2 className="w-10 h-10" /></div>
                            <h3 className="font-display text-3xl font-black text-brand-950 mt-6">Pendaftaran Berhasil!</h3>
                            <p className="text-slate-600 mt-3 max-w-md mx-auto">Terima kasih, <strong>{form.name || "calon siswa"}</strong>. Tim PPDB akan menghubungi Anda dalam 1×24 jam melalui email <strong className="text-brand-800">{form.email || "Anda"}</strong>.</p>
                            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-5 py-2.5 text-sm font-bold text-brand-800">No. Pendaftaran: PPDB-2025-{Math.floor(Math.random() * 9000) + 1000}</div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                                    {STEPS.map((s, i) => (
                                        <div key={s.id} className="flex items-center gap-2 flex-1 min-w-fit">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition ${step > s.id ? "gradient-brand text-white" : step === s.id ? "bg-brand-950 text-white" : "bg-slate-100 text-slate-500"}`}>
                                                {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                                            </div>
                                            <div className="hidden sm:block min-w-0">
                                                <div className={`text-xs font-bold ${step >= s.id ? "text-brand-950" : "text-slate-500"}`}>{s.title}</div>
                                            </div>
                                            {i < STEPS.length - 1 && <div className={`hidden md:block flex-1 h-0.5 ${step > s.id ? "bg-brand-500" : "bg-slate-200"}`} />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-7">
                                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Langkah {step} / 4</div>
                                <h3 className="font-display text-2xl font-extrabold text-brand-950 mt-1">{STEPS[step-1].title}</h3>
                                <p className="text-sm text-slate-600 mt-1">{STEPS[step-1].desc}</p>

                                {step === 1 && (
                                    <div className="mt-6 grid sm:grid-cols-2 gap-4" data-testid="ppdb-step-1">
                                        <div className="sm:col-span-2"><label className="text-sm font-semibold text-brand-950">Nama Lengkap</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" data-testid="ppdb-name" /></div>
                                        <div><label className="text-sm font-semibold text-brand-950">Tempat, Tanggal Lahir</label><input value={form.birth} onChange={e => setForm({...form, birth: e.target.value})} placeholder="Pemalang, 1 Jan 2008" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                        <div><label className="text-sm font-semibold text-brand-950">Jenis Kelamin</label>
                                            <div className="mt-1.5 flex gap-2">
                                                {["L", "P"].map(g => <button key={g} type="button" onClick={() => setForm({...form, gender: g})} className={`flex-1 rounded-xl py-3 text-sm font-semibold ${form.gender === g ? "gradient-brand text-white" : "bg-white border border-slate-200 text-brand-900"}`}>{g === "L" ? "Laki-laki" : "Perempuan"}</button>)}
                                            </div>
                                        </div>
                                        <div><label className="text-sm font-semibold text-brand-950">Asal Sekolah</label><input value={form.school} onChange={e => setForm({...form, school: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                        <div><label className="text-sm font-semibold text-brand-950">NISN</label><input value={form.nisn} onChange={e => setForm({...form, nisn: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                        <div className="sm:col-span-2"><label className="text-sm font-semibold text-brand-950">Alamat Lengkap</label><textarea rows={2} value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 resize-none" /></div>
                                        <div><label className="text-sm font-semibold text-brand-950">No. HP / WA</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                        <div><label className="text-sm font-semibold text-brand-950">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                    </div>
                                )}
                                {step === 2 && (
                                    <div className="mt-6 grid sm:grid-cols-2 gap-4" data-testid="ppdb-step-2">
                                        <div><label className="text-sm font-semibold text-brand-950">Nama Ayah</label><input value={form.fatherName} onChange={e => setForm({...form, fatherName: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                        <div><label className="text-sm font-semibold text-brand-950">Pekerjaan Ayah</label><input value={form.fatherJob} onChange={e => setForm({...form, fatherJob: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                        <div><label className="text-sm font-semibold text-brand-950">Nama Ibu</label><input value={form.motherName} onChange={e => setForm({...form, motherName: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                        <div><label className="text-sm font-semibold text-brand-950">Pekerjaan Ibu</label><input value={form.motherJob} onChange={e => setForm({...form, motherJob: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                        <div className="sm:col-span-2"><label className="text-sm font-semibold text-brand-950">No. HP Orang Tua / Wali</label><input value={form.parentPhone} onChange={e => setForm({...form, parentPhone: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                    </div>
                                )}
                                {step === 3 && (
                                    <div className="mt-6 space-y-5" data-testid="ppdb-step-3">
                                        <div>
                                            <label className="text-sm font-semibold text-brand-950">Program Peminatan</label>
                                            <div className="mt-2 grid sm:grid-cols-3 gap-3">
                                                {["MIPA", "IPS", "Keagamaan"].map(p => (
                                                    <button type="button" key={p} onClick={() => setForm({...form, program: p})} className={`relative rounded-2xl p-5 text-left transition ${form.program === p ? "gradient-brand text-white" : "bg-white border border-slate-200 text-brand-900 hover:bg-brand-50"}`} data-testid={`ppdb-program-${p}`}>
                                                        {form.program === p && <Check className="absolute top-3 right-3 w-4 h-4" />}
                                                        <div className="font-display font-extrabold text-lg">{p}</div>
                                                        <div className={`text-xs mt-1 ${form.program === p ? "text-brand-100" : "text-slate-600"}`}>
                                                            {p === "MIPA" ? "Sains & teknologi" : p === "IPS" ? "Sosial & ekonomi" : "Tafsir & bahasa Arab"}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-brand-950">Jalur Masuk</label>
                                            <div className="mt-2 grid sm:grid-cols-3 gap-3">
                                                {[{ k: "Reguler", d: "Tes akademik" }, { k: "Prestasi", d: "Lampirkan sertifikat" }, { k: "Beasiswa", d: "Khusus tidak mampu" }].map(r => (
                                                    <button type="button" key={r.k} onClick={() => setForm({...form, route: r.k})} className={`rounded-2xl p-4 text-left ${form.route === r.k ? "bg-brand-950 text-white" : "bg-white border border-slate-200 text-brand-900"}`}>
                                                        <div className="font-display font-bold">{r.k}</div>
                                                        <div className={`text-xs mt-0.5 ${form.route === r.k ? "text-brand-300" : "text-slate-600"}`}>{r.d}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {step === 4 && (
                                    <div className="mt-6 space-y-3" data-testid="ppdb-step-4">
                                        {["Akte Kelahiran", "Kartu Keluarga", "Pas Foto 3x4", "Ijazah / SKL"].map(f => (
                                            <label key={f} className="block border-2 border-dashed border-brand-200 rounded-xl p-5 bg-brand-50/40 cursor-pointer hover:bg-brand-50">
                                                <div className="flex items-center gap-3">
                                                    <Upload className="w-5 h-5 text-brand-700" />
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-brand-950 text-sm">{f}</div>
                                                        <div className="text-xs text-slate-600">PDF/JPG/PNG · Maks 5MB</div>
                                                    </div>
                                                    <span className="text-xs font-bold text-brand-700">Pilih file</span>
                                                </div>
                                                <input type="file" className="hidden" />
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="px-7 py-4 border-t border-slate-100 flex justify-between items-center">
                                <button type="button" onClick={prev} disabled={step === 1} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-brand-900 disabled:opacity-30" data-testid="ppdb-prev"><ArrowLeft className="w-4 h-4" />Kembali</button>
                                <div className="text-xs text-slate-500">{step}/4</div>
                                {step < 4 ? (
                                    <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-6 py-3 text-sm font-bold" data-testid="ppdb-next">Lanjut<ArrowRight className="w-4 h-4" /></button>
                                ) : (
                                    <button type="button" onClick={submit} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-6 py-3 text-sm font-bold" data-testid="ppdb-submit">Kirim Pendaftaran<Check className="w-4 h-4" /></button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
