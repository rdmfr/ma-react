# ma-react

Monorepo aplikasi sekolah: **Frontend React (CRACO/CRA)** + **Backend Laravel (API)** + **MySQL (XAMPP)**.

Role utama:
- Admin: manajemen pengguna, persetujuan konten, master data, PPDB, pesan masuk
- Guru: modul, penilaian, evaluasi, pengajuan konten
- OSIS: pengajuan konten (pengumuman, agenda, galeri, karya, ekstrakurikuler)
- Publik: halaman profil sekolah + konten yang sudah disetujui + form kontak/PPDB

Dokumentasi tambahan:
- [docs/DEPLOYMENT.md](file:///c:/Nitip%20Fadhil/ma-react/docs/DEPLOYMENT.md)
- [docs/API.md](file:///c:/Nitip%20Fadhil/ma-react/docs/API.md)
- [docs/ARCHITECTURE.md](file:///c:/Nitip%20Fadhil/ma-react/docs/ARCHITECTURE.md)

## Struktur Folder
- `frontend/` React app (dashboard + public pages)
- `backend/` Laravel API + migrations/seed

## Prasyarat (Lokal)
- XAMPP (MySQL + Apache opsional)
- PHP 8.1+ dan Composer (untuk Laravel)
- Node.js (untuk development/build React)

## Menjalankan di Lokal (XAMPP)

### 1) Database (MySQL)
- Jalankan MySQL di XAMPP
- Buat database: `ma_react` (via phpMyAdmin)

### 2) Backend (Laravel API)
Di Windows PowerShell:

```bash
cd backend
copy .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

Cek backend:
- `GET http://127.0.0.1:8000/api/health`

### 3) Frontend (React)
Siapkan env (tanpa commit `.env`):

```bash
cd frontend
copy .env.example .env.local
yarn install
yarn start
```

Frontend default jalan di `http://127.0.0.1:3001/` (jika `WDS_SOCKET_PORT` dipakai).

## Akun Demo (Seeder)
- Admin: `admin@mapulosari.sch.id` / `admin123`
- Guru: `guru@mapulosari.sch.id` / `guru123`
- OSIS: `osis@mapulosari.sch.id` / `osis123`

Seeder ada di [DatabaseSeeder.php](file:///c:/Nitip%20Fadhil/ma-react/backend/database/seeders/DatabaseSeeder.php).

## Troubleshooting Cepat
- Login 404: pastikan frontend memanggil `http://localhost:8000/api/auth/login` dan backend sedang running.
- CORS error: set `CORS_ALLOWED_ORIGINS` di `backend/.env` sesuai origin frontend lalu jalankan `php artisan config:clear`.
- Setelah mengubah env React: harus restart dev server (`Ctrl+C` lalu `yarn start` lagi).

## Catatan Keamanan
- Jangan commit file `.env` (berisi APP_KEY/DB creds). Repo ini menyediakan contoh `.env.example`.
- Untuk production: set `APP_DEBUG=false` dan gunakan kredensial DB yang aman.
