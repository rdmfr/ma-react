import React from "react";
import { Award, Target, Flag, Users, BookOpenText, Heart, ShieldCheck } from "lucide-react";
import { useBranding } from "../../context/BrandingContext";
import { PageHeader } from "../../components/shared/Primitives";

export default function Profil() {
    const { branding } = useBranding();
    const values = [
        { icon: Heart, title: "Akhlakul Karimah", desc: "Membentuk karakter dan budi pekerti luhur sesuai ajaran Islam." },
        { icon: BookOpenText, title: "Keilmuan Kuat", desc: "Integrasi ilmu agama, umum, dan teknologi." },
        { icon: Users, title: "Kolaboratif", desc: "Membangun semangat gotong royong dalam berkarya." },
        { icon: ShieldCheck, title: "Berintegritas", desc: "Jujur, amanah, dan bertanggung jawab." },
    ];
    const organ = [
        { name: "Ahmad Fauzi, M.Pd", role: "Kepala Madrasah", photo: "https://images.unsplash.com/photo-1515994034738-1f437c226687?w=300&q=80" },
        { name: "Siti Nurhaliza, S.Pd", role: "Wakamad Kurikulum", photo: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=300&q=80" },
        { name: "Dewi Kartika, S.Si", role: "Wakamad Kesiswaan", photo: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300&q=80" },
        { name: "Rahmat Hidayat, Lc", role: "Wakamad Hubmas", photo: "https://images.unsplash.com/photo-1545696968-1a5245650b36?w=300&q=80" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="profil-page">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-5 lg:sticky lg:top-28">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700"><span className="inline-block w-8 h-px bg-brand-500 mr-2 align-middle" />Tentang Kami</div>
                    <h1 className="font-display text-5xl lg:text-6xl font-black text-brand-950 mt-4 tracking-tight leading-[0.95]">Madrasah <span className="font-editorial italic text-brand-700">berakhlak</span> & berprestasi.</h1>
                    <p className="mt-6 text-brand-800/85 leading-relaxed">{branding.schoolName} berdiri sejak 1998, tumbuh sebagai madrasah aliyah berakreditasi A di Kab. Pemalang, Jawa Tengah. Kami menggabungkan tradisi keilmuan Islam klasik dengan pendekatan pendidikan modern untuk mencetak lulusan yang siap berkontribusi di manapun.</p>
                    <div className="mt-8 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-white border border-slate-100 p-4 card-lift"><div className="font-display font-black text-2xl text-brand-950">1998</div><div className="text-xs text-slate-600 mt-1">Berdiri</div></div>
                        <div className="rounded-2xl bg-white border border-slate-100 p-4 card-lift"><div className="font-display font-black text-2xl text-brand-950">A</div><div className="text-xs text-slate-600 mt-1">Akreditasi</div></div>
                        <div className="rounded-2xl bg-white border border-slate-100 p-4 card-lift"><div className="font-display font-black text-2xl text-brand-950">842+</div><div className="text-xs text-slate-600 mt-1">Siswa</div></div>
                    </div>
                </div>
                <div className="lg:col-span-7 space-y-6">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&q=80" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white rounded-3xl p-8 border border-slate-100">
                        <div className="flex items-center gap-3 mb-4"><Target className="w-5 h-5 text-brand-700" /><span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Visi</span></div>
                        <p className="font-display text-2xl font-extrabold text-brand-950 leading-tight">"Terwujudnya madrasah unggul dalam prestasi, berlandaskan iman dan takwa, berakhlakul karimah, serta berjiwa kompetitif global."</p>
                    </div>
                    <div className="bg-brand-950 text-white rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-brand-500/20 blur-3xl" />
                        <div className="flex items-center gap-3 mb-4 relative"><Flag className="w-5 h-5 text-brand-300" /><span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-300">Misi</span></div>
                        <ul className="space-y-3 relative text-brand-100">
                            {["Menyelenggarakan pendidikan yang terintegrasi antara ilmu agama dan umum.","Menumbuhkan budaya literasi dan riset bagi warga madrasah.","Mengembangkan potensi siswa melalui kegiatan kurikuler, ko-kurikuler, dan ekstrakurikuler.","Membangun lingkungan madrasah yang islami, sehat, dan ramah lingkungan."].map((m, i) => (
                                <li key={i} className="flex gap-3"><span className="w-7 h-7 rounded-full bg-brand-500/30 text-brand-300 flex items-center justify-center text-xs font-bold shrink-0">{i+1}</span>{m}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-24">
                <div className="text-center max-w-2xl mx-auto">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Nilai Kami</div>
                    <h2 className="font-display text-4xl font-extrabold text-brand-950 mt-3 tracking-tight">Empat pilar yang kami junjung tinggi.</h2>
                </div>
                <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {values.map((v) => (
                        <div key={v.title} className="bg-white rounded-3xl p-6 border border-slate-100 card-lift">
                            <div className="w-12 h-12 rounded-2xl gradient-brand text-white flex items-center justify-center"><v.icon className="w-5 h-5" /></div>
                            <div className="font-display font-bold text-lg text-brand-950 mt-4">{v.title}</div>
                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-24">
                <div className="text-center max-w-2xl mx-auto">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Struktur Organisasi</div>
                    <h2 className="font-display text-4xl font-extrabold text-brand-950 mt-3 tracking-tight">Dipimpin oleh pendidik berpengalaman.</h2>
                </div>
                <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {organ.map((o) => (
                        <div key={o.name} className="bg-white rounded-3xl overflow-hidden border border-slate-100 card-lift">
                            <div className="aspect-square overflow-hidden"><img src={o.photo} alt={o.name} className="w-full h-full object-cover" /></div>
                            <div className="p-5">
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">{o.role}</div>
                                <div className="font-display font-bold text-brand-950 mt-1">{o.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
