import React from "react";
import { Download } from "lucide-react";
import { initPublicData, studentWorks } from "../../data/mockData";
import { toast } from "sonner";
import { apiPublicDownloadStudentWork } from "../../lib/backend";

export default function KaryaSiswa() {
    const visible = studentWorks.filter((k) => !k.status || k.status === "approved");
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="karya-page">
            <div className="max-w-3xl">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Karya Siswa</div>
                <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Bakat yang <span className="font-editorial italic text-brand-700">berbicara</span>.</h1>
            </div>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visible.map((k) => (
                    <div key={k.id} className="group rounded-3xl overflow-hidden border border-slate-100 bg-white card-lift" data-testid={`karya-${k.id}`}>
                        <div className="aspect-[4/3] overflow-hidden relative">
                            <img src={k.image} alt={k.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                            <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-brand-800 rounded-full px-2.5 py-1">{k.category}</span>
                        </div>
                        <div className="p-5">
                            <h3 className="font-display font-bold text-brand-950 text-lg leading-tight">{k.title}</h3>
                            <p className="text-xs text-slate-600 mt-1">oleh {k.author}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-[11px] text-slate-500">{k.fileSize} · {k.downloads} unduhan</span>
                                <button
                                    onClick={async () => {
                                        try {
                                            if (!k?.id) {
                                                if (k.url) window.open(k.url, "_blank", "noopener,noreferrer");
                                                else toast.error("File belum tersedia");
                                                return;
                                            }
                                            const res = await apiPublicDownloadStudentWork(String(k.id));
                                            if (res?.url) window.open(res.url, "_blank", "noopener,noreferrer");
                                            else toast.error("File belum tersedia");
                                            initPublicData().catch(() => {});
                                        } catch (err) {
                                            if (k.url) window.open(k.url, "_blank", "noopener,noreferrer");
                                            else toast.error(err?.response?.data?.message || err.message || "Gagal mengunduh");
                                        }
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-3 py-2 text-xs font-bold"
                                    data-testid={`karya-download-${k.id}`}
                                >
                                    <Download className="w-3.5 h-3.5" /> Unduh
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
