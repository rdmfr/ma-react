import React from "react";
import { Download, Users2 } from "lucide-react";
import { PageHeader, StatusBadge, StatCard } from "../../components/shared/Primitives";
import { ppdbRegistrants } from "../../data/mockData";
import { toast } from "sonner";
import { useRecordType } from "../../hooks/useRecordType";

export default function AdminPPDB() {
    const { items, updateItem, hasToken } = useRecordType("ppdbRegistrants", ppdbRegistrants);
    return (
        <div data-testid="admin-ppdb">
            <PageHeader title="Manajemen PPDB" description="Kelola pendaftar penerimaan siswa baru." breadcrumbs={["Admin", "PPDB"]}
                actions={<button className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Download className="w-4 h-4" />Export Excel</button>} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Pendaftar" value="147" icon={Users2} trend="+12 minggu ini" />
                <StatCard label="Diterima" value="87" hint="59% dari total" accent="bg-emerald-50 text-emerald-700" />
                <StatCard label="Proses Wawancara" value="24" accent="bg-blue-50 text-blue-700" />
                <StatCard label="Kuota Tersisa" value="33" hint="dari 120 kuota" accent="bg-amber-50 text-amber-700" />
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50/50">
                        <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                            <th className="px-6 py-3">Nama</th><th className="px-6 py-3">Asal Sekolah</th><th className="px-6 py-3">Kontak</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map(p => (
                            <tr key={p.id} className="hover:bg-brand-50/30" data-testid={`ppdb-${p.id}`}>
                                <td className="px-6 py-3 font-semibold text-brand-950">{p.name}</td>
                                <td className="px-6 py-3 text-slate-700">{p.school}</td>
                                <td className="px-6 py-3 text-slate-700 font-mono text-xs">{p.phone}</td>
                                <td className="px-6 py-3">
                                    {hasToken && typeof p.id === "string" ? (
                                        <select
                                            value={p.status}
                                            onChange={async (e) => {
                                                try {
                                                    await updateItem(p.id, { ...p, status: e.target.value });
                                                } catch (err) {
                                                    toast.error(err?.response?.data?.message || err.message || "Gagal update status");
                                                }
                                            }}
                                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold outline-none"
                                        >
                                            <option value="Proses">Proses</option>
                                            <option value="Wawancara">Wawancara</option>
                                            <option value="Diterima">Diterima</option>
                                            <option value="Ditolak">Ditolak</option>
                                        </select>
                                    ) : (
                                        <StatusBadge status={p.status} />
                                    )}
                                </td>
                                <td className="px-6 py-3 text-slate-600 text-xs">{p.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
