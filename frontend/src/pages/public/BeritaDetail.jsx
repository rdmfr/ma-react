import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Eye, User, Share2, Twitter, Facebook, MessageCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { news } from "../../data/mockData";

export default function BeritaDetail() {
    const { slug } = useParams();
    const n = news.find(x => x.slug === slug) || news[0];
    const related = news.filter(x => x.id !== n.id).slice(0, 3);
    const [progress, setProgress] = useState(0);
    const [shareOpen, setShareOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const h = document.documentElement;
            const sc = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
            setProgress(Math.min(100, Math.max(0, sc * 100)));
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const url = typeof window !== "undefined" ? window.location.href : "";
    const copy = () => { navigator.clipboard?.writeText(url); toast.success("Link berhasil disalin"); setShareOpen(false); };

    return (
        <div className="py-14" data-testid="berita-detail-page">
            <div className="read-progress" style={{ width: `${progress}%` }} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/berita" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 mb-6"><ArrowLeft className="w-4 h-4" /> Semua berita</Link>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 rounded-full px-3 py-1">{n.category}</span>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-brand-950 mt-5 tracking-tight leading-[1.02]">{n.title}</h1>
                <div className="flex items-center gap-5 mt-6 text-sm text-slate-600 flex-wrap">
                    <span className="inline-flex items-center gap-2"><User className="w-4 h-4" /> {n.author}</span>
                    <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" /> {format(new Date(n.date), "d MMMM yyyy", { locale: idLocale })}</span>
                    <span className="inline-flex items-center gap-2"><Eye className="w-4 h-4" /> {n.views} dibaca</span>
                </div>
            </div>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="aspect-[16/9] rounded-[2rem] overflow-hidden"><img src={n.image} alt={n.title} className="w-full h-full object-cover" /></div>
            </div>
            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 prose prose-lg prose-emerald">
                {n.content.split("\n\n").map((p, i) => <p key={i} className="text-brand-900/90 leading-relaxed text-lg mb-5">{p}</p>)}
                <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between relative">
                    <span className="text-sm text-slate-600">Bagikan artikel ini</span>
                    <div className="relative">
                        <button onClick={() => setShareOpen(!shareOpen)} className="inline-flex items-center gap-2 rounded-xl border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-brand-50" data-testid="berita-share">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                        {shareOpen && (
                            <div className="absolute right-0 top-full mt-2 glass rounded-2xl shadow-xl border border-white/60 overflow-hidden z-10 animate-fade-up min-w-48" data-testid="share-popover">
                                <a target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(n.title)}&url=${encodeURIComponent(url)}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 text-sm font-semibold text-brand-900"><Twitter className="w-4 h-4 text-brand-700" />Twitter / X</a>
                                <a target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 text-sm font-semibold text-brand-900"><Facebook className="w-4 h-4 text-brand-700" />Facebook</a>
                                <a target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent(n.title + " - " + url)}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 text-sm font-semibold text-brand-900"><MessageCircle className="w-4 h-4 text-brand-700" />WhatsApp</a>
                                <button onClick={copy} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 text-sm font-semibold text-brand-900 border-t border-slate-100"><Copy className="w-4 h-4 text-brand-700" />Salin Link</button>
                            </div>
                        )}
                    </div>
                </div>
            </article>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                <h3 className="font-display text-2xl font-extrabold text-brand-950 mb-6">Berita Terkait</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {related.map((r) => (
                        <Link key={r.id} to={`/berita/${r.slug}`} className="group">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3"><img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div>
                            <h4 className="font-display font-bold text-brand-950 group-hover:text-brand-700 line-clamp-2">{r.title}</h4>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
