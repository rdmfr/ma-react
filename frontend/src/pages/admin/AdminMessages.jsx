import React, { useEffect, useState } from "react";
import { Mail, Reply, Trash2 } from "lucide-react";
import { PageHeader } from "../../components/shared/Primitives";
import { contactMessages } from "../../data/mockData";
import { toast } from "sonner";
import { useRecordType } from "../../hooks/useRecordType";

export default function AdminMessages() {
    const { items, updateItem, deleteItem, hasToken } = useRecordType("contactMessages", contactMessages);
    const [sel, setSel] = useState(contactMessages[0]);

    useEffect(() => {
        if (items?.length && !sel) setSel(items[0]);
    }, [items, sel]);

    const select = async (m) => {
        setSel(m);
        if (!hasToken) return;
        if (typeof m?.id !== "string") return;
        if (m.read) return;
        try {
            await updateItem(m.id, { ...m, read: true });
        } catch { }
    };
    return (
        <div data-testid="admin-messages">
            <PageHeader title="Pesan Masuk" description="Kelola pesan yang masuk melalui form kontak." breadcrumbs={["Admin", "Pesan"]} />
            <div className="grid lg:grid-cols-12 gap-5 bg-white rounded-3xl border border-slate-100 overflow-hidden">
                <div className="lg:col-span-4 border-r border-slate-100 max-h-[70vh] overflow-y-auto thin-scroll">
                    {items.map(m => (
                        <button key={m.id} onClick={() => select(m)} data-testid={`msg-item-${m.id}`}
                            className={`w-full text-left p-5 border-b border-slate-100 hover:bg-brand-50/30 transition ${sel?.id === m.id ? "bg-brand-50/60" : ""}`}>
                            <div className="flex items-center justify-between">
                                <div className="font-semibold text-brand-950">{m.name}</div>
                                {!m.read && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                            </div>
                            <div className="text-sm text-slate-700 mt-1 truncate">{m.subject}</div>
                            <div className="text-[11px] text-slate-500 mt-1">{m.date}</div>
                        </button>
                    ))}
                </div>
                <div className="lg:col-span-8 p-8">
                    {sel && (
                        <>
                            <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
                                <div>
                                    <h3 className="font-display font-extrabold text-xl text-brand-950">{sel.subject}</h3>
                                    <div className="text-sm text-slate-600 mt-2">dari <span className="font-semibold text-brand-900">{sel.name}</span> · {sel.email}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="inline-flex items-center gap-1.5 rounded-xl gradient-brand text-white px-4 py-2 text-xs font-bold"><Reply className="w-3 h-3" />Balas</button>
                                    <button
                                        onClick={async () => {
                                            if (!hasToken) { toast.error("Silakan login dulu"); return; }
                                            if (typeof sel?.id !== "string") { toast.error("Item demo tidak bisa dihapus"); return; }
                                            try {
                                                await deleteItem(sel.id);
                                                setSel(null);
                                                toast.success("Pesan dihapus");
                                            } catch (err) {
                                                toast.error(err?.response?.data?.message || err.message || "Gagal menghapus");
                                            }
                                        }}
                                        className="w-9 h-9 rounded-xl border border-slate-200 text-red-600 flex items-center justify-center"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <p className="mt-5 text-slate-700 leading-relaxed">
                                {sel.message || "-"}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
