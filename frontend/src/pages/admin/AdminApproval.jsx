import React, { useState } from "react";
import { CheckCircle2, XCircle, Eye, X, User, Calendar, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatusBadge } from "../../components/shared/Primitives";
import { approvalQueue, initPublicData } from "../../data/mockData";
import { useRecordType } from "../../hooks/useRecordType";
import { apiGetRecord, apiUpdateRecord } from "../../lib/backend";

export default function AdminApproval() {
    const { items, updateItem, hasToken } = useRecordType("approvalQueue", approvalQueue);
    const [filter, setFilter] = useState("all");
    const [preview, setPreview] = useState(null);
    const [note, setNote] = useState("");
    const filtered = filter === "all" ? items : items.filter(a => a.status === filter);

    const action = (item, status) => {
        if (!hasToken) {
            toast.error("Silakan login dulu");
            return;
        }
        if (typeof item?.id !== "string") {
            toast.error("Item demo tidak bisa diubah. Buat submisi baru agar tersimpan ke backend.");
            return;
        }
        updateItem(item.id, { ...item, status, note: note || item.note || "" })
            .then(() => {
                if (item.refId && typeof item.refId === "string") {
                    apiGetRecord(item.refId)
                        .then((rec) => {
                            if (!rec || typeof rec !== "object") return;
                            return apiUpdateRecord(item.refId, { ...rec, status, review_note: note || rec.review_note || "" });
                        })
                        .catch(() => {});
                }
                if (status === "approved") toast.success(`"${item.title}" disetujui`);
                else toast.error(`"${item.title}" ditolak`);
                setPreview(null);
                setNote("");
                initPublicData().catch(() => {});
            })
            .catch((err) => toast.error(err?.response?.data?.message || err.message || "Gagal memproses"));
    };

    return (
        <div data-testid="admin-approval">
            <PageHeader title="Antrian Persetujuan" description="Tinjau, setujui, atau tolak konten yang diajukan guru & OSIS." breadcrumbs={["Admin", "Persetujuan"]} />
            <div className="flex gap-2 mb-5">
                {[{ id: "all", label: "Semua" }, { id: "pending", label: "Menunggu" }, { id: "approved", label: "Disetujui" }, { id: "rejected", label: "Ditolak" }].map(t => (
                    <button key={t.id} onClick={() => setFilter(t.id)} data-testid={`approval-filter-${t.id}`}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === t.id ? "bg-brand-950 text-white" : "bg-white border border-slate-200 text-brand-900 hover:bg-brand-50"}`}>{t.label}</button>
                ))}
            </div>
            <div className="space-y-3">
                {filtered.map(a => (
                    <div key={a.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col md:flex-row md:items-center gap-4" data-testid={`approval-${a.id}`}>
                        <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center text-xs font-bold uppercase shrink-0">{a.type.slice(0,3)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] uppercase tracking-wider text-brand-600 font-bold">{a.type}</div>
                            <div className="font-display font-bold text-brand-950 mt-0.5">{a.title}</div>
                            <div className="text-xs text-slate-600 mt-1">Diajukan oleh {a.submittedBy} · {a.date}</div>
                        </div>
                        <StatusBadge status={a.status} />
                        <div className="flex gap-2">
                            <button onClick={() => { setPreview(a); setNote(a.note || ""); }} className="inline-flex items-center gap-1.5 rounded-xl border border-brand-200 text-brand-700 px-3 py-2 text-xs font-bold hover:bg-brand-50" data-testid={`preview-${a.id}`}><Eye className="w-3.5 h-3.5" />Tinjau</button>
                            {a.status === "pending" && (
                                <>
                                    <button onClick={() => action(a, "approved")} data-testid={`approve-${a.id}`} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 text-emerald-800 px-3 py-2 text-xs font-bold hover:bg-emerald-200"><CheckCircle2 className="w-3.5 h-3.5" />Setujui</button>
                                    <button onClick={() => action(a, "rejected")} data-testid={`reject-${a.id}`} className="inline-flex items-center gap-1.5 rounded-xl bg-red-100 text-red-800 px-3 py-2 text-xs font-bold hover:bg-red-200"><XCircle className="w-3.5 h-3.5" />Tolak</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {preview && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-up" onClick={() => setPreview(null)} data-testid="approval-preview-modal">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 rounded-full px-2.5 py-1">{preview.type}</span>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-2">{preview.title}</h3>
                            </div>
                            <button onClick={() => setPreview(null)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7">
                            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                <div className="flex items-center gap-2"><User className="w-4 h-4 text-brand-700" /><div><div className="text-xs text-slate-500">Diajukan oleh</div><div className="font-semibold text-brand-950">{preview.submittedBy}</div></div></div>
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-700" /><div><div className="text-xs text-slate-500">Tanggal</div><div className="font-semibold text-brand-950">{preview.date}</div></div></div>
                            </div>
                            <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5">
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-3 inline-flex items-center gap-1.5"><FileText className="w-3 h-3" />Preview Konten</div>
                                <p className="text-brand-900 leading-relaxed">
                                    Berikut adalah preview konten "{preview.title}" yang diajukan oleh {preview.submittedBy}. Konten ini berisi rangkuman kegiatan, foto-foto pendukung, dan deskripsi lengkap untuk dipublikasikan di website MAS YPI Pulosari.
                                </p>
                                <p className="text-brand-800/80 leading-relaxed mt-3">
                                    Mohon admin meninjau apakah konten sudah sesuai dengan pedoman publikasi madrasah, tata bahasa, dan kelayakan untuk konsumsi publik.
                                </p>
                            </div>
                            {preview.status === "pending" ? (
                                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start">
                                    <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                                    <div className="text-sm text-amber-900">
                                        <strong>Perhatian:</strong> Setelah Anda setujui, konten akan langsung tampil di halaman publik website. Pastikan konten sudah sesuai pedoman.
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-6"><StatusBadge status={preview.status} /></div>
                            )}
                            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan untuk pengaju (opsional)" rows={3} className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 resize-none" data-testid="approval-note" />
                        </div>
                        {preview.status === "pending" && (
                            <div className="px-7 py-4 border-t border-slate-100 flex gap-3 sticky bottom-0 bg-white">
                                <button onClick={() => action(preview, "rejected")} className="flex-1 rounded-xl bg-red-100 text-red-800 hover:bg-red-200 py-3 text-sm font-bold inline-flex items-center justify-center gap-2"><XCircle className="w-4 h-4" />Tolak</button>
                                <button onClick={() => action(preview, "approved")} className="flex-1 rounded-xl gradient-brand text-white py-3 text-sm font-bold inline-flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" />Setujui</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
