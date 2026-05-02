import axios from "axios";

const DEFAULT_BACKEND_ORIGIN =
    typeof window !== "undefined" && window.location?.hostname
        ? `${window.location.protocol === "https:" ? "https" : "http"}://${window.location.hostname === "localhost" ? "127.0.0.1" : window.location.hostname}:8000`
        : "http://127.0.0.1:8000";

const ENV_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "").trim();

const RAW_BASE_URL = (ENV_BASE_URL || DEFAULT_BACKEND_ORIGIN).replace(/\/$/, "");

const API_BASE_URL = RAW_BASE_URL.endsWith("/api") ? RAW_BASE_URL : `${RAW_BASE_URL}/api`;

export const TOKEN_STORAGE_KEY = "ma_pulosari_token_v1";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function apiLogin(email, password) {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
}

export async function apiLogout() {
    await api.post("/auth/logout");
}

export async function apiPublicBootstrap() {
    const res = await api.get("/public/bootstrap");
    return res.data;
}

export async function apiPublicContact(payload) {
    const res = await api.post("/public/contact", payload);
    return res.data;
}

export async function apiPublicPpdb(payload) {
    const res = await api.post("/public/ppdb", payload);
    return res.data;
}

export async function apiPublicDownloadModule(id) {
    const res = await api.post(`/public/modules/${id}/download`);
    return res.data;
}

export async function apiPublicDownloadStudentWork(id) {
    const res = await api.post(`/public/student-works/${id}/download`);
    return res.data;
}

export async function apiDashboardBootstrap() {
    const res = await api.get("/dashboard/bootstrap");
    return res.data;
}

export async function apiUpdateProfile(payload) {
    const res = await api.put("/profile", payload);
    return res.data;
}

export async function apiUploadAvatar(file) {
    const fd = new FormData();
    fd.append("avatar", file);
    const res = await api.post("/profile/avatar", fd);
    return res.data;
}

export async function apiListRecords(type, limit = 1000) {
    const res = await api.get("/records", { params: { type, limit } });
    return res.data;
}

export async function apiCreateRecord(type, data) {
    const res = await api.post("/records", { type, data });
    return res.data;
}

export async function apiCreateRecordMultipart(type, data, photoFile) {
    const fd = new FormData();
    fd.append("type", type);
    fd.append("data", JSON.stringify(data || {}));
    if (photoFile) fd.append("photo", photoFile);
    const res = await api.post("/records", fd);
    return res.data;
}

export async function apiCreateRecordWithFile(type, data, file, fileField) {
    const fd = new FormData();
    fd.append("type", type);
    fd.append("data", JSON.stringify(data || {}));
    if (file) fd.append("file", file);
    if (fileField) fd.append("file_field", fileField);
    const res = await api.post("/records", fd);
    return res.data;
}

export async function apiUpdateRecord(id, data) {
    const res = await api.put(`/records/${id}`, { data });
    return res.data;
}

export async function apiUpdateRecordWithFile(id, data, file, fileField) {
    const fd = new FormData();
    fd.append("data", JSON.stringify(data || {}));
    if (file) fd.append("file", file);
    if (fileField) fd.append("file_field", fileField);
    const res = await api.post(`/records/${id}`, fd);
    return res.data;
}

export async function apiGetRecord(id) {
    const res = await api.get(`/records/${id}`);
    return res.data;
}

export async function apiDeleteRecord(id) {
    await api.delete(`/records/${id}`);
}

export async function apiAdminListUsers() {
    const res = await api.get("/admin/users");
    return res.data;
}

export async function apiAdminBulkUpdateRecords(updates) {
    const res = await api.post("/admin/records/bulk-update", { updates });
    return res.data;
}

export async function apiAdminCreateUser(payload) {
    const res = await api.post("/admin/users", payload);
    return res.data;
}

export async function apiAdminUpdateUser(id, payload) {
    const res = await api.put(`/admin/users/${id}`, payload);
    return res.data;
}

export async function apiAdminDeleteUser(id) {
    await api.delete(`/admin/users/${id}`);
}
