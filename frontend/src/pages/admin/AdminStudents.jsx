import React, { useMemo, useState } from "react";
import { Upload, Download, Plus, Search, FileSpreadsheet, CheckCircle2, AlertCircle, X, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatusBadge } from "../../components/shared/Primitives";
import { initPublicData, students } from "../../data/mockData";
import { useRecordType } from "../../hooks/useRecordType";
import { apiCreateRecordMultipart, apiUpdateRecordWithFile } from "../../lib/backend";
import { apiAdminBulkUpdateRecords, apiCreateRecord } from "../../lib/backend";
import { apiWrapper, validateFormData, validateFile, getErrorMessage } from "../../lib/api";

export default function AdminStudents() {
    const { items, setItems, updateItem, deleteItem, hasToken } = useRecordType("students", students);
    const [q, setQ] = useState("");
    const [cls, setCls] = useState("Semua");
    const [importOpen, setImportOpen] = useState(false);
    const [resultOpen, setResultOpen] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importErrors, setImportErrors] = useState([]);
    const [importResult, setImportResult] = useState({ ok: 0, fail: 0 });
    const [selected, setSelected] = useState([]);
    const [editor, setEditor] = useState(null);
    const [moveOpen, setMoveOpen] = useState(false);
    const [moveClass, setMoveClass] = useState("");
    const [form, setForm] = useState({ nis: "", name: "", gender: "L", class: "", status: "Aktif", photo: "" });
    const [photoFile, setPhotoFile] = useState(null);

    const filtered = items.filter(s => (cls === "Semua" || s.class === cls) && (((s.name || "").toLowerCase().includes(q.toLowerCase())) || ((s.nis || "").includes(q))));
    const uniqueClasses = Array.from(new Set(items.map(s => s.class).filter(Boolean)));
    const visibleSlice = filtered.slice(0, 12);
    const allSelected = visibleSlice.length > 0 && visibleSlice.every(s => selected.includes(s.id));
    const toggleAll = () => setSelected(allSelected ? [] : visibleSlice.map(s => s.id));
    const toggleOne = (id) => setSelected(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);

    const openCreate = () => { setForm({ nis: "", name: "", gender: "L", class: uniqueClasses[0] || "", status: "Aktif", photo: "" }); setPhotoFile(null); setEditor({ mode: "create" }); };
    const openEdit = (s) => { setForm({ nis: s.nis || "", name: s.name || "", gender: s.gender || "L", class: s.class || "", status: s.status || "Aktif", photo: s.photo || "" }); setPhotoFile(null); setEditor({ mode: "edit", item: s }); };

    const parseCsv = (text) => {
        const rows = [];
        let row = [];
        let cur = "";
        let inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            const next = text[i + 1];
            if (ch === '"' && inQuotes && next === '"') { cur += '"'; i++; continue; }
            if (ch === '"') { inQuotes = !inQuotes; continue; }
            if (ch === "," && !inQuotes) { row.push(cur); cur = ""; continue; }
            if ((ch === "\n" || ch === "\r") && !inQuotes) {
                if (ch === "\r" && next === "\n") i++;
                row.push(cur);
                const allEmpty = row.every((x) => String(x || "").trim() === "");
                if (!allEmpty) rows.push(row);
                row = [];
                cur = "";
                continue;
            }
            cur += ch;
        }
        row.push(cur);
        const allEmpty = row.every((x) => String(x || "").trim() === "");
        if (!allEmpty) rows.push(row);
        return rows;
    };

    const downloadTemplate = () => {
        const header = ["nis", "name", "gender", "class", "status"];
        const example = ["202410001", "Nama Siswa", "L", "X IPA 1", "Aktif"];
        const lines = [header.join(","), example.map((x) => `"${String(x).replaceAll('"', '""')}"`).join(",")];
        const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "template-import-siswa.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const downloadImportErrorReport = () => {
        const header = ["row", "reason"];
        const lines = [header.join(",")].concat((importErrors || []).map((e) => {
            const val = (x) => `"${String(x ?? "").replaceAll('"', '""')}"`;
            return [val(e.row), val(e.reason)].join(",");
        }));
        const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "import-siswa-errors.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const doImportCsv = async () => {
        if (!hasToken) { toast.error("Silakan login dulu"); return; }
        if (!importFile) { toast.error("Silakan pilih file CSV"); return; }
        if (!importFile.name.toLowerCase().endsWith(".csv")) { toast.error("Format belum didukung. Gunakan CSV."); return; }

        try {
            const raw = await importFile.text();
            const rows = parseCsv(raw);
            if (rows.length < 2) { toast.error("CSV kosong"); return; }

            const header = rows[0].map((h) => String(h || "").trim().toLowerCase());
            const idx = (key) => header.indexOf(key);
            const hasHeader = idx("nis") >= 0 && idx("name") >= 0;

            const dataRows = hasHeader ? rows.slice(1) : rows;
            const toCreate = [];
            const errs = [];
            dataRows.forEach((r, i) => {
                const pick = (k, fallbackIndex) => {
                    const j = hasHeader ? idx(k) : -1;
                    if (j >= 0) return String(r[j] || "").trim();
                    return String(r[fallbackIndex] || "").trim();
                };
                const nis = pick("nis", 0);
                const name = pick("name", 1);
                const gender = (pick("gender", 2) || "L").toUpperCase() === "P" ? "P" : "L";
                const clsVal = pick("class", 3);
                const status = pick("status", 4) || "Aktif";
                
                if (!nis || !name) {
                    errs.push({ row: i + 2, reason: "nis/name wajib" });
                    return;
                }
                if (!clsVal) {
                    errs.push({ row: i + 2, reason: "class wajib" });
                    return;
                }
                toCreate.push({ nis, name, gender, class: clsVal, status });
            });

            const results = await Promise.allSettled(toCreate.map((p) => apiCreateRecord("students", p)));
            const created = [];
            results.forEach((r, i) => {
                if (r.status === "fulfilled") {
                    created.push(r.value);
                } else {
                    const errorMsg = getErrorMessage(r.reason);
                    errs.push({ row: i + 2, reason: errorMsg });
                }
            });

            if (created.length > 0) {
                setItems((prev) => [...created, ...(prev || [])]);
                initPublicData().catch(() => {});
            }
            setImportErrors(errs);
            setImportResult({ ok: created.length, fail: errs.length });
            setImportOpen(false);
            setResultOpen(true);
            toast.success(`Import selesai: ${created.length} berhasil, ${errs.length} gagal`);
        } catch (err) {
            const errorMsg = getErrorMessage(err);
            toast.error(errorMsg);
            console.error("[AdminStudents] Import error:", err);
        }
    };

    const openMoveClass = () => {
        if (selected.length === 0) return;
        setMoveClass(uniqueClasses[0] || "");
        setMoveOpen(true);
    };

    const doMoveClass = async () => {
        if (!hasToken) { toast.error("Silakan login dulu"); return; }
        const ids = selected.filter((id) => typeof id === "string");
        if (ids.length === 0) { toast.error("Data demo tidak bisa dipindah"); return; }
        if (!moveClass) { toast.error("Pilih kelas tujuan"); return; }

        const selectedItems = (items || []).filter((s) => ids.includes(s.id));
        const updates = selectedItems.map((s) => ({ id: s.id, data: { ...s, class: moveClass } }));
        try {
            setItems((prev) => (prev || []).map((s) => ids.includes(s.id) ? ({ ...s, class: moveClass }) : s));
            await apiAdminBulkUpdateRecords(updates);
            initPublicData().catch(() => {});
            toast.success(`${ids.length} siswa dipindahkan ke ${moveClass}`);
            setSelected([]);
            setMoveOpen(false);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Gagal pindah kelas");
        }
    };

    const bulkDelete = async () => {
        if (!hasToken) { toast.error("Silakan login dulu"); return; }
        const ids = [...selected];
        if (ids.length === 0) return;

        const invalid = ids.filter((id) => typeof id !== "string");
        const valid = ids.filter((id) => typeof id === "string");
        if (valid.length === 0) { toast.error("Data demo tidak bisa dihapus"); return; }

        const results = await Promise.allSettled(valid.map((id) => deleteItem(id)));
        const ok = results.filter((r) => r.status === "fulfilled").length;
        const fail = results.length - ok;

        setSelected([]);
        if (ok > 0) initPublicData().catch(() => {});
        if (invalid.length > 0) toast.error(`${invalid.length} data demo dilewati`);
        if (fail > 0) toast.error(`${fail} gagal dihapus`);
        if (ok > 0) toast.success(`${ok} siswa dihapus`);
    };

    const save = async () => {
        if (!hasToken) { toast.error("Silakan login dulu"); return; }
        try {
            const payload = {
                nis: form.nis?.trim(),
                name: form.name?.trim(),
                gender: form.gender || "L",
                class: form.class?.trim(),
                status: form.status || "Aktif",
            };

            // Validate required fields
            const validation = validateFormData(payload, ["nis", "name", "class"]);
            if (!validation.valid) {
                const errors = Object.entries(validation.errors)
                    .map(([field, msg]) => msg)
                    .join(" • ");
                toast.error(errors);
                return;
            }

            if (editor.mode === "create") {
                if (!photoFile) { toast.error("Silakan pilih foto siswa"); return; }
                
                // Validate file
                const fileValidation = validateFile(photoFile, { maxSizeMB: 5, allowedMimes: ["image/jpeg", "image/png", "image/webp"] });
                if (!fileValidation.valid) {
                    toast.error(fileValidation.error);
                    return;
                }

                const created = await apiWrapper.createRecord("students", payload, photoFile);
                setItems((prev) => [created, ...(prev || [])]);
                initPublicData().catch(() => {});
                toast.success("Siswa berhasil ditambahkan");
                setEditor(null);
                return;
            }
            const it = editor.item;
            if (typeof it?.id !== "string") { toast.error("Item demo tidak bisa diubah. Buat entri baru untuk menyimpan ke backend."); return; }
            if (photoFile) {
                const fileValidation = validateFile(photoFile, { maxSizeMB: 5, allowedMimes: ["image/jpeg", "image/png", "image/webp"] });
                if (!fileValidation.valid) {
                    toast.error(fileValidation.error);
                    return;
                }
                const updated = await apiWrapper.updateRecord(it.id, payload, photoFile);
                setItems((prev) => (prev || []).map((x) => (x.id === it.id ? updated : x)));
            } else {
                await updateItem(it.id, { ...payload, photo: form.photo });
            }
            initPublicData().catch(() => {});
            toast.success("Data siswa diperbarui");
            setEditor(null);
        } catch (err) {
            const errorMsg = getErrorMessage(err);
            toast.error(errorMsg);
            console.error("[AdminStudents] Save error:", err);
        }
    };

    const exportCsv = (ids = null) => {
        const rows = (items || [])
            .filter((s) => !ids ? true : ids.includes(s.id))
            .filter((s) => (cls === "Semua" || s.class === cls) && (((s.name || "").toLowerCase().includes(q.toLowerCase())) || ((s.nis || "").includes(q))));

        const header = ["NIS", "Nama", "Kelas", "JK", "Status", "Foto"];
        const lines = [header.join(",")].concat(rows.map((s) => {
            const val = (x) => `"${String(x ?? "").replaceAll('"', '""')}"`;
            return [val(s.nis), val(s.name), val(s.class), val(s.gender), val(s.status), val(s.photo)].join(",");
        }));
        const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = ids ? "siswa-terpilih.csv" : "siswa.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <div data-testid="admin-students">
            <PageHeader title="Manajemen Siswa" description="Kelola data siswa. Impor massal melalui Excel atau input individu." breadcrumbs={["Admin", "Siswa"]}
                actions={<>
                    <button onClick={() => setImportOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-900 hover:bg-brand-50" data-testid="students-import-btn"><Upload className="w-4 h-4" />Import Excel</button>
                    <button onClick={() => exportCsv()} className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-900 hover:bg-brand-50"><Download className="w-4 h-4" />Export CSV</button>
                    <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-2.5 text-sm font-bold shadow-lg shadow-brand-900/20" data-testid="students-add"><Plus className="w-4 h-4" />Tambah Siswa</button>
                </>} />

            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                {selected.length > 0 && (
                    <div className="bg-brand-950 text-white px-5 py-3 flex items-center justify-between gap-3" data-testid="bulk-action-bar">
                        <div className="text-sm font-semibold"><strong>{selected.length}</strong> siswa terpilih</div>
                        <div className="flex gap-2">
                            <button onClick={openMoveClass} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-bold">Pindah Kelas</button>
                            <button onClick={() => exportCsv(selected)} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-bold">Export Terpilih</button>
                            <button onClick={bulkDelete} className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/30 hover:bg-red-500/50 px-3 py-1.5 text-xs font-bold">Hapus</button>
                            <button onClick={() => setSelected([])} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-bold">Batal</button>
                        </div>
                    </div>
                )}
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4">
                        <Search className="w-4 h-4 text-slate-500" />
                        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari nama atau NIS..." className="flex-1 py-2.5 bg-transparent outline-none text-sm" data-testid="students-search" />
                    </div>
                    <select value={cls} onChange={e => setCls(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none" data-testid="students-filter-class">
                        <option>Semua</option>
                        {uniqueClasses.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/50">
                            <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                                <th className="px-6 py-3 w-10"><input type="checkbox" checked={allSelected} onChange={toggleAll} data-testid="select-all" /></th>
                                <th className="px-6 py-3">Siswa</th><th className="px-6 py-3">NIS</th><th className="px-6 py-3">Kelas</th><th className="px-6 py-3">JK</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visibleSlice.map(s => (
                                <tr key={s.id} className={`hover:bg-brand-50/30 ${selected.includes(s.id) ? "bg-brand-50/40" : ""}`} data-testid={`student-row-${s.id}`}>
                                    <td className="px-6 py-3"><input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleOne(s.id)} data-testid={`select-${s.id}`} /></td>
                                    <td className="px-6 py-3"><div className="flex items-center gap-3"><img src={s.photo || `https://i.pravatar.cc/120?u=${encodeURIComponent(s.nis || s.id)}`} alt="" className="w-9 h-9 rounded-full object-cover" /><span className="font-semibold text-brand-950">{s.name}</span></div></td>
                                    <td className="px-6 py-3 font-mono text-xs text-slate-700">{s.nis}</td>
                                    <td className="px-6 py-3"><span className="inline-flex text-[11px] font-bold bg-brand-100 text-brand-800 rounded-full px-2.5 py-0.5">{s.class}</span></td>
                                    <td className="px-6 py-3 text-slate-700">{s.gender === "L" ? "Laki-laki" : "Perempuan"}</td>
                                    <td className="px-6 py-3"><StatusBadge status={s.status} /></td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <button onClick={() => openEdit(s)} className="w-8 h-8 rounded-lg hover:bg-brand-50 text-brand-700 flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button
                                                onClick={async () => {
                                                    if (!hasToken) { toast.error("Silakan login dulu"); return; }
                                                    if (typeof s.id !== "string") { toast.error("Item demo tidak bisa dihapus"); return; }
                                                    try { await deleteItem(s.id); initPublicData().catch(() => {}); toast.success("Siswa dihapus"); } catch (err) { toast.error(err?.response?.data?.message || err.message || "Gagal menghapus"); }
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
            </div>

            {editor && (
                <div className="fixed inset-0 bg-brand-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setEditor(null)}>
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 relative" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center" onClick={() => setEditor(null)}><X className="w-4 h-4" /></button>
                        <h3 className="font-display font-extrabold text-2xl text-brand-950">{editor.mode === "create" ? "Tambah Siswa" : "Edit Siswa"}</h3>
                        <div className="mt-6 grid sm:grid-cols-2 gap-4">
                            <div><label className="text-sm font-semibold text-brand-950">Nama</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" /></div>
                            <div><label className="text-sm font-semibold text-brand-950">NIS</label><input value={form.nis} onChange={e => setForm({ ...form, nis: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 font-mono" /></div>
                            <div>
                                <label className="text-sm font-semibold text-brand-950">Kelas</label>
                                <input value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-brand-950">Jenis Kelamin</label>
                                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                                    <option value="L">L</option>
                                    <option value="P">P</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-brand-950">Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                                    <option value="Aktif">Aktif</option>
                                    <option value="Alumni">Alumni</option>
                                    <option value="Nonaktif">Nonaktif</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-brand-950">Foto</label>
                                <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 bg-white" />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setEditor(null)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button onClick={save} className="flex-1 rounded-xl gradient-brand text-white py-3 text-sm font-bold">Simpan</button>
                        </div>
                    </div>
                </div>
            )}

            {importOpen && (
                <div className="fixed inset-0 bg-brand-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setImportOpen(false)}>
                    <div className="bg-white rounded-3xl max-w-xl w-full p-8 relative" onClick={e => e.stopPropagation()} data-testid="import-modal">
                        <button className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center" onClick={() => setImportOpen(false)}><X className="w-4 h-4" /></button>
                        <h3 className="font-display font-extrabold text-2xl text-brand-950">Import Data Siswa</h3>
                        <p className="text-sm text-slate-600 mt-1">Unggah file Excel sesuai template. Baris tidak valid akan dilewati.</p>
                        <button onClick={downloadTemplate} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900"><Download className="w-4 h-4" />Unduh Template (CSV)</button>
                        <div className="mt-5 border-2 border-dashed border-brand-200 rounded-2xl p-10 text-center bg-brand-50/40">
                            <FileSpreadsheet className="w-10 h-10 text-brand-700 mx-auto" />
                            <div className="font-bold text-brand-900 mt-3">Klik untuk pilih file</div>
                            <div className="text-xs text-slate-600 mt-1">.csv · Maks 5MB</div>
                            <input type="file" accept=".csv" onChange={(e) => setImportFile(e.target.files?.[0] || null)} className="mt-5 mx-auto block w-full max-w-sm text-xs" />
                        </div>
                        <div className="mt-5 flex gap-3">
                            <button onClick={() => setImportOpen(false)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button onClick={doImportCsv} className="flex-1 rounded-xl gradient-brand text-white py-3 text-sm font-bold">Mulai Import</button>
                        </div>
                    </div>
                </div>
            )}
            {resultOpen && (
                <div className="fixed inset-0 bg-brand-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setResultOpen(false)}>
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 relative" onClick={e => e.stopPropagation()} data-testid="import-result">
                        <h3 className="font-display font-extrabold text-xl text-brand-950">Hasil Import</h3>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4"><CheckCircle2 className="w-5 h-5 text-emerald-700" /><div className="font-display font-black text-3xl text-emerald-800 mt-2">{importResult.ok}</div><div className="text-xs text-emerald-700 font-semibold">Berhasil</div></div>
                            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4"><AlertCircle className="w-5 h-5 text-amber-700" /><div className="font-display font-black text-3xl text-amber-800 mt-2">{importResult.fail}</div><div className="text-xs text-amber-700 font-semibold">Gagal / Dilewati</div></div>
                        </div>
                        <button onClick={downloadImportErrorReport} className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 text-amber-900 py-3 text-sm font-bold hover:bg-amber-50"><Download className="w-4 h-4" />Unduh Laporan Error</button>
                        <button onClick={() => setResultOpen(false)} className="mt-3 w-full rounded-xl gradient-brand text-white py-3 text-sm font-bold">Tutup</button>
                    </div>
                </div>
            )}

            {moveOpen && (
                <div className="fixed inset-0 bg-brand-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setMoveOpen(false)} data-testid="move-class-modal">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 relative" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center" onClick={() => setMoveOpen(false)}><X className="w-4 h-4" /></button>
                        <h3 className="font-display font-extrabold text-xl text-brand-950">Pindah Kelas</h3>
                        <p className="text-sm text-slate-600 mt-1">Pindahkan siswa terpilih ke kelas tujuan.</p>
                        <div className="mt-5">
                            <label className="text-sm font-semibold text-brand-950">Kelas Tujuan</label>
                            <select value={moveClass} onChange={(e) => setMoveClass(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500">
                                <option value="">Pilih kelas</option>
                                {uniqueClasses.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setMoveOpen(false)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold">Batal</button>
                            <button onClick={doMoveClass} className="flex-1 rounded-xl gradient-brand text-white py-3 text-sm font-bold">Pindahkan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
