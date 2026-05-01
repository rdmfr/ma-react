import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const DEFAULT_BRANDING = {
    schoolName: "MAS YPI Pulosari",
    schoolShort: "MA-Pulosari",
    schoolTagline: "Madrasah Aliyah Berkarakter, Berilmu, Berakhlak",
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23064e3b'/><stop offset='1' stop-color='%2310b981'/></linearGradient></defs><circle cx='50' cy='50' r='46' fill='url(%23g)'/><path d='M50 20 L72 35 L72 65 L50 80 L28 65 L28 35 Z' fill='none' stroke='white' stroke-width='3'/><text x='50' y='58' text-anchor='middle' font-family='serif' font-weight='bold' font-size='22' fill='white'>MA</text></svg>",
    address: "Jl. Raya Pulosari No. 12, Kec. Pulosari, Kab. Pemalang, Jawa Tengah 52365",
    email: "info@mapulosari.sch.id",
    phone: "(0284) 3274xxx",
    instagram: "@mapulosari",
    facebook: "MA Pulosari Official",
    youtube: "MA Pulosari",
    mapEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=109.3%2C-7.1%2C109.5%2C-7.0&layer=mapnik",
    accentColor: "#10b981",
    darkColor: "#064e3b",
};

const STORAGE_KEY = "ma_pulosari_branding_v3";
const BrandingContext = createContext(null);

export const BrandingProvider = ({ children }) => {
    const [branding, setBranding] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return { ...DEFAULT_BRANDING, ...JSON.parse(raw) };
        } catch (e) { /* noop */ }
        return DEFAULT_BRANDING;
    });

    useEffect(() => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(branding)); } catch (e) { /* noop */ }
    }, [branding]);

    const updateBranding = useCallback((patch) => {
        setBranding((prev) => ({ ...prev, ...patch }));
    }, []);

    const resetBranding = useCallback(() => {
        setBranding(DEFAULT_BRANDING);
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* noop */ }
    }, []);

    return (
        <BrandingContext.Provider value={{ branding, updateBranding, resetBranding }}>
            {children}
        </BrandingContext.Provider>
    );
};

export const useBranding = () => {
    const ctx = useContext(BrandingContext);
    if (!ctx) throw new Error("useBranding must be used within BrandingProvider");
    return ctx;
};
