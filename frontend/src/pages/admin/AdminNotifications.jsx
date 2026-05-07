import React from "react";
import { Bell, FileText, Mail, BookOpen, UserPlus, Database, Check } from "lucide-react";
import { PageHeader } from "../../components/shared/Primitives";
import { notifications } from "../../data/mockData";
import { toast } from "sonner";
import { useRecordType } from "../../hooks/useRecordType";

const ICONS = { FileText, Mail, BookOpen, UserPlus, Database };

export default function AdminNotifications() {
    const { items, setItems, updateItem, hasToken } = useRecordType("notifications", notifications);
    const markAllRead = async () => {
        setItems((prev) => (prev || []).map((n) => ({ ...n, read: true })));
        if (!hasToken) { toast.error("Silakan login dulu"); return; }

        const persisted = (items || []).filter((n) => typeof n.id === "string" && !n.read);
        if (persisted.length === 0) return;
        const results = await Promise.allSettled(persisted.map((n) => updateItem(n.id, { ...n, read: true })));
        const fail = results.filter((r) => r.status === "rejected").length;
        if (fail > 0) toast.error(`${fail} notifikasi gagal diperbarui`);
    };
    return (
        <div data-testid="admin-notifications">
            <PageHeader title="Notifikasi" description="Pemberitahuan sistem dan aktivitas penting." breadcrumbs={["Admin", "Notifikasi"]}
                actions={<button onClick={markAllRead} className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-900"><Check className="w-4 h-4" />Tandai semua dibaca</button>} />
            <div className="space-y-3">
                {items.map(n => {
                    const Icon = ICONS[n.icon] || Bell;
                    return (
                        <div key={n.id} className={`bg-white rounded-2xl border p-5 flex items-center gap-4 ${n.read ? "border-slate-100" : "border-brand-200 bg-brand-50/20"}`} data-testid={`notif-${n.id}`}>
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${n.read ? "bg-slate-100 text-slate-600" : "gradient-brand text-white"}`}><Icon className="w-5 h-5" /></div>
                            <div className="flex-1">
                                <div className="font-semibold text-brand-950">{n.title}</div>
                                <div className="text-xs text-slate-600 mt-0.5">{n.time}</div>
                            </div>
                            {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
