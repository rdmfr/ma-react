import React, { useState, useMemo } from "react";
import { CalendarDays, MapPin, Clock, ChevronLeft, ChevronRight, LayoutGrid, Calendar as CalendarIcon } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfWeek, endOfWeek } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { events } from "../../data/mockData";

export default function Agenda() {
    const [view, setView] = useState("grid");
    const [cursor, setCursor] = useState(new Date(2025, 2, 1));
    const visibleEvents = useMemo(() => events.filter((e) => !e.status || e.status === "approved"), []);

    const monthDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
        const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [cursor]);

    const eventsByDate = useMemo(() => {
        const m = {};
        visibleEvents.forEach(e => {
            const k = format(new Date(e.date), "yyyy-MM-dd");
            (m[k] = m[k] || []).push(e);
        });
        return m;
    }, [visibleEvents]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="agenda-page">
            <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Agenda</div>
                    <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Kalender <span className="font-editorial italic text-brand-700">kegiatan</span> kami.</h1>
                </div>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                    <button onClick={() => setView("grid")} className={`px-3 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 ${view === "grid" ? "bg-brand-950 text-white" : "text-brand-900"}`} data-testid="agenda-view-grid"><LayoutGrid className="w-3.5 h-3.5" />Grid</button>
                    <button onClick={() => setView("calendar")} className={`px-3 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 ${view === "calendar" ? "bg-brand-950 text-white" : "text-brand-900"}`} data-testid="agenda-view-calendar"><CalendarIcon className="w-3.5 h-3.5" />Kalender</button>
                </div>
            </div>

            {view === "grid" ? (
                <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {visibleEvents.map((e, i) => (
                        <div key={e.id} className={`relative overflow-hidden rounded-3xl p-7 card-lift ${i % 3 === 0 ? "bg-brand-950 text-white" : "bg-white border border-slate-100"}`} data-testid={`agenda-${e.id}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className={`w-20 text-center rounded-2xl p-3 ${i % 3 === 0 ? "bg-brand-500/20 text-brand-200" : "gradient-brand text-white"}`}>
                                    <div className="text-[10px] font-bold uppercase">{format(new Date(e.date), "MMM", { locale: idLocale })}</div>
                                    <div className="font-display font-black text-3xl leading-none mt-1">{format(new Date(e.date), "dd")}</div>
                                    <div className="text-[10px] mt-1 opacity-80">{format(new Date(e.date), "EEEE", { locale: idLocale })}</div>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 ${i % 3 === 0 ? "bg-white/10 text-brand-200" : "bg-brand-100 text-brand-800"}`}>{e.type}</span>
                            </div>
                            <h3 className={`font-display font-extrabold text-xl mt-6 ${i % 3 === 0 ? "text-white" : "text-brand-950"}`}>{e.title}</h3>
                            <div className={`mt-4 flex items-center gap-4 text-xs ${i % 3 === 0 ? "text-brand-300" : "text-slate-600"}`}>
                                <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {e.time}</span>
                                <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {e.location}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-10 bg-white rounded-3xl border border-slate-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-display text-2xl font-extrabold text-brand-950">{format(cursor, "MMMM yyyy", { locale: idLocale })}</h3>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCursor(subMonths(cursor, 1))} className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-brand-50 flex items-center justify-center text-brand-900"><ChevronLeft className="w-4 h-4" /></button>
                            <button onClick={() => setCursor(new Date(2025, 2, 1))} className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-brand-50 text-xs font-bold text-brand-900">Hari ini</button>
                            <button onClick={() => setCursor(addMonths(cursor, 1))} className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-brand-50 flex items-center justify-center text-brand-900"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 border-b border-slate-100 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                        {["Sen","Sel","Rab","Kam","Jum","Sab","Min"].map(d => <div key={d} className="py-3">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7">
                        {monthDays.map((d, i) => {
                            const k = format(d, "yyyy-MM-dd");
                            const dayEvents = eventsByDate[k] || [];
                            const inMonth = isSameMonth(d, cursor);
                            const today = isSameDay(d, new Date());
                            return (
                                <div key={i} className={`min-h-[110px] border-r border-b border-slate-100 p-2 ${!inMonth ? "bg-slate-50/40" : ""}`}>
                                    <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mb-1 ${today ? "gradient-brand text-white" : inMonth ? "text-brand-950" : "text-slate-400"}`}>{format(d, "d")}</div>
                                    <div className="space-y-1">
                                        {dayEvents.map(e => (
                                            <div key={e.id} className="text-[10px] font-semibold rounded px-1.5 py-1 bg-brand-100 text-brand-800 truncate">{e.title}</div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
