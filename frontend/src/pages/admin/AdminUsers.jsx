import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, MoreVertical, Pencil, Trash2, UserCog } from "lucide-react";
import { PageHeader, StatusBadge } from "../../components/shared/Primitives";
import { users } from "../../data/mockData";
import { toast } from "sonner";
import { apiAdminCreateUser, apiAdminDeleteUser, apiAdminListUsers, apiAdminUpdateUser, TOKEN_STORAGE_KEY } from "../../lib/backend";

export default function AdminUsers() {
    const [q, setQ] = useState("");
    const [items, setItems] = useState(users);
    const [editor, setEditor] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", role: "teacher", status: "active", password: "", avatar_url: "" });

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (!token) return;
        apiAdminListUsers()
            .then((list) => { if (Array.isArray(list) && list.length > 0) setItems(list); })
            .catch(() => {});
    }, []);

    const filtered = useMemo(
        () => (items || []).filter(u => (u.name || "").toLowerCase().includes(q.toLowerCase()) || (u.email || "").toLowerCase().includes(q.toLowerCase())),
        [items, q]
    );

    const openCreate = () => {
        setForm({ name: "", email: "", role: "teacher", status: "active", password: "", avatar_url: "" });
        setEditor({ mode: "create" });
    };
    const openEdit = (u) => {
        setForm({ name: u.name || "", email: u.email || "", role: u.role || "teacher", status: u.status || "active", password: "", avatar_url: u.avatar || u.avatar_url || "" });
        setEditor({ mode: "edit", item: u });
    };

    const save = async () => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (!token) {
            toast.error("Silakan login dulu");
            return;
        }

        try {
            if (editor.mode === "create") {
                const created = await apiAdminCreateUser({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role,
                    status: form.status,
                    avatar_url: form.avatar_url || undefined,
                });
                setItems((prev) => [created, ...(prev || [])]);
                toast.success("Pengguna berhasil dibuat");
                setEditor(null);
                return;
            }

            const id = editor.item?.id;
            const updated = await apiAdminUpdateUser(id, {
                name: form.name,
                email: form.email,
                password: form.password || undefined,
                role: form.role,
                status: form.status,
                avatar_url: form.avatar_url || undefined,
            });
            setItems((prev) => (prev || []).map((x) => (x.id === id ? updated : x)));
            toast.success("Pengguna berhasil diperbarui");
            setEditor(null);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Gagal menyimpan");
        }
    };

    return (
        <div data-testid="admin-users">
            <PageHeader title="Manajemen Pengguna" description="Kelola akun admin, guru, dan OSIS." breadcrumbs={["Admin", "Pengguna"]}
                actions={<button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-2.5 text-sm font-bold shadow-lg shadow-brand-900/20" data-testid="users-add"><Plus className="w-4 h-4" />Tambah Pengguna</button>} />
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex gap-3 flex-col sm:flex-row">
                    <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4">
                        <Search className="w-4 h-4 text-slate-500" />
                        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari pengguna..." className="flex-1 py-2.5 bg-transparent outline-none text-sm" data-testid="users-search" />
                    </div>
                    <select className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none"><option>Semua Role</option><option>Admin</option><option>Guru</option><option>OSIS</option></select>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-slate-50/50">
                        <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                            <th className="px-6 py-3">Nama</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Login Terakhir</th><th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map(u => (
                            <tr key={u.id} className="hover:bg-brand-50/30" data-testid={`user-row-${u.id}`}>
                                <td className="px-6 py-4 font-semibold text-brand-950">{u.name}</td>
                                <td className="px-6 py-4 text-slate-700">{u.email}</td>
                                <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-brand-100 text-brand-800 rounded-full px-2.5 py-0.5"><UserCog className="w-3 h-3" />{u.role}</span></td>
                                <td className="px-6 py-4"><StatusBadge status={u.status} /></td>
                                <td className="px-6 py-4 text-slate-600 text-xs">{u.lastLogin}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="inline-flex items-center gap-1">
                                        <button onClick={() => openEdit(u)} className="w-8 h-8 rounded-lg hover:bg-brand-50 text-brand-700 flex items-center justify-center" data-testid={`user-edit-${u.id}`}><Pencil className="w-3.5 h-3.5" /></button>
                                        <button
                                            onClick={async () => {
                                                const token = localStorage.getItem(TOKEN_STORAGE_KEY);
                                                if (!token) {
                                                    toast.error("Silakan login dulu");
                                                    return;
                                                }
                                                try {
                                                    await apiAdminDeleteUser(u.id);
                                                    setItems((prev) => (prev || []).filter((x) => x.id !== u.id));
                                                    toast.success("Pengguna dihapus");
                                                } catch (err) {
                                                    toast.error(err?.response?.data?.message || err.message || "Gagal menghapus");
                                                }
                                            }}
                                            className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up" onClick={() => setEditor(null)}>
                    <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">{editor.mode === "create" ? "Tambah Pengguna" : "Edit Pengguna"}</div>
                                <h3 className="font-display font-extrabold text-2xl text-brand-950 mt-0.5">{form.name || "Pengguna"}</h3>
                            </div>
                            <button onClick={() => setEditor(null)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><MoreVertical className="w-4 h-4 rotate-90" /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Nama</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-brand-950">Role</label>
                                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                                        <option value="admin">admin</option>
                                        <option value="teacher">teacher</option>
                                        <option value="osis">osis</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-brand-950">Status</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                                        <option value="active">active</option>
                                        <option value="inactive">inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-brand-950">Password {editor.mode === "edit" ? "(opsional)" : ""}</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                                <div><label className="text-sm font-semibold text-brand-950">Avatar URL (opsional)</label><input value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            </div>
                        </div>
                        <div className="px-7 py-4 border-t border-slate-100 flex gap-3">
                            <button onClick={() => setEditor(null)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button onClick={save} className="flex-1 rounded-xl gradient-brand text-white py-3 text-sm font-bold">Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
