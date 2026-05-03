import { apiDashboardBootstrap, apiPublicBootstrap } from "../lib/backend";
import { BRANDING_STORAGE_KEY } from "../context/BrandingContext";

export const EXTRACURRICULAR_CATEGORIES = [
    { value: "multimedia", label: "Multimedia" },
    { value: "pmr", label: "PMR" },
    { value: "pramuka", label: "Pramuka" },
    { value: "marawiss", label: "Marawis" },
    { value: "hadroh", label: "Hadroh" },
    { value: "olahraga", label: "Olahraga" },
    { value: "kesenian", label: "Kesenian" },
];

export const newsCategories = ["Akademik", "Prestasi", "Kegiatan", "Pengumuman"];

const listeners = new Set();

export function subscribeDataHydrated(listener) {
    if (typeof listener !== "function") return () => {};
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function emit(scope) {
    listeners.forEach((fn) => {
        try { fn(scope); } catch { }
    });
}

export const stats = [];
export const subjects = [];
export const teachers = [];
export const classes = [];
export const students = [];
export const news = [];
export const reflections = [];
export const events = [];
export const announcements = [];
export const extracurriculars = [];
export const studentWorks = [];
export const programStudies = [];
export const alumni = [];
export const galleries = [];
export const faqs = [];
export const modules = [];
export const approvalQueue = [];
export const ppdbRegistrants = [];
export const contactMessages = [];
export const notifications = [];
export const activityLog = [];
export const scores = [];
export const users = [];
export const academicYears = [];
export const evaluations = [];

const hydrateArray = (target, items) => {
    if (!Array.isArray(target) || !Array.isArray(items)) return;
    target.splice(0, target.length, ...items);
};

const hydrateFromBootstrap = (payload) => {
    if (!payload || typeof payload !== "object") return;

    if (Array.isArray(payload.branding) && payload.branding[0] && typeof payload.branding[0] === "object") {
        try { localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(payload.branding[0])); } catch { }
    }

    hydrateArray(subjects, payload.subjects);
    hydrateArray(teachers, payload.teachers);
    hydrateArray(classes, payload.classes);
    hydrateArray(students, payload.students);
    hydrateArray(news, payload.news);
    hydrateArray(reflections, payload.reflections);
    hydrateArray(events, payload.events);
    hydrateArray(announcements, payload.announcements);
    hydrateArray(extracurriculars, payload.extracurriculars);
    hydrateArray(studentWorks, payload.studentWorks);
    hydrateArray(programStudies, payload.programStudies);
    hydrateArray(alumni, payload.alumni);
    hydrateArray(galleries, payload.galleries);
    hydrateArray(faqs, payload.faqs);
    hydrateArray(modules, payload.modules);
    hydrateArray(approvalQueue, payload.approvalQueue);
    hydrateArray(ppdbRegistrants, payload.ppdbRegistrants);
    hydrateArray(contactMessages, payload.contactMessages);
    hydrateArray(notifications, payload.notifications);
    hydrateArray(activityLog, payload.activityLog);
    hydrateArray(scores, payload.scores);
    hydrateArray(users, payload.users);
    hydrateArray(academicYears, payload.academicYears);
    hydrateArray(evaluations, payload.evaluations);
};

export async function initPublicData() {
    if (process.env.REACT_APP_USE_MOCK_DATA === "true") return;
    const payload = await apiPublicBootstrap();
    hydrateFromBootstrap(payload);
    emit("public");
}

export async function initDashboardData() {
    if (process.env.REACT_APP_USE_MOCK_DATA === "true") return;
    const payload = await apiDashboardBootstrap();
    hydrateFromBootstrap(payload);
    emit("dashboard");
}
