import React from "react";
import Navbar from "../components/public/Navbar";
import Footer from "../components/public/Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function PublicLayout() {
    const loc = useLocation();
    return (
        <div className="min-h-screen flex flex-col bg-[#fbfcf9]">
            <Navbar />
            <main className="flex-1 page-enter" key={loc.pathname}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
