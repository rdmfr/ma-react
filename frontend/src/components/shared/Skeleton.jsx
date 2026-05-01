import React from "react";

export const Skeleton = ({ className = "" }) => (
    <div className={`animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] rounded-lg ${className}`} style={{ animation: "shimmer 1.6s linear infinite" }} />
);

export const CardSkeleton = () => (
    <div className="bg-white rounded-3xl border border-slate-100 p-6">
        <Skeleton className="h-40 w-full mb-4" />
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
    </div>
);

export const TableRowSkeleton = ({ cols = 5 }) => (
    <tr>{Array.from({ length: cols }).map((_, i) => (<td key={i} className="px-6 py-4"><Skeleton className="h-4 w-3/4" /></td>))}</tr>
);

export const ListItemSkeleton = () => (
    <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
        </div>
    </div>
);
