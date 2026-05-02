import React, { useState } from "react";
import { Download, Printer, FileText, X, Award } from "lucide-react";
import { PageHeader } from "../../components/shared/Primitives";
import { students, classes, scores, subjects } from "../../data/mockData";
import { useBranding } from "../../context/BrandingContext";

export default function AdminReportCards() {
    const { branding } = useBranding();
    const [preview, setPreview] = useState(null);
    const firstStudent = students?.[0];

    const print = () => window.print();

    return (
        <div data-testid="admin-report-cards">
            <PageHeader title="Rapor Siswa" description="Generate dan distribusikan rapor per kelas atau batch." breadcrumbs={["Admin", "Rapor"]}
                actions={<button className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold no-print"><Download className="w-4 h-4" />Export Semua (PDF)</button>} />
            <div className="grid lg:grid-cols-3 gap-6 no-print">
                {classes.slice(0, 6).map(c => (
                    <div key={c.id} className="bg-white rounded-2xl border border-slate-100 p-6 card-lift" data-testid={`rapor-${c.id}`}>
                        <div className="w-12 h-12 rounded-xl gradient-brand text-white flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                        <div className="font-display font-bold text-xl text-brand-950 mt-4">{c.name}</div>
                        <div className="text-xs text-slate-600 mt-1">{c.students} siswa · {c.homeroom}</div>
                        <div className="mt-4 flex gap-2">
                            <button onClick={() => setPreview(c)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-200 py-2 text-xs font-bold text-brand-900 hover:bg-brand-50" data-testid={`rapor-preview-${c.id}`}><Printer className="w-3 h-3" />Preview</button>
                            <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg gradient-brand text-white py-2 text-xs font-bold"><Download className="w-3 h-3" />Export</button>
                        </div>
                    </div>
                ))}
            </div>

            {preview && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 no-print" onClick={() => setPreview(null)} data-testid="rapor-preview-modal">
                    <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto thin-scroll" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h3 className="font-display font-extrabold text-2xl text-brand-950">Preview Rapor — {preview.name}</h3>
                            <div className="flex gap-2">
                                <button onClick={print} className="inline-flex items-center gap-1.5 rounded-xl gradient-brand text-white px-4 py-2 text-xs font-bold"><Printer className="w-3.5 h-3.5" />Cetak</button>
                                <button onClick={() => setPreview(null)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="p-8 print-section">
                            <div className="flex items-start gap-4 pb-5 border-b-2 border-brand-950">
                                <div className="w-16 h-16 rounded-xl bg-white border border-brand-100 p-1.5"><img src={branding.logoUrl} alt="" className="w-full h-full object-contain" /></div>
                                <div className="flex-1">
                                    <div className="text-xs font-bold uppercase tracking-wider text-brand-700">RAPOR HASIL BELAJAR</div>
                                    <div className="font-display font-black text-2xl text-brand-950 mt-1">{branding.schoolName}</div>
                                    <div className="text-xs text-slate-600 mt-0.5">{branding.address}</div>
                                </div>
                                <Award className="w-8 h-8 text-brand-700" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
                                <div><span className="text-slate-500">Nama Siswa:</span> <span className="font-semibold text-brand-950">{firstStudent?.name || "-"}</span></div>
                                <div><span className="text-slate-500">NIS:</span> <span className="font-mono text-brand-950">{firstStudent?.nis || "-"}</span></div>
                                <div><span className="text-slate-500">Kelas:</span> <span className="font-semibold text-brand-950">{preview.name}</span></div>
                                <div><span className="text-slate-500">Tahun Ajaran:</span> <span className="font-semibold text-brand-950">2024/2025 — Genap</span></div>
                            </div>
                            <table className="w-full mt-6 text-sm">
                                <thead className="bg-brand-950 text-white">
                                    <tr><th className="text-left px-3 py-2 font-bold">No</th><th className="text-left px-3 py-2 font-bold">Mata Pelajaran</th><th className="px-3 py-2 font-bold text-center">Harian</th><th className="px-3 py-2 font-bold text-center">UTS</th><th className="px-3 py-2 font-bold text-center">UAS</th><th className="px-3 py-2 font-bold text-center">Akhir</th><th className="px-3 py-2 font-bold text-center">Predikat</th></tr>
                                </thead>
                                <tbody>
                                    {subjects.slice(0, 8).map((sub, i) => {
                                        const h = 80 + (i * 3) % 15, u = 75 + (i * 5) % 15, ua = 78 + (i * 4) % 18;
                                        const f = (h * 0.3 + u * 0.3 + ua * 0.4).toFixed(1);
                                        const p = f >= 90 ? "A" : f >= 80 ? "B" : f >= 70 ? "C" : "D";
                                        return (
                                            <tr key={sub.id} className="border-b border-slate-100">
                                                <td className="px-3 py-2">{i+1}</td>
                                                <td className="px-3 py-2 font-semibold text-brand-950">{sub.name}</td>
                                                <td className="px-3 py-2 text-center">{h}</td>
                                                <td className="px-3 py-2 text-center">{u}</td>
                                                <td className="px-3 py-2 text-center">{ua}</td>
                                                <td className="px-3 py-2 text-center font-bold text-brand-800">{f}</td>
                                                <td className="px-3 py-2 text-center"><span className={`inline-flex w-6 h-6 rounded-full text-white text-xs font-bold items-center justify-center ${p === "A" ? "bg-emerald-600" : p === "B" ? "bg-brand-600" : p === "C" ? "bg-amber-600" : "bg-red-600"}`}>{p}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="mt-8 grid grid-cols-2 gap-12 text-sm">
                                <div className="text-center">
                                    <div className="text-slate-600">Mengetahui,<br />Wali Kelas</div>
                                    <div className="h-16" />
                                    <div className="font-bold text-brand-950 border-t border-slate-300 pt-1">{preview.homeroom}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-slate-600">Garut, 15 Juni 2025<br />Kepala Madrasah</div>
                                    <div className="h-16" />
                                    <div className="font-bold text-brand-950 border-t border-slate-300 pt-1">Ahmad Fauzi, M.Pd</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
