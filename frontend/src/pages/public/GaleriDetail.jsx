import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, X } from "lucide-react";
import { galleries, galleryPhotos } from "../../data/mockData";

export default function GaleriDetail() {
    const { id } = useParams();
    const g = galleries.find(x => String(x.id) === id) || galleries[0];
    const [open, setOpen] = useState(null);
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="galeri-detail-page">
            <Link to="/galeri" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 mb-6"><ArrowLeft className="w-4 h-4" /> Semua galeri</Link>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display text-4xl lg:text-5xl font-black text-brand-950 tracking-tight">{g.title}</h1>
                    <p className="text-slate-600 mt-2">{g.count} foto · {new Date(g.date).toLocaleDateString("id-ID")}</p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-3 text-sm font-bold" data-testid="galeri-download-zip">
                    <Download className="w-4 h-4" /> Unduh Album (ZIP)
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {galleryPhotos.map((ph, i) => (
                    <button key={i} onClick={() => setOpen(ph)} className="aspect-square rounded-2xl overflow-hidden group relative" data-testid={`galeri-photo-${i}`}>
                        <img src={ph} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </button>
                ))}
            </div>
            {open && (
                <div className="fixed inset-0 bg-brand-950/90 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setOpen(null)} data-testid="galeri-lightbox">
                    <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center" onClick={() => setOpen(null)}><X className="w-4 h-4" /></button>
                    <img src={open} alt="" className="max-w-full max-h-full rounded-2xl" />
                </div>
            )}
        </div>
    );
}
