# Architecture

## Ringkasan
- Frontend React berperan sebagai UI untuk publik dan dashboard role-based.
- Backend Laravel berperan sebagai API (JSON) + autentikasi token, dan juga mulai memuat halaman publik via Blade (porting bertahap dari React).
- Banyak fitur CRUD di-implement menggunakan pola **records generic**: tabel `records` dengan field `type` dan `data` (JSON).

## Frontend
Entry penting:
- API client: [backend.js](../frontend/src/lib/backend.js)
- Auth state: [AuthContext.jsx](../frontend/src/context/AuthContext.jsx)
- CRUD hook generic: [useRecordType.js](../frontend/src/hooks/useRecordType.js)

Pola umum:
- Halaman dashboard memuat data via bootstrap dan/atau records berdasarkan `type`.
- Aksi create/update/delete memanggil endpoint records.

## Backend
Entry penting:
- Routes: [api.php](../backend/routes/api.php)
- Web routes: [web.php](../backend/routes/web.php)
- Auth: [AuthController.php](../backend/app/Http/Controllers/Api/AuthController.php)
- Records: [RecordController.php](../backend/app/Http/Controllers/Api/RecordController.php)
- Admin users: [AdminUserController.php](../backend/app/Http/Controllers/Api/AdminUserController.php)

Porting Web (Blade) yang sudah ada:
- Layout publik + komponen: `backend/resources/views/layouts` dan `backend/resources/views/partials`
- Controller web: `backend/app/Http/Controllers/Web`
- Branding di-share ke seluruh view dari record `type=branding` lewat `AppServiceProvider`

## Data Model
- `users`: akun login + role (`admin`, `teacher`, `osis`) + status.
- `records`: data fleksibel untuk berbagai kebutuhan CRUD.

## Catatan Pengembangan Lanjutan
Jika kebutuhan makin kompleks, pertimbangkan:
- Pecah `records` menjadi tabel domain (modules, announcements, ppdb, dsb) untuk integritas data.
- Tambah validasi request per endpoint.
- Tambah audit log terstruktur.
