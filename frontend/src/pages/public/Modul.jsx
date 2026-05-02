import React from "react";
import { Download, BookCopy, Calendar } from "lucide-react";
import { initPublicData, modules } from "../../data/mockData";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import { apiPublicDownloadModule } from "../../lib/backend";

export default function Modul() {
    const visible = modules.filter((m) => !m.status || m.status === "approved");
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="modul-page">
            <div className="max-w-3xl">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Modul Pembelajaran</div>
                <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Materi <span className="font-editorial italic text-brand-700">terbuka</span> untuk semua.</h1>
                <p className="mt-5 text-brand-800/85">Akses gratis modul pembelajaran berkualitas karya guru MA Pulosari.</p>
            </div>
            <div className="mt-12 space-y-3">
                {visible.map((m) => (
                    <div key={m.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col md:flex-row md:items-center gap-4 card-lift" data-testid={`modul-${m.id}`}>
                        <div className="w-14 h-14 rounded-2xl gradient-brand text-white flex items-center justify-center shrink-0"><BookCopy className="w-5 h-5" /></div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-display font-bold text-brand-950 text-lg">{m.title}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600">
                                <span className="bg-brand-50 text-brand-800 rounded-full px-2 py-0.5 font-semibold">Kelas {m.grade}</span>
                                <span>{m.subject}</span>
                                <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(m.updatedAt), "d MMM yyyy", { locale: idLocale })}</span>
                                <span>{m.fileSize} · {m.downloads} unduhan</span>
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                try {
                                    if (!m?.id) {
                                        if (m.url) window.open(m.url, "_blank", "noopener,noreferrer");
                                        else toast.error("File belum tersedia");
                                        return;
                                    }
                                    const res = await apiPublicDownloadModule(String(m.id));
                                    if (res?.url) window.open(res.url, "_blank", "noopener,noreferrer");
                                    else toast.error("File belum tersedia");
                                    initPublicData().catch(() => {});
                                } catch (err) {
                                    if (m.url) window.open(m.url, "_blank", "noopener,noreferrer");
                                    else toast.error(err?.response?.data?.message || err.message || "Gagal mengunduh");
                                }
                            }}
                            className="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-3 text-sm font-bold shrink-0"
                            data-testid={`modul-download-${m.id}`}
                        >
                            <Download className="w-4 h-4" /> Download Modul
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
