# Architecture

## Ringkasan
- Frontend React berperan sebagai UI untuk publik dan dashboard role-based.
- Backend Laravel berperan sebagai API (JSON) + autentikasi token.
- Banyak fitur CRUD di-implement menggunakan pola **records generic**: tabel `records` dengan field `type` dan `data` (JSON).

## Frontend
Entry penting:
- API client: [backend.js](file:///c:/Nitip%20Fadhil/ma-react/frontend/src/lib/backend.js)
- Auth state: [AuthContext.jsx](file:///c:/Nitip%20Fadhil/ma-react/frontend/src/context/AuthContext.jsx)
- CRUD hook generic: [useRecordType.js](file:///c:/Nitip%20Fadhil/ma-react/frontend/src/hooks/useRecordType.js)

Pola umum:
- Halaman dashboard memuat data via bootstrap dan/atau records berdasarkan `type`.
- Aksi create/update/delete memanggil endpoint records.

## Backend
Entry penting:
- Routes: [api.php](file:///c:/Nitip%20Fadhil/ma-react/backend/routes/api.php)
- Auth: [AuthController.php](file:///c:/Nitip%20Fadhil/ma-react/backend/app/Http/Controllers/Api/AuthController.php)
- Records: [RecordController.php](file:///c:/Nitip%20Fadhil/ma-react/backend/app/Http/Controllers/Api/RecordController.php)
- Admin users: [AdminUserController.php](file:///c:/Nitip%20Fadhil/ma-react/backend/app/Http/Controllers/Api/AdminUserController.php)

## Data Model
- `users`: akun login + role (`admin`, `teacher`, `osis`) + status.
- `records`: data fleksibel untuk berbagai kebutuhan CRUD.

## Catatan Pengembangan Lanjutan
Jika kebutuhan makin kompleks, pertimbangkan:
- Pecah `records` menjadi tabel domain (modules, announcements, ppdb, dsb) untuk integritas data.
- Tambah validasi request per endpoint.
- Tambah audit log terstruktur.
