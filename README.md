# MA-React: Sistem Informasi Manajemen Madrasah Aliyah

Sistem Informasi Manajemen Madrasah (SIM) berbasis Web yang dirancang untuk memudahkan pengelolaan data akademik, kesiswaan, dan konten publik. Dibangun dengan fokus pada kemudahan penggunaan di lingkungan hosting standar (XAMPP/Shared Hosting) tanpa memerlukan proses kompilasi yang rumit.

## ✨ Fitur Utama

- **Dashboard Admin**: Kendali penuh branding sekolah, manajemen pengguna, persetujuan konten (ACC), dan statistik real-time.
- **Dashboard Guru**: Input nilai siswa, pembuatan berita/artikel, manajemen modul pembelajaran, dan refleksi mengajar.
- **Dashboard OSIS**: Pengajuan agenda kegiatan, galeri foto, draf pengumuman, dan portofolio karya siswa.
- **Manajemen Siswa**: Fitur Import & Export data siswa via CSV, dukungan jurusan IPA & IAI (Agama).
- **Cek Nilai Publik**: Memungkinkan siswa/orang tua mengecek nilai secara instan menggunakan NIS tanpa perlu login.
- **Branding Dinamis**: Ubah logo, hero image, profil sekolah, dan SEO keywords langsung dari dashboard.

## 🛠 Teknologi

- **Backend**: Laravel 10 (PHP 8.1+)
- **Frontend**: Laravel Blade + Alpine.js + Tailwind CSS (via CDN)
- **Database**: MySQL / MariaDB
- **Editor**: TinyMCE Rich Text Editor

## 🚀 Instalasi Lokal (XAMPP)

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/rdmfr/ma-react.git
   cd ma-react
   ```

2. **Instalasi Dependensi**:
   ```bash
   composer install
   ```

3. **Konfigurasi Environment**:
   - Salin `.env.example` menjadi `.env`
   - Buat database baru bernama `ma_react` di phpMyAdmin.
   - Sesuaikan `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD` di file `.env`.

4. **Setup Aplikasi**:
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   php artisan storage:link
   ```

5. **Jalankan**:
   ```bash
   php artisan serve
   ```
   Akses di `http://127.0.0.1:8000`

## 👤 Akun Demo (Seeder)

- **Admin**: `admin@mapulosari.sch.id` (Pass: `admin123`)
- **Guru**: `guru@mapulosari.sch.id` (Pass: `guru123`)
- **OSIS**: `osis@mapulosari.sch.id` (Pass: `osis123`)

---
**Dibangun dengan ikhlas oleh [RdDev.](https://wa.me/628988285622)**
