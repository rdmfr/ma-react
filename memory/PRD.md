# MA PULOSARI v3.0 — Frontend UI/UX

## Original Problem Statement
Buatkan website MA Pulosari v3.0 sesuai dokumen lengkap. Warna dominan gradient hijau tua ke hijau muda. Admin dapat mengubah logo/nama sekolah dari sistem login hingga dashboard public. Fokus UI/UX saja (database diurus user). Stack: React.

## User Choices (1 Feb 2026)
- Scope: SEMUA halaman public + login + dashboard 3 role (Admin, Guru, OSIS)
- Data: Mock static (di-hardcode di frontend)
- Gradient: `#064e3b → #10b981` (Emerald modern)
- Style: Modern academic + glass-morphism
- Font: Manrope (heading) + Plus Jakarta Sans (body) + Fraunces (editorial accent)

## Architecture
- React 19 + React Router v7
- Tailwind CSS + Shadcn UI (pre-installed)
- Context API for Branding (localStorage) + Auth (mock)
- Toast via `sonner`
- Icons: lucide-react

## What's Been Implemented (1 Feb 2026)
### Public pages (18)
Home (bento hero + news + teachers + events + CTA), Profil (visi/misi/nilai/organogram), Guru + detail, Berita + detail, Refleksi, Ekstrakurikuler, Karya Siswa, Program Studi, Alumni, Galeri + detail dengan lightbox, Pengumuman (pinned), PPDB (hero + timeline + form), FAQ (accordion), Kontak (form + map), Agenda, Modul (dengan download button).

### Auth (3)
Login (split-screen design dengan demo credentials quick-fill), Forgot Password, Reset Password.

### Admin dashboard (16 pages)
Overview, Users, Teachers, Students (dengan Excel import modal), Academic Years & Classes, Subjects, Scores, Report Cards, Modules, Content Management (multi-tipe), Approval Queue (approve/reject), PPDB, Messages (inbox style), **Settings (CRITICAL — branding editor)**, Activity Log, Notifications.

### Teacher dashboard (7)
Overview, Classes, Score Input (spreadsheet), Modules (upload), Evaluations, Submissions, Profile.

### OSIS dashboard (7)
Overview, Extra, Works, Events, Gallery, Announcements, Profile.

### Branding System
- `BrandingContext` dengan localStorage persistence (`ma_pulosari_branding_v2`)
- Admin > Settings > Branding: ubah logo URL, upload file (data-URI), nama sekolah, tagline, singkatan
- Perubahan langsung ter-reflect di navbar public, footer, login page, dan sidebar dashboard

### Test Credentials
- `admin@mapulosari.sch.id` / `admin123` → /admin
- `guru@mapulosari.sch.id` / `guru123` → /teacher
- `osis@mapulosari.sch.id` / `osis123` → /osis

### Testing Results (iteration_1.json)
- Frontend: 100% — semua 46 routes load, branding propagation verified, role-based redirect verified, lightbox/accordion/toast verified

## Prioritized Backlog
### P1 — Next tasks
- Integrasi backend Laravel (user yang kerjakan — disediakan schema sudah lengkap di dokumen)
- Global search functionality (belum diwire)
- Notifikasi real-time badge count

### P2
- Dark mode toggle
- Animasi halaman transition (Framer Motion)
- Infinite scroll pada list Berita

### P3
- Export PDF rapor dari dashboard
- Print-friendly styles
- Multi-bahasa (ID/EN)

## File Map
- Entry: `/app/frontend/src/App.js`
- Context: `/app/frontend/src/context/`
- Data mock: `/app/frontend/src/data/mockData.js`
- Layouts: `/app/frontend/src/layouts/`
- Pages: `/app/frontend/src/pages/{public,auth,admin,teacher,osis}/`
- Shared primitives: `/app/frontend/src/components/shared/Primitives.jsx`
