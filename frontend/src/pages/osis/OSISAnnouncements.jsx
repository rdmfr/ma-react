import React, { useMemo, useState } from "react";
import { Plus, Megaphone, Pencil, X } from "lucide-react";
import { PageHeader, StatusBadge } from "../../components/shared/Primitives";
import { announcements } from "../../data/mockData";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { apiCreateRecord, apiListRecords, apiUpdateRecord } from "../../lib/backend";
import { useRecordType } from "../../hooks/useRecordType";

export default function OSISAnnouncements() {
    const { user } = useAuth();
    const announcementsApi = useRecordType("announcements", announcements);
    const [editor, setEditor] = useState(null);
    const [form, setForm] = useState({ title: "", content: "" });

    const myItems = useMemo(() => {
        const email = user?.email || "";
        return announcementsApi.items.filter((a) => !a.submittedBy || a.submittedBy === email);
    }, [announcementsApi.items, user]);

    return (
        <div data-testid="osis-announcements">
            <PageHeader title="Draft Pengumuman" description="Buat draft pengumuman untuk ditinjau admin." breadcrumbs={["OSIS", "Pengumuman"]}
                actions={<button onClick={() => { setForm({ title: "", content: "" }); setEditor({ mode: "create" }); }} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Plus className="w-4 h-4" />Draft Baru</button>} />
            <div className="space-y-3">
                {myItems.map((a, i) => (
                    <div key={a.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 card-lift">
                        <div className="w-11 h-11 rounded-xl gradient-brand text-white flex items-center justify-center shrink-0"><Megaphone className="w-5 h-5" /></div>
                        <div className="flex-1 min-w-0">
                            <div className="font-display font-bold text-brand-950">{a.title}</div>
                            <div className="text-xs text-slate-600 mt-0.5 truncate">{a.content}</div>
                        </div>
                        <StatusBadge status={a.status || (i % 3 === 0 ? "draft" : i % 3 === 1 ? "pending" : "approved")} />
                        <button
                            onClick={() => {
                                setForm({ title: a.title || "", content: a.content || "" });
                                setEditor({ mode: "edit", item: a });
                            }}
                            className="w-9 h-9 rounded-xl border border-slate-200 text-brand-700 flex items-center justify-center hover:bg-brand-50"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => setEditor(null)}>
                    <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">Draft Pengumuman</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{form.title || "Pengumuman"}</h3>
                            </div>
                            <button onClick={() => setEditor(null)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <div><label className="text-sm font-semibold text-brand-950">Judul</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div><label className="text-sm font-semibold text-brand-950">Isi</label><textarea rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 resize-none" /></div>
                        </div>
                        <div className="px-7 py-4 border-t border-slate-100 flex gap-3">
                            <button onClick={() => setEditor(null)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button
                                onClick={async () => {
                                    if (!announcementsApi.hasToken) { toast.error("Silakan login dulu"); return; }
                                    try {
                                        const today = new Date().toISOString().slice(0, 10);
                                        if (editor.mode === "create") {
                                            const created = await announcementsApi.createItem({ title: form.title, date: today, pinned: false, content: form.content, status: "pending", submittedBy: user?.email });
                                            await apiCreateRecord("approvalQueue", { type: "Pengumuman", title: form.title, submittedBy: user?.email, date: today, status: "pending", refType: "announcements", refId: created.id });
                                        } else {
                                            const it = editor.item;
                                            if (typeof it?.id !== "string") { toast.error("Item demo tidak bisa diubah. Buat draft baru untuk menyimpan ke backend."); return; }
                                            const updated = await announcementsApi.updateItem(it.id, { title: form.title, date: it.date || today, pinned: !!it.pinned, content: form.content, status: "pending", submittedBy: user?.email });
                                            const queue = await apiListRecords("approvalQueue", 1000);
                                            const q = (queue || []).find((x) => x.refType === "announcements" && x.refId === it.id && x.status === "pending");
                                            if (q?.id) await apiUpdateRecord(q.id, { ...q, title: updated.title, submittedBy: user?.email, date: q.date || today, status: "pending" });
                                            else await apiCreateRecord("approvalQueue", { type: "Pengumuman", title: updated.title, submittedBy: user?.email, date: today, status: "pending", refType: "announcements", refId: it.id });
                                        }
                                        toast.success("Draft diajukan ke admin");
                                        setEditor(null);
                                    } catch (err) {
                                        toast.error(err?.response?.data?.message || err.message || "Gagal mengirim");
                                    }
                                }}
                                className="flex-1 rounded-xl gradient-brand text-white py-3 text-sm font-bold"
                            >
                                Kirim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
