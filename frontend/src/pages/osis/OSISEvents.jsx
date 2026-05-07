import React, { useMemo, useState } from "react";
import { Plus, Calendar, MapPin, Clock, X } from "lucide-react";
import { PageHeader, StatusBadge } from "../../components/shared/Primitives";
import { events } from "../../data/mockData";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { apiCreateRecord } from "../../lib/backend";
import { useRecordType } from "../../hooks/useRecordType";

export default function OSISEvents() {
    const { user } = useAuth();
    const eventsApi = useRecordType("events", events);
    const [editor, setEditor] = useState(false);
    const [form, setForm] = useState({ title: "", date: new Date().toISOString().slice(0, 10), time: "08:00", location: "Madrasah", type: "Kesiswaan" });

    const myItems = useMemo(() => {
        const email = user?.email || "";
        return eventsApi.items.filter((e) => !e.submittedBy || e.submittedBy === email);
    }, [eventsApi.items, user]);

    return (
        <div data-testid="osis-events">
            <PageHeader title="Usulan Acara" description="Ajukan proposal kegiatan OSIS ke pihak admin." breadcrumbs={["OSIS", "Acara"]}
                actions={<button onClick={() => { setForm({ title: "", date: new Date().toISOString().slice(0, 10), time: "08:00", location: "Madrasah", type: "Kesiswaan" }); setEditor(true); }} className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-5 py-2.5 text-sm font-bold"><Plus className="w-4 h-4" />Proposal Acara</button>} />
            <div className="grid md:grid-cols-2 gap-5">
                {myItems.map((e, i) => (
                    <div key={e.id} className="bg-white rounded-2xl border border-slate-100 p-6 card-lift">
                        <div className="flex items-start justify-between">
                            <div className="w-16 h-16 rounded-2xl gradient-brand text-white flex flex-col items-center justify-center">
                                <div className="text-[10px] font-bold uppercase">{format(new Date(e.date), "MMM", { locale: idLocale })}</div>
                                <div className="font-display font-black text-xl leading-none">{format(new Date(e.date), "dd")}</div>
                            </div>
                            <StatusBadge status={e.status || (i % 3 === 0 ? "pending" : i % 3 === 1 ? "approved" : "draft")} />
                        </div>
                        <h3 className="font-display font-bold text-lg text-brand-950 mt-4">{e.title}</h3>
                        <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
                            <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{e.time}</span>
                            <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location}</span>
                        </div>
                    </div>
                ))}
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => setEditor(false)}>
                    <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">Proposal Acara</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{form.title || "Acara"}</h3>
                            </div>
                            <button onClick={() => setEditor(false)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <div><label className="text-sm font-semibold text-brand-950">Judul</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Tanggal</label><input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 font-mono" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Waktu</label><input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 font-mono" /></div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Lokasi</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Kategori</label><input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            </div>
                        </div>
                        <div className="px-7 py-4 border-t border-slate-100 flex gap-3">
                            <button onClick={() => setEditor(false)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button
                                onClick={async () => {
                                    if (!eventsApi.hasToken) { toast.error("Silakan login dulu"); return; }
                                    try {
                                        const created = await eventsApi.createItem({ title: form.title, date: form.date, time: form.time, location: form.location, type: form.type, status: "pending", submittedBy: user?.email });
                                        await apiCreateRecord("approvalQueue", { type: "Agenda", title: form.title, submittedBy: user?.email, date: form.date, status: "pending", refType: "events", refId: created.id });
                                        toast.success("Proposal diajukan ke admin");
                                        setEditor(false);
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
