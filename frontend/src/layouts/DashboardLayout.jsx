import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBranding } from "../context/BrandingContext";
import {
    LayoutDashboard, Users, GraduationCap, BookOpenText, CalendarRange, ScrollText, FileBarChart2,
    BookCopy, Newspaper, ShieldCheck, Inbox, Settings, Activity, Bell, LogOut, Search,
    ClipboardCheck, SquareGanttChart, School, Upload, UserPlus, Trophy, Images, Megaphone,
    FileCheck, BookMarked, User as UserIcon, PanelLeftClose, PanelLeft
} from "lucide-react";
import { NotificationDropdown, ProfileDropdown } from "../components/dashboard/Dropdowns";
import { initDashboardData } from "../data/mockData";
import { useHydrationVersion } from "../hooks/useHydrationVersion";

const ICONS = { LayoutDashboard, Users, GraduationCap, BookOpenText, CalendarRange, ScrollText, FileBarChart2, BookCopy, Newspaper, ShieldCheck, Inbox, Settings, Activity, Bell, ClipboardCheck, SquareGanttChart, School, Upload, UserPlus, Trophy, Images, Megaphone, FileCheck, BookMarked, UserIcon };

const ADMIN_NAV = [
    { section: "Umum", items: [
        { to: "/admin", label: "Ikhtisar", icon: "LayoutDashboard", end: true },
        { to: "/admin/approval", label: "Antrian Persetujuan", icon: "ClipboardCheck", badge: 3 },
        { to: "/admin/notifications", label: "Notifikasi", icon: "Bell" },
    ]},
    { section: "Pengguna", items: [
        { to: "/admin/users", label: "Manajemen Pengguna", icon: "Users" },
        { to: "/admin/teachers", label: "Manajemen Guru", icon: "GraduationCap" },
        { to: "/admin/students", label: "Manajemen Siswa", icon: "UserPlus" },
    ]},
    { section: "Akademik", items: [
        { to: "/admin/academic-years", label: "Tahun Ajaran & Kelas", icon: "CalendarRange" },
        { to: "/admin/subjects", label: "Mata Pelajaran", icon: "BookOpenText" },
        { to: "/admin/scores", label: "Nilai", icon: "FileBarChart2" },
        { to: "/admin/report-cards", label: "Rapor", icon: "ScrollText" },
        { to: "/admin/modules", label: "Modul", icon: "BookCopy" },
    ]},
    { section: "Konten", items: [
        { to: "/admin/content", label: "Manajemen Konten", icon: "Newspaper" },
        { to: "/admin/ppdb", label: "PPDB", icon: "School" },
        { to: "/admin/messages", label: "Pesan Masuk", icon: "Inbox" },
    ]},
    { section: "Sistem", items: [
        { to: "/admin/settings", label: "Pengaturan & Branding", icon: "Settings" },
        { to: "/admin/activity", label: "Log Aktivitas", icon: "Activity" },
    ]},
];

const TEACHER_NAV = [
    { section: "Mengajar", items: [
        { to: "/teacher", label: "Ikhtisar", icon: "LayoutDashboard", end: true },
        { to: "/teacher/classes", label: "Kelas Saya", icon: "GraduationCap" },
        { to: "/teacher/scores", label: "Input Nilai", icon: "FileBarChart2" },
        { to: "/teacher/evaluations", label: "Jadwal Evaluasi", icon: "CalendarRange" },
    ]},
    { section: "Konten", items: [
        { to: "/teacher/modules", label: "Unggah Modul", icon: "Upload" },
        { to: "/teacher/submissions", label: "Submisi Konten", icon: "FileCheck" },
    ]},
    { section: "Akun", items: [
        { to: "/teacher/profile", label: "Profil Saya", icon: "UserIcon" },
    ]},
];

const OSIS_NAV = [
    { section: "Beranda", items: [
        { to: "/osis", label: "Ikhtisar", icon: "LayoutDashboard", end: true },
    ]},
    { section: "Submisi", items: [
        { to: "/osis/extra", label: "Ekstrakurikuler", icon: "Trophy" },
        { to: "/osis/works", label: "Karya Siswa", icon: "BookMarked" },
        { to: "/osis/events", label: "Usulan Acara", icon: "CalendarRange" },
        { to: "/osis/gallery", label: "Galeri Kegiatan", icon: "Images" },
        { to: "/osis/announcements", label: "Draft Pengumuman", icon: "Megaphone" },
    ]},
    { section: "Akun", items: [
        { to: "/osis/profile", label: "Profil Saya", icon: "UserIcon" },
    ]},
];

const ROLE_NAV = { admin: ADMIN_NAV, teacher: TEACHER_NAV, osis: OSIS_NAV };
const ROLE_LABEL = { admin: "Administrator", teacher: "Guru", osis: "OSIS" };

export default function DashboardLayout({ requiredRole }) {
    const { user, logout } = useAuth();
    const { branding } = useBranding();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [searchVal, setSearchVal] = useState("");
    const v = useHydrationVersion("dashboard");

    const redirectToLogin = !user;
    const redirectToRole = !!user && !!requiredRole && user.role !== requiredRole;

    useEffect(() => {
        if (!user) return;
        if (redirectToRole) return;
        if (process.env.REACT_APP_USE_MOCK_DATA === "true") return;
        let cancelled = false;
        const refresh = async () => {
            if (cancelled) return;
            await initDashboardData();
        };
        const onVis = () => {
            if (document.visibilityState === "visible") refresh().catch(() => {});
        };
        document.addEventListener("visibilitychange", onVis);
        window.addEventListener("focus", onVis);
        return () => {
            cancelled = true;
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener("focus", onVis);
        };
    }, [user, redirectToRole]);

    if (redirectToLogin) return <Navigate to="/login" replace />;
    if (redirectToRole) return <Navigate to={`/${user.role}`} replace />;

    const nav = ROLE_NAV[user.role] || [];

    const onLogout = () => { logout(); navigate("/"); };
    const onSearch = (e) => { if (e.key === "Enter" && searchVal.trim()) { navigate(`/search?q=${encodeURIComponent(searchVal)}`); } };

    return (
        <div className="flex h-screen bg-[#f4f5f1] overflow-hidden">
            <aside className={`${collapsed ? "w-20" : "w-72"} transition-all duration-300 shrink-0 bg-brand-950 text-brand-100 flex flex-col relative`} data-testid="dashboard-sidebar">
                <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                <div className={`relative h-20 flex items-center gap-3 ${collapsed ? "justify-center px-0" : "px-5"} border-b border-brand-900`}>
                    <div className="w-11 h-11 rounded-xl bg-white p-1.5 shrink-0"><img src={branding.logoUrl} alt={branding.schoolName} className="w-full h-full object-contain" /></div>
                    {!collapsed && (
                        <div className="leading-tight overflow-hidden">
                            <div className="font-display font-extrabold text-white truncate">{branding.schoolName}</div>
                            <div className="text-[11px] text-brand-400 uppercase tracking-wider">{ROLE_LABEL[user.role]} Panel</div>
                        </div>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto thin-scroll py-4 px-3 space-y-6 relative">
                    {nav.map((group) => (
                        <div key={group.section}>
                            {!collapsed && <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-400">{group.section}</div>}
                            <div className="space-y-1">
                                {group.items.map((it) => {
                                    const Icon = ICONS[it.icon] || LayoutDashboard;
                                    return (
                                        <NavLink key={it.to} to={it.to} end={it.end}
                                            className={({ isActive }) => `group relative flex items-center gap-3 rounded-xl transition-all ${collapsed ? "justify-center px-3 py-3" : "px-3 py-2.5"} ${isActive ? "bg-gradient-to-r from-brand-600/30 to-brand-500/10 text-white border border-brand-500/30" : "text-brand-200 hover:text-white hover:bg-brand-900/60"}`}
                                            data-testid={`nav-${it.label.replace(/\s+/g, '-').toLowerCase()}`}>
                                            {({ isActive }) => (
                                                <>
                                                    {isActive && !collapsed && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-brand-400" />}
                                                    <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-brand-400" : ""}`} />
                                                    {!collapsed && <span className="text-sm font-medium flex-1 truncate">{it.label}</span>}
                                                    {!collapsed && it.badge && (
                                                        <span className="text-[10px] font-bold bg-brand-500 text-brand-950 rounded-full px-1.5 py-0.5 min-w-5 text-center">{it.badge}</span>
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={`relative border-t border-brand-900 p-3 ${collapsed ? "flex justify-center" : ""}`}>
                    <button onClick={onLogout} className={`${collapsed ? "w-12 h-12 rounded-xl" : "w-full px-3 py-2.5 rounded-xl"} bg-brand-900/50 hover:bg-red-500/20 text-brand-200 hover:text-red-300 flex items-center gap-3 transition`} data-testid="sidebar-logout-btn">
                        <LogOut className="w-4 h-4 shrink-0" />
                        {!collapsed && <span className="text-sm font-semibold">Keluar</span>}
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 shrink-0 glass border-b border-white/60 px-6 lg:px-8 flex items-center justify-between gap-4" data-testid="dashboard-topbar">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setCollapsed(!collapsed)} className="w-10 h-10 rounded-xl border border-brand-100 bg-white hover:bg-brand-50 flex items-center justify-center text-brand-900" data-testid="sidebar-toggle-btn">
                            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                        </button>
                        <div className="hidden md:flex items-center gap-2 bg-white border border-brand-100 rounded-xl px-4 py-2.5 w-96">
                            <Search className="w-4 h-4 text-brand-600" />
                            <input value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyDown={onSearch} placeholder="Cari apa saja..." className="bg-transparent flex-1 outline-none text-sm placeholder:text-slate-400" data-testid="topbar-search-input" />
                            <kbd className="text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">⏎</kbd>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationDropdown />
                        <ProfileDropdown user={user} onLogout={onLogout} />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto thin-scroll p-6 lg:p-8 page-enter" data-testid="dashboard-main" key={`${location.pathname}:${v}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
