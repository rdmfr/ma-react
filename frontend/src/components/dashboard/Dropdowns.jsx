import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Check, FileText, Mail, BookOpen, UserPlus, Database, ChevronRight } from "lucide-react";
import { notifications } from "../../data/mockData";

const ICONS = { FileText, Mail, BookOpen, UserPlus, Database };

export function NotificationDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const unread = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)} className="relative w-10 h-10 rounded-xl border border-brand-100 bg-white hover:bg-brand-50 flex items-center justify-center text-brand-900" data-testid="topbar-notif-btn">
                <Bell className="w-4 h-4" />
                {unread > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">{unread}</span>}
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] glass rounded-2xl shadow-xl border border-white/60 overflow-hidden z-50 animate-fade-up" data-testid="notif-dropdown">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <div className="font-display font-bold text-brand-950">Notifikasi</div>
                            <div className="text-xs text-slate-600">{unread} belum dibaca</div>
                        </div>
                        <button className="text-xs font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1"><Check className="w-3 h-3" />Tandai semua</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto thin-scroll">
                        {notifications.map(n => {
                            const Icon = ICONS[n.icon] || Bell;
                            return (
                                <button key={n.id} className={`w-full text-left flex items-center gap-3 px-5 py-3 hover:bg-brand-50/40 transition border-b border-slate-50 ${!n.read ? "bg-brand-50/20" : ""}`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${!n.read ? "gradient-brand text-white" : "bg-slate-100 text-slate-600"}`}><Icon className="w-4 h-4" /></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-brand-950 truncate">{n.title}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{n.time}</div>
                                    </div>
                                    {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                    <Link to="/admin/notifications" onClick={() => setOpen(false)} className="block px-5 py-3 text-center text-sm font-bold text-brand-700 hover:bg-brand-50/60 border-t border-slate-100">Lihat semua →</Link>
                </div>
            )}
        </div>
    );
}

export function ProfileDropdown({ user, onLogout }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const ROLE_LABEL = { admin: "Administrator", teacher: "Guru", osis: "OSIS" };
    const profilePath = user.role === "admin" ? "/admin/settings" : `/${user.role}/profile`;

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)} className="flex items-center gap-3 pl-3 border-l border-brand-100 hover:bg-brand-50/40 rounded-r-xl px-2 py-1.5 transition" data-testid="topbar-profile-btn">
                <div className="text-right leading-tight hidden sm:block">
                    <div className="text-sm font-semibold text-brand-950">{user.name}</div>
                    <div className="text-[11px] text-brand-600 uppercase tracking-wider">{ROLE_LABEL[user.role]}</div>
                </div>
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-brand-200 object-cover" />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-2 w-64 glass rounded-2xl shadow-xl border border-white/60 overflow-hidden z-50 animate-fade-up" data-testid="profile-dropdown">
                    <div className="p-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <img src={user.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-brand-200 object-cover" />
                            <div className="flex-1 min-w-0">
                                <div className="font-display font-bold text-brand-950 truncate">{user.name}</div>
                                <div className="text-xs text-slate-600 truncate">{user.email}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <button onClick={() => { setOpen(false); navigate(profilePath); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-brand-50 text-sm font-semibold text-brand-900 flex items-center justify-between">
                            <span>Profil Saya</span><ChevronRight className="w-3.5 h-3.5 text-brand-500" />
                        </button>
                        <button onClick={() => { setOpen(false); navigate("/"); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-brand-50 text-sm font-semibold text-brand-900 flex items-center justify-between">
                            <span>Lihat Website Publik</span><ChevronRight className="w-3.5 h-3.5 text-brand-500" />
                        </button>
                    </div>
                    <div className="p-2 border-t border-slate-100">
                        <button onClick={onLogout} className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-sm font-semibold text-red-700" data-testid="profile-logout-btn">Keluar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
