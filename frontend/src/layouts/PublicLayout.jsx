import React, { useEffect } from "react";
import Navbar from "../components/public/Navbar";
import Footer from "../components/public/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { initPublicData } from "../data/mockData";
import { useHydrationVersion } from "../hooks/useHydrationVersion";

export default function PublicLayout() {
    const loc = useLocation();
    const v = useHydrationVersion("public");

    useEffect(() => {
        if (process.env.REACT_APP_USE_MOCK_DATA === "true") return;
        let cancelled = false;
        const refresh = async () => {
            if (cancelled) return;
            await initPublicData();
        };
        const onVis = () => {
            if (document.visibilityState === "visible") refresh().catch(() => {});
        };
        document.addEventListener("visibilitychange", onVis);
        window.addEventListener("focus", onVis);
        const t = window.setInterval(() => refresh().catch(() => {}), 15000);
        return () => {
            cancelled = true;
            window.clearInterval(t);
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener("focus", onVis);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#fbfcf9]">
            <Navbar />
            <main className="flex-1 page-enter" key={`${loc.pathname}:${v}`}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
