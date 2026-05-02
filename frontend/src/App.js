import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { BrandingProvider } from "./context/BrandingContext";
import { AuthProvider } from "./context/AuthContext";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public
import Home from "./pages/public/Home";
import Profil from "./pages/public/Profil";
import Guru from "./pages/public/Guru";
import GuruDetail from "./pages/public/GuruDetail";
import Berita from "./pages/public/Berita";
import BeritaDetail from "./pages/public/BeritaDetail";
import Refleksi from "./pages/public/Refleksi";
import Ekstrakurikuler from "./pages/public/Ekstrakurikuler";
import KaryaSiswa from "./pages/public/KaryaSiswa";
import ProgramStudi from "./pages/public/ProgramStudi";
import Alumni from "./pages/public/Alumni";
import Galeri from "./pages/public/Galeri";
import GaleriDetail from "./pages/public/GaleriDetail";
import Pengumuman from "./pages/public/Pengumuman";
import PPDB from "./pages/public/PPDB";
import FAQ from "./pages/public/FAQ";
import Kontak from "./pages/public/Kontak";
import Agenda from "./pages/public/Agenda";
import Modul from "./pages/public/Modul";
import NotFound from "./pages/public/NotFound";
import SearchResults from "./pages/public/SearchResults";

// Auth
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Admin
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminAcademicYears from "./pages/admin/AdminAcademicYears";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminScores from "./pages/admin/AdminScores";
import AdminReportCards from "./pages/admin/AdminReportCards";
import AdminModules from "./pages/admin/AdminModules";
import AdminContent from "./pages/admin/AdminContent";
import AdminApproval from "./pages/admin/AdminApproval";
import AdminPPDB from "./pages/admin/AdminPPDB";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminActivityLog from "./pages/admin/AdminActivityLog";
import AdminNotifications from "./pages/admin/AdminNotifications";

// Teacher
import TeacherOverview from "./pages/teacher/TeacherOverview";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherScores from "./pages/teacher/TeacherScores";
import TeacherModules from "./pages/teacher/TeacherModules";
import TeacherEvaluations from "./pages/teacher/TeacherEvaluations";
import TeacherSubmissions from "./pages/teacher/TeacherSubmissions";
import TeacherProfile from "./pages/teacher/TeacherProfile";

// OSIS
import OSISOverview from "./pages/osis/OSISOverview";
import OSISExtra from "./pages/osis/OSISExtra";
import OSISWorks from "./pages/osis/OSISWorks";
import OSISEvents from "./pages/osis/OSISEvents";
import OSISGallery from "./pages/osis/OSISGallery";
import OSISAnnouncements from "./pages/osis/OSISAnnouncements";
import OSISProfile from "./pages/osis/OSISProfile";

function App() {
    return (
        <BrandingProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Toaster richColors position="top-right" toastOptions={{ style: { fontFamily: "'Plus Jakarta Sans', sans-serif" } }} />
                    <Routes>
                        <Route element={<PublicLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/profil" element={<Profil />} />
                            <Route path="/guru" element={<Guru />} />
                            <Route path="/guru/:slug" element={<GuruDetail />} />
                            <Route path="/berita" element={<Berita />} />
                            <Route path="/berita/:slug" element={<BeritaDetail />} />
                            <Route path="/refleksi" element={<Refleksi />} />
                            <Route path="/ekstrakurikuler" element={<Ekstrakurikuler />} />
                            <Route path="/karya-siswa" element={<KaryaSiswa />} />
                            <Route path="/program-studi" element={<ProgramStudi />} />
                            <Route path="/alumni" element={<Alumni />} />
                            <Route path="/galeri" element={<Galeri />} />
                            <Route path="/galeri/:id" element={<GaleriDetail />} />
                            <Route path="/pengumuman" element={<Pengumuman />} />
                            <Route path="/ppdb" element={<PPDB />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/kontak" element={<Kontak />} />
                            <Route path="/agenda" element={<Agenda />} />
                            <Route path="/modul" element={<Modul />} />
                            <Route path="/search" element={<SearchResults />} />
                        </Route>

                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        <Route path="/admin" element={<DashboardLayout requiredRole="admin" />}>
                            <Route index element={<AdminOverview />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="teachers" element={<AdminTeachers />} />
                            <Route path="students" element={<AdminStudents />} />
                            <Route path="academic-years" element={<AdminAcademicYears />} />
                            <Route path="subjects" element={<AdminSubjects />} />
                            <Route path="scores" element={<AdminScores />} />
                            <Route path="report-cards" element={<AdminReportCards />} />
                            <Route path="modules" element={<AdminModules />} />
                            <Route path="content" element={<AdminContent />} />
                            <Route path="approval" element={<AdminApproval />} />
                            <Route path="ppdb" element={<AdminPPDB />} />
                            <Route path="messages" element={<AdminMessages />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route path="activity" element={<AdminActivityLog />} />
                            <Route path="notifications" element={<AdminNotifications />} />
                        </Route>

                        <Route path="/teacher" element={<DashboardLayout requiredRole="teacher" />}>
                            <Route index element={<TeacherOverview />} />
                            <Route path="classes" element={<TeacherClasses />} />
                            <Route path="scores" element={<TeacherScores />} />
                            <Route path="modules" element={<TeacherModules />} />
                            <Route path="evaluations" element={<TeacherEvaluations />} />
                            <Route path="submissions" element={<TeacherSubmissions />} />
                            <Route path="profile" element={<TeacherProfile />} />
                        </Route>

                        <Route path="/osis" element={<DashboardLayout requiredRole="osis" />}>
                            <Route index element={<OSISOverview />} />
                            <Route path="extra" element={<OSISExtra />} />
                            <Route path="works" element={<OSISWorks />} />
                            <Route path="events" element={<OSISEvents />} />
                            <Route path="gallery" element={<OSISGallery />} />
                            <Route path="announcements" element={<OSISAnnouncements />} />
                            <Route path="profile" element={<OSISProfile />} />
                        </Route>

                        <Route path="*" element={<PublicLayout />}>
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </BrandingProvider>
    );
}

export default App;
