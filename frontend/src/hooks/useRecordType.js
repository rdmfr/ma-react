import { useCallback, useEffect, useState } from "react";
import { apiCreateRecord, apiDeleteRecord, apiListRecords, apiUpdateRecord, TOKEN_STORAGE_KEY } from "../lib/backend";

export function useRecordType(type, initialItems) {
    const [items, setItems] = useState(() => (Array.isArray(initialItems) ? initialItems : []));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const refresh = useCallback(async () => {
        const hasToken = !!localStorage.getItem(TOKEN_STORAGE_KEY);
        if (!hasToken) return;
        setLoading(true);
        setError("");
        try {
            const list = await apiListRecords(type);
            setItems(Array.isArray(list) ? list : []);
        } catch (e) {
            setError(e?.response?.data?.message || e.message || "Gagal memuat data");
        } finally {
            setLoading(false);
        }
    }, [type]);

    useEffect(() => {
        refresh().catch(() => {});
    }, [refresh]);

    const createItem = useCallback(async (data) => {
        const created = await apiCreateRecord(type, data);
        setItems((prev) => [created, ...(prev || [])]);
        return created;
    }, [type]);

    const updateItem = useCallback(async (id, data) => {
        const updated = await apiUpdateRecord(id, data);
        setItems((prev) => (prev || []).map((x) => (x.id === id ? updated : x)));
        return updated;
    }, []);

    const deleteItem = useCallback(async (id) => {
        await apiDeleteRecord(id);
        setItems((prev) => (prev || []).filter((x) => x.id !== id));
    }, []);

    const hasToken = !!localStorage.getItem(TOKEN_STORAGE_KEY);
    return { items, setItems, loading, error, refresh, createItem, updateItem, deleteItem, hasToken };
}
