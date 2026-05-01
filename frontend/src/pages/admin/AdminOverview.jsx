import React from "react";
import { Users, GraduationCap, BookOpenText, ClipboardCheck, TrendingUp, Activity, ArrowUpRight, Bell, Sparkles } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { StatCard, PageHeader } from "../../components/shared/Primitives";
import { approvalQueue, contactMessages, activityLog, news } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";

const studentTrend = [
    { m: "Sep", siswa: 780, baru: 12 },
    { m: "Okt", siswa: 798, baru: 24 },
    { m: "Nov", siswa: 812, baru: 18 },
    { m: "Des", siswa: 820, baru: 15 },
    { m: "Jan", siswa: 832, baru: 22 },
    { m: "Feb", siswa: 842, baru: 24 },
];
const ppdbStats = [
    { jalur: "Reguler", pendaftar: 87 },
    { jalur: "Prestasi", pendaftar: 32 },
    { jalur: "Beasiswa", pendaftar: 18 },
    { jalur: "Pindahan", pendaftar: 10 },
];
const programDist = [
    { name: "MIPA", value: 320, color: "#10b981" },
    { name: "IPS", value: 280, color: "#34d399" },
    { name: "Keagamaan", value: 242, color: "#064e3b" },
];

export default function AdminOverview() {
    const { user } = useAuth();
    const pending = approvalQueue.filter(a => a.status === "pending").length;
    return (
        <div data-testid="admin-overview">
            <div className="relative overflow-hidden rounded-3xl gradient-brand text-white p-8 lg:p-10 mb-8">
                <div className="absolute inset-0 noise-overlay opacity-30" />
                <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
                <div className="relative">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-3 py-1 text-xs font-semibold mb-4"><Sparkles className="w-3 h-3" /> Dashboard Administrator</div>
                    <h1 className="font-display text-3xl lg:text-4xl font-black tracking-tight text-white">Assalamu'alaikum, <span className="font-editorial italic">{user?.name?.split(" ")[0]}</span>.</h1>
                    <p className="text-brand-100/90 mt-2">Ada {pending} pengajuan konten menunggu persetujuan. Mari kita mulai.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Siswa" value="842" icon={Users} trend="+24 bulan ini" accent="bg-emerald-50 text-emerald-700" />
                <StatCard label="Guru Aktif" value="56" icon={GraduationCap} trend="+2 bulan ini" accent="bg-blue-50 text-blue-700" />
                <StatCard label="Berita Publish" value={news.length} icon={BookOpenText} hint="Total konten aktif" accent="bg-amber-50 text-amber-700" />
                <StatCard label="Perlu Persetujuan" value={pending} icon={ClipboardCheck} hint="Antrian review" accent="bg-rose-50 text-rose-700" />
            </div>

            <div className="grid lg:grid-cols-12 gap-6 mb-8">
                <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-1">
                        <div>
                            <h3 className="font-display font-bold text-xl text-brand-950">Tren Siswa</h3>
                            <p className="text-sm text-slate-600 mt-0.5">6 bulan terakhir</p>
                        </div>
                        <div className="text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 inline-flex items-center gap-1"><TrendingUp className="w-3 h-3" />+7.9%</div>
                    </div>
                    <div className="h-72 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={studentTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="m" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                                <Area type="monotone" dataKey="siswa" stroke="#064e3b" strokeWidth={3} fill="url(#g1)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6">
                    <h3 className="font-display font-bold text-xl text-brand-950">Distribusi Program</h3>
                    <p className="text-sm text-slate-600 mt-0.5">Peminatan siswa</p>
                    <div className="h-56 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={programDist} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
                                    {programDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                        {programDist.map(d => (
                            <div key={d.name} className="flex items-center justify-between text-sm">
                                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: d.color }} /><span className="text-brand-900 font-semibold">{d.name}</span></span>
                                <span className="text-slate-600 font-mono">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 mb-8">
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6">
                    <h3 className="font-display font-bold text-xl text-brand-950">Pendaftar PPDB per Jalur</h3>
                    <p className="text-sm text-slate-600 mt-0.5">Tahun ajaran 2025/2026</p>
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ppdbStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="jalur" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} cursor={{ fill: "#10b98120" }} />
                                <Bar dataKey="pendaftar" fill="#10b981" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="lg:col-span-5 bg-brand-950 text-white rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-brand-500/30 blur-3xl" />
                    <h3 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2 relative"><Activity className="w-4 h-4 text-brand-300" />Aktivitas Terkini</h3>
                    <div className="space-y-3 relative text-sm">
                        {activityLog.map(l => (
                            <div key={l.id} className="flex gap-3 text-brand-200 p-2 rounded-lg hover:bg-white/5">
                                <span className="text-[10px] font-bold bg-brand-500/20 text-brand-300 rounded px-2 py-0.5 uppercase shrink-0 h-fit">{l.action}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs truncate">{l.target}</div>
                                    <div className="text-[10px] text-brand-400/80 mt-0.5">{l.user}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-display font-bold text-xl text-brand-950">Antrian Persetujuan</h3>
                            <p className="text-sm text-slate-600 mt-0.5">Konten terbaru yang perlu Anda tinjau.</p>
                        </div>
                        <button className="text-sm font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1">Lihat semua <ArrowUpRight className="w-4 h-4" /></button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {approvalQueue.slice(0, 5).map(a => (
                            <div key={a.id} className="flex items-center gap-4 py-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center text-xs font-bold">{a.type.slice(0,2).toUpperCase()}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-brand-950 truncate">{a.title}</div>
                                    <div className="text-xs text-slate-600">{a.submittedBy} · {a.date}</div>
                                </div>
                                <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${a.status === "pending" ? "bg-amber-100 text-amber-800" : a.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{a.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6">
                    <h3 className="font-display font-bold text-brand-950 mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-brand-700" />Pesan Terbaru</h3>
                    <div className="space-y-3">
                        {contactMessages.slice(0, 4).map(m => (
                            <div key={m.id} className={`p-3 rounded-xl ${m.read ? "" : "bg-brand-50/40"}`}>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-brand-950">{m.name}</span>
                                    {!m.read && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                                </div>
                                <div className="text-xs text-slate-600 mt-0.5 truncate">{m.subject}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
