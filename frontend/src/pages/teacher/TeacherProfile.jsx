import React, { useRef, useState } from "react";
import { Save, Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/shared/Primitives";
import { useAuth } from "../../context/AuthContext";
import { apiUpdateProfile } from "../../lib/backend";

export default function TeacherProfile() {
    const { user, updateUser } = useAuth();
    const [avatar, setAvatar] = useState(user?.avatar);
    const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", bio: user?.bio || "" });
    const fileRef = useRef(null);
    const onFile = (e) => {
        const f = e.target.files?.[0]; if (!f) return;
        const r = new FileReader();
        r.onload = () => { setAvatar(r.result); toast.success("Foto profil diperbarui"); };
        r.readAsDataURL(f);
    };
    return (
        <div data-testid="teacher-profile">
            <PageHeader title="Profil Saya" description="Kelola informasi profil Anda." breadcrumbs={["Guru", "Profil"]} />
            <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center">
                        <div className="relative w-32 h-32 mx-auto group">
                            <img src={avatar} alt="" className="w-full h-full rounded-full object-cover border-4 border-brand-100" data-testid="profile-avatar" />
                            <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 w-10 h-10 rounded-full gradient-brand text-white flex items-center justify-center shadow-lg hover:scale-110 transition" data-testid="profile-avatar-upload"><Camera className="w-4 h-4" /></button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
                        </div>
                        <div className="font-display font-extrabold text-xl text-brand-950 mt-5">{form.name}</div>
                        <div className="text-sm text-brand-700 mt-1">{form.email}</div>
                        <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-brand-100 text-brand-800 px-3 py-1 text-xs font-bold uppercase tracking-wider">Guru</div>
                        <button onClick={() => fileRef.current?.click()} className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 px-4 py-2.5 text-xs font-bold text-brand-900 hover:bg-brand-50"><Upload className="w-3.5 h-3.5" />Ganti Foto</button>
                    </div>
                </div>
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
                        <h3 className="font-display font-bold text-xl text-brand-950">Informasi Profil</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className="text-sm font-semibold text-brand-950">Nama Lengkap</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div><label className="text-sm font-semibold text-brand-950">Email</label><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div><label className="text-sm font-semibold text-brand-950">No. HP</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                        </div>
                        <div><label className="text-sm font-semibold text-brand-950">Bio Singkat</label><textarea rows={4} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 resize-none" /></div>
                        <button
                            onClick={async () => {
                                try {
                                    const updated = await apiUpdateProfile({
                                        name: form.name,
                                        email: form.email,
                                        phone: form.phone,
                                        bio: form.bio,
                                        avatar_url: avatar,
                                    });
                                    updateUser(updated);
                                    toast.success("Profil diperbarui");
                                } catch (err) {
                                    toast.error(err?.response?.data?.message || err.message || "Gagal memperbarui profil");
                                }
                            }}
                            className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-6 py-3 text-sm font-bold"
                        >
                            <Save className="w-4 h-4" />Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
