import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { apiLogin, apiLogout, TOKEN_STORAGE_KEY } from "../lib/backend";
import { initDashboardData } from "../data/mockData";

const AuthContext = createContext(null);
const STORAGE_KEY = "ma_pulosari_auth_v1";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    });

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (!user || !token) return;
        initDashboardData().catch(() => {});
    }, [user]);

    const login = useCallback(async (email, password) => {
        const { token, user: u } = await apiLogin(email, password);
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        setUser(u);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        await initDashboardData();
        return u;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        apiLogout().catch(() => {});
    }, []);

    const updateUser = useCallback((u) => {
        setUser(u);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

export const DEMO_CREDENTIALS = [
    { role: "Admin", email: "admin@mapulosari.sch.id", password: "admin123" },
    { role: "Guru", email: "guru@mapulosari.sch.id", password: "guru123" },
    { role: "OSIS", email: "osis@mapulosari.sch.id", password: "osis123" },
];
