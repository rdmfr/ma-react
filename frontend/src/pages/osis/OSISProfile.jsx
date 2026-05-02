import React, { useRef, useState } from "react";
import { Save, Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/shared/Primitives";
import { useAuth } from "../../context/AuthContext";
import { apiUpdateProfile, apiUploadAvatar } from "../../lib/backend";

export default function OSISProfile() {
    const { user, updateUser } = useAuth();
    const [avatar, setAvatar] = useState(user?.avatar);
    const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", class: user?.class || "XI IPA 1", position: user?.position || "Ketua OSIS" });
    const fileRef = useRef(null);
    const onFile = (e) => {
        const f = e.target.files?.[0]; if (!f) return;
        apiUploadAvatar(f)
            .then((updated) => {
                updateUser(updated);
                setAvatar(updated?.avatar);
                toast.success("Foto profil diperbarui");
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || err.message || "Gagal mengunggah foto");
            });
    };
    return (
        <div data-testid="osis-profile">
            <PageHeader title="Profil Saya" description="Kelola informasi profil Anda." breadcrumbs={["OSIS", "Profil"]} />
            <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center">
                        <div className="relative w-32 h-32 mx-auto">
                            <img src={avatar} alt="" className="w-full h-full rounded-full object-cover border-4 border-brand-100" />
                            <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 w-10 h-10 rounded-full gradient-brand text-white flex items-center justify-center shadow-lg hover:scale-110 transition"><Camera className="w-4 h-4" /></button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
                        </div>
                        <div className="font-display font-extrabold text-xl text-brand-950 mt-5">{form.name}</div>
                        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand-100 text-brand-800 px-3 py-1 text-xs font-bold uppercase tracking-wider">OSIS</div>
                        <button onClick={() => fileRef.current?.click()} className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 px-4 py-2.5 text-xs font-bold text-brand-900 hover:bg-brand-50"><Upload className="w-3.5 h-3.5" />Ganti Foto</button>
                    </div>
                </div>
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
                        <h3 className="font-display font-bold text-xl text-brand-950">Informasi Profil</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className="text-sm font-semibold text-brand-950">Nama Lengkap</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div><label className="text-sm font-semibold text-brand-950">Email</label><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div><label className="text-sm font-semibold text-brand-950">Kelas</label><input value={form.class} onChange={e => setForm({...form, class: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div><label className="text-sm font-semibold text-brand-950">Jabatan di OSIS</label><input value={form.position} onChange={e => setForm({...form, position: e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                        </div>
                        <button
                            onClick={async () => {
                                try {
                                    const updated = await apiUpdateProfile({
                                        name: form.name,
                                        email: form.email,
                                        avatar_url: avatar,
                                        class_name: form.class,
                                        position: form.position,
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
