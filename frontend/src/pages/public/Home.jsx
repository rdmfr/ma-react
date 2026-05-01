import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CalendarDays, Sparkles, Trophy, Users, BookOpen, ShieldCheck, Play, Quote, Heart, MapPin, Star } from "lucide-react";
import { useBranding } from "../../context/BrandingContext";
import { news, events, teachers, programStudies, alumni, stats } from "../../data/mockData";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const ICONS = { Users, GraduationCap: Users, Trophy, ShieldCheck };

export default function Home() {
    const { branding } = useBranding();
    const featuredNews = news.filter(n => !n.status || n.status === "approved").slice(0, 3);
    const upcoming = events.filter(e => !e.status || e.status === "approved").slice(0, 4);
    const featuredTeachers = teachers.filter(t => (!t.status || t.status === "approved") && t.is_featured).slice(0, 4);

    return (
        <div data-testid="home-page">
            {/* HERO */}
            <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 text-white">
                <div className="absolute inset-0 noise-overlay opacity-30" />
                <div className="absolute top-40 -right-28 w-[30rem] h-[30rem] rounded-full bg-brand-400/20 blur-3xl" />
                <div className="absolute -bottom-40 -left-32 w-[32rem] h-[32rem] rounded-full bg-emerald-300/10 blur-3xl" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-28">
                    <div className="grid lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7 animate-fade-up">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide">
                                <Sparkles className="w-3.5 h-3.5 text-brand-300" />
                                PPDB 2025/2026 Telah Dibuka
                                <Link to="/ppdb" className="text-brand-300 hover:text-white inline-flex items-center gap-1">Daftar <ArrowUpRight className="w-3 h-3" /></Link>
                            </div>
                            <h1 className="font-display mt-6 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] text-white">
                                Tumbuh cerdas,<br />berakhlak di <span className="font-editorial italic font-semibold text-brand-300 whitespace-nowrap">{branding.schoolShort}</span>.
                            </h1>
                            <p className="mt-6 text-base sm:text-lg text-brand-100/85 max-w-xl leading-relaxed">
                                {branding.schoolName} adalah madrasah berakreditasi A yang memadukan keilmuan modern dengan nilai-nilai Islam — membentuk generasi pembelajar sepanjang hayat.
                            </p>
                            <div className="mt-9 flex flex-wrap gap-3">
                                <Link to="/ppdb" data-testid="hero-cta-ppdb" className="inline-flex items-center gap-2 rounded-full bg-white text-brand-950 px-6 py-3.5 text-sm font-bold hover:bg-brand-100 transition">
                                    Daftar Sekarang <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link to="/profil" data-testid="hero-cta-profil" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 backdrop-blur-md px-6 py-3.5 text-sm font-bold hover:bg-white/10 transition">
                                    <Play className="w-3.5 h-3.5" /> Jelajahi Profil
                                </Link>
                            </div>
                            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {stats.map((s) => (
                                    <div key={s.label} className="glass-dark rounded-2xl p-4">
                                        <div className="font-display font-black text-3xl text-white">{s.value}</div>
                                        <div className="text-xs text-brand-300 mt-1 uppercase tracking-wider">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-5 relative">
                            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/30">
                                <img src="https://images.unsplash.com/photo-1610208322247-18af7775da05?w=900&q=80" alt="Students" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 to-transparent" />
                                <div className="absolute bottom-5 left-5 right-5 glass rounded-2xl p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white">
                                        <Trophy className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-brand-700">Prestasi Terbaru</div>
                                        <div className="text-sm font-semibold text-brand-950">Juara OSN Matematika Provinsi</div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-6 -left-6 w-28 h-28 rounded-3xl glass-dark grid place-items-center rotate-[-8deg]">
                                <div className="text-center">
                                    <div className="font-display font-black text-4xl text-brand-300">A</div>
                                    <div className="text-[10px] uppercase tracking-widest text-brand-200">Akreditasi</div>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 rounded-2xl glass p-4 w-52">
                                <div className="flex -space-x-2 mb-2">
                                    {[12, 45, 33, 27].map((i) => (
                                        <img key={i} src={`https://i.pravatar.cc/60?img=${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                                    ))}
                                </div>
                                <div className="text-xs text-brand-950">
                                    <span className="font-bold">842+ siswa</span> bersama kami tahun ini
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-24 bg-gradient-to-b from-transparent to-[#fbfcf9]" />
            </section>

            {/* BENTO HIGHLIGHTS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5">
                    <div className="md:col-span-6 lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-100 card-lift relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-brand-100/60 blur-2xl" />
                        <div className="relative">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Visi</span>
                            <h3 className="font-display font-extrabold text-3xl text-brand-950 mt-3 leading-tight">Terwujudnya madrasah unggul yang <span className="font-editorial italic text-brand-700">berakhlakul karimah</span>.</h3>
                            <p className="mt-4 text-brand-800/80 leading-relaxed">Berbasis iman, takwa, ilmu pengetahuan, dan teknologi — siap menjadi rahmat bagi sesama.</p>
                            <Link to="/profil" className="mt-6 inline-flex items-center gap-2 font-bold text-brand-700 hover:text-brand-900">Pelajari Misi <ArrowUpRight className="w-4 h-4" /></Link>
                        </div>
                    </div>
                    <div className="md:col-span-3 lg:col-span-5 grid grid-cols-1 gap-5">
                        {programStudies.slice(0, 2).map((p) => (
                            <div key={p.id} className="bg-brand-950 text-white rounded-3xl p-6 card-lift relative overflow-hidden">
                                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-brand-500/30 blur-2xl" />
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-300">Program</span>
                                <div className="font-display font-extrabold text-xl mt-2">{p.name}</div>
                                <p className="text-sm text-brand-200 mt-2 line-clamp-2">{p.description}</p>
                                <Link to="/program-studi" className="mt-4 inline-flex items-center text-brand-300 text-sm font-semibold gap-1">Detail <ArrowRight className="w-3.5 h-3.5" /></Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LATEST NEWS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="flex items-end justify-between gap-6 flex-wrap">
                    <div>
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Berita Terbaru</div>
                        <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-brand-950 mt-3 tracking-tight">Kabar dari madrasah.</h2>
                    </div>
                    <Link to="/berita" className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900">Semua Berita <ArrowUpRight className="w-4 h-4" /></Link>
                </div>
                <div className="mt-10 grid md:grid-cols-3 gap-6">
                    {featuredNews.map((n, i) => (
                        <Link key={n.id} to={`/berita/${n.slug}`} className={`group relative overflow-hidden rounded-3xl ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`} data-testid={`home-news-${n.id}`}>
                            <div className={`aspect-[${i === 0 ? "16/10" : "4/3"}] w-full overflow-hidden relative`}>
                                <img src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/40 to-transparent" />
                            </div>
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <span className="inline-flex self-start items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-950 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 mb-3">{n.category}</span>
                                <h3 className={`font-display font-extrabold text-white ${i === 0 ? "text-2xl sm:text-3xl" : "text-lg"} leading-tight`}>{n.title}</h3>
                                <div className="mt-3 text-xs text-brand-200 font-medium">{format(new Date(n.date), "d MMM yyyy", { locale: idLocale })} · {n.views} dibaca</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* TEACHERS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="flex items-end justify-between gap-6 flex-wrap">
                    <div>
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Guru Unggulan</div>
                        <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-brand-950 mt-3 tracking-tight">Para pendidik berdedikasi.</h2>
                    </div>
                    <Link to="/guru" className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900">Lihat Semua <ArrowUpRight className="w-4 h-4" /></Link>
                </div>
                <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-5">
                    {featuredTeachers.map((t) => (
                        <Link key={t.id} to={`/guru/${t.slug}`} className="group" data-testid={`home-teacher-${t.id}`}>
                            <div className="aspect-[3/4] rounded-3xl overflow-hidden relative bg-brand-100">
                                <img src={t.photo} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-brand-300 font-bold">{t.subject}</div>
                                    <div className="font-display font-bold text-lg leading-tight mt-1">{t.name}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* EVENTS + QUOTE */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="grid lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Agenda Mendatang</div>
                                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-950 mt-2">Catat tanggal penting.</h2>
                            </div>
                            <Link to="/agenda" className="text-sm font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1">Kalender <ArrowUpRight className="w-4 h-4" /></Link>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {upcoming.map((e) => (
                                <div key={e.id} className="flex items-center gap-5 py-4 group">
                                    <div className="w-16 h-16 rounded-2xl gradient-brand text-white flex flex-col items-center justify-center shrink-0">
                                        <div className="text-xs font-bold uppercase">{format(new Date(e.date), "MMM", { locale: idLocale })}</div>
                                        <div className="font-display font-black text-xl leading-none">{format(new Date(e.date), "dd")}</div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-display font-bold text-brand-950">{e.title}</div>
                                        <div className="text-xs text-slate-600 mt-1 flex items-center gap-3"><CalendarDays className="w-3 h-3" /> {e.time} · <MapPin className="w-3 h-3" /> {e.location}</div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 rounded-full px-2.5 py-1">{e.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-5 relative rounded-3xl overflow-hidden bg-brand-950 text-white p-8 lg:p-10 min-h-[400px]">
                        <div className="absolute inset-0 noise-overlay opacity-30" />
                        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl" />
                        <Quote className="w-10 h-10 text-brand-400 relative" />
                        <p className="font-editorial italic text-2xl sm:text-3xl leading-snug mt-6 relative">
                            "Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya."
                        </p>
                        <div className="mt-6 text-sm text-brand-300 relative">— HR. Bukhari</div>
                        <div className="mt-10 pt-6 border-t border-brand-800 flex items-center gap-4 relative">
                            <img src="https://images.unsplash.com/photo-1515994034738-1f437c226687?w=120&q=80" alt="" className="w-14 h-14 rounded-full object-cover" />
                            <div>
                                <div className="font-display font-bold">{alumni[0].name}</div>
                                <div className="text-xs text-brand-300">Alumni Angkatan {alumni[0].year}</div>
                            </div>
                        </div>
                        <p className="text-sm text-brand-200 leading-relaxed mt-4 relative">{alumni[0].testimonial}</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-10">
                <div className="relative overflow-hidden rounded-[2.5rem] p-10 lg:p-16 gradient-brand text-white">
                    <div className="absolute inset-0 noise-overlay opacity-30" />
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
                    <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-100">Mulai perjalanan ilmu</div>
                            <h2 className="font-display text-4xl sm:text-5xl font-black mt-3 tracking-tight leading-[1.05] text-white">Siap menjadi bagian dari keluarga <span className="font-editorial italic whitespace-nowrap">{branding.schoolShort}</span>?</h2>
                            <p className="text-brand-100/90 mt-5 text-base max-w-lg">Kuota terbatas, beasiswa tersedia untuk siswa berprestasi. Daftar hari ini dan mulai tumbuh bersama kami.</p>
                        </div>
                        <div className="flex flex-wrap gap-3 lg:justify-end">
                            <Link to="/ppdb" data-testid="cta-daftar-ppdb" className="inline-flex items-center gap-2 rounded-full bg-white text-brand-950 px-7 py-4 font-bold hover:bg-brand-100 transition">
                                Daftar PPDB <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link to="/kontak" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 backdrop-blur px-7 py-4 font-bold hover:bg-white/10 transition">
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
