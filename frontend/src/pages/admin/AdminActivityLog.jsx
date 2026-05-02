import React from "react";
import { Activity } from "lucide-react";
import { EmptyState, PageHeader } from "../../components/shared/Primitives";
import { activityLog } from "../../data/mockData";
import { useRecordType } from "../../hooks/useRecordType";

const ACTION_COLOR = { LOGIN: "bg-blue-100 text-blue-800", CREATE: "bg-emerald-100 text-emerald-800", UPDATE: "bg-amber-100 text-amber-800", DELETE: "bg-red-100 text-red-800", APPROVE: "bg-emerald-100 text-emerald-800", SUBMIT: "bg-brand-100 text-brand-800" };

export default function AdminActivityLog() {
    const { items, loading, error } = useRecordType("activityLog", activityLog);
    return (
        <div data-testid="admin-activity">
            <PageHeader title="Log Aktivitas" description="Riwayat semua aksi yang terjadi di sistem." breadcrumbs={["Admin", "Log"]} />
            {!!error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">{error}</div>}
            {loading && <div className="mb-4 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">Memuat log aktivitas...</div>}
            {(items || []).length === 0 ? (
                <EmptyState title="Belum ada aktivitas" description="Log aktivitas akan muncul setelah ada aksi di sistem." icon={Activity} />
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/50">
                            <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                                <th className="px-6 py-3">Waktu</th><th className="px-6 py-3">Pengguna</th><th className="px-6 py-3">Aksi</th><th className="px-6 py-3">Target</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map(l => (
                                <tr key={l.id} className="hover:bg-brand-50/30" data-testid={`log-${l.id}`}>
                                    <td className="px-6 py-3 text-slate-600 font-mono text-xs">{l.date}</td>
                                    <td className="px-6 py-3 text-slate-800">{l.user}</td>
                                    <td className="px-6 py-3"><span className={`text-[10px] font-bold rounded-full px-2.5 py-1 ${ACTION_COLOR[l.action] || "bg-slate-100 text-slate-700"}`}>{l.action}</span></td>
                                    <td className="px-6 py-3 text-slate-700 font-mono text-xs">{l.target}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
