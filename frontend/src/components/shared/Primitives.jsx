import React from "react";

export const SectionHeader = ({ eyebrow, title, description, align = "left", actions, className = "" }) => (
    <div className={`${align === "center" ? "text-center mx-auto max-w-3xl" : ""} ${className}`}>
        <div className={`flex ${align === "center" ? "justify-center" : ""} ${actions ? "items-start justify-between flex-wrap gap-4" : ""}`}>
            <div className={align === "center" ? "" : "flex-1 min-w-0"}>
                {eyebrow && (
                    <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 mb-3 ${align === "center" ? "" : ""}`}>
                        <span className="w-8 h-px bg-brand-500" />{eyebrow}
                    </div>
                )}
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-950 tracking-tight leading-[1.05]">{title}</h2>
                {description && <p className="mt-4 text-brand-800/80 text-base sm:text-lg max-w-2xl leading-relaxed">{description}</p>}
            </div>
            {actions}
        </div>
    </div>
);

export const StatusBadge = ({ status }) => {
    const map = {
        pending:    { label: "Menunggu", cls: "bg-amber-100 text-amber-800 ring-amber-200" },
        approved:   { label: "Disetujui", cls: "bg-emerald-100 text-emerald-800 ring-emerald-200" },
        rejected:   { label: "Ditolak", cls: "bg-red-100 text-red-800 ring-red-200" },
        draft:      { label: "Draft", cls: "bg-slate-100 text-slate-700 ring-slate-200" },
        Aktif:      { label: "Aktif", cls: "bg-emerald-100 text-emerald-800 ring-emerald-200" },
        Nonaktif:   { label: "Nonaktif", cls: "bg-slate-100 text-slate-600 ring-slate-200" },
        Alumni:     { label: "Alumni", cls: "bg-blue-100 text-blue-800 ring-blue-200" },
        Diterima:   { label: "Diterima", cls: "bg-emerald-100 text-emerald-800 ring-emerald-200" },
        Proses:     { label: "Proses", cls: "bg-amber-100 text-amber-800 ring-amber-200" },
        Wawancara:  { label: "Wawancara", cls: "bg-blue-100 text-blue-800 ring-blue-200" },
    };
    const v = map[status] || { label: status, cls: "bg-slate-100 text-slate-700 ring-slate-200" };
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ${v.cls}`}>{v.label}</span>;
};

export const StatCard = ({ label, value, hint, icon: Icon, trend, accent }) => (
    <div className="group relative bg-white rounded-2xl p-6 border border-slate-100 card-lift" data-testid="stat-card">
        <div className="flex items-start justify-between">
            <div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</div>
                <div className="font-display text-3xl font-extrabold text-brand-950 mt-2 tracking-tight">{value}</div>
                {hint && <div className="text-xs text-slate-500 mt-2">{hint}</div>}
                {trend && <div className={`text-xs font-semibold mt-1 ${trend.startsWith("+") ? "text-emerald-700" : "text-red-600"}`}>{trend}</div>}
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent || "bg-brand-50 text-brand-700"}`}>
                {Icon && <Icon className="w-5 h-5" />}
            </div>
        </div>
    </div>
);

export const EmptyState = ({ title = "Belum ada data", description = "Data akan muncul di sini.", icon: Icon, action }) => (
    <div className="bg-white border border-dashed border-brand-200 rounded-2xl p-10 text-center" data-testid="empty-state">
        {Icon && <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4"><Icon className="w-6 h-6" /></div>}
        <h3 className="font-display font-bold text-brand-950 text-lg">{title}</h3>
        <p className="text-sm text-slate-600 mt-1.5 max-w-md mx-auto">{description}</p>
        {action && <div className="mt-4">{action}</div>}
    </div>
);

export const DownloadButton = ({ size = "2.4 MB", count = 0, label = "Download", onClick, className = "" }) => (
    <button onClick={onClick} data-testid="download-btn" className={`inline-flex items-center gap-3 rounded-xl bg-white border border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-900 hover:bg-brand-50 hover:border-brand-400 transition group ${className}`}>
        <span className="w-8 h-8 rounded-lg gradient-brand text-white flex items-center justify-center group-hover:scale-110 transition">↓</span>
        <span className="flex-1 text-left">
            {label}
            <span className="block text-[11px] text-slate-500 font-medium">{size} · {count.toLocaleString()} unduhan</span>
        </span>
    </button>
);

export const GradientBadge = ({ children, className = "" }) => (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-800 bg-brand-100/70 ring-1 ring-brand-200 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />{children}
    </span>
);

export const PageHeader = ({ title, description, breadcrumbs, actions }) => (
    <div className="mb-8" data-testid="page-header">
        {breadcrumbs && (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                {breadcrumbs.map((c, i) => (
                    <React.Fragment key={c}>
                        <span className={i === breadcrumbs.length - 1 ? "text-brand-800" : ""}>{c}</span>
                        {i !== breadcrumbs.length - 1 && <span>/</span>}
                    </React.Fragment>
                ))}
            </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
                <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-brand-950 tracking-tight">{title}</h1>
                {description && <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
        </div>
    </div>
);
