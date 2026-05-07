# Deployment

Dokumen ini menjelaskan pola deploy yang paling umum untuk monorepo ini:
- Backend Laravel sebagai **API**
- Frontend React sebagai **static build**

## Konsep
- Frontend memanggil API menggunakan `REACT_APP_BACKEND_URL` (tanpa `/api`, karena frontend akan menambahkan `/api` sendiri).
- Backend Laravel menyediakan endpoint dengan prefix `/api/*` (lihat [api.php](file:///c:/Nitip%20Fadhil/ma-react/backend/routes/api.php)).

## Backend (Laravel)

### A) Shared Hosting (cPanel) + Apache
1. Upload folder `backend/` ke hosting.
2. Set document root domain/subdomain menunjuk ke `backend/public`.
3. Buat file `backend/.env` dari `backend/.env.example`, lalu isi:
   - `APP_ENV=production`
   - `APP_DEBUG=false`
   - `APP_URL=https://domain-backend-kamu.com`
   - `DB_*` sesuai database hosting
   - `CORS_ALLOWED_ORIGINS=https://domain-frontend-kamu.com`
4. Jalankan (via SSH/Terminal cPanel):
   - `php artisan key:generate`
   - `php artisan migrate --force`
   - (opsional) `php artisan config:cache`

Catatan:
- Pastikan extension PHP untuk MySQL aktif (pdo_mysql).
- Pastikan folder `backend/storage` dan `backend/bootstrap/cache` writable.

### B) VPS (Nginx/Apache)
1. Deploy `backend/` seperti Laravel pada umumnya.
2. Set web root ke `backend/public`.
3. Set `.env` production.
4. Jalankan migration dan cache config.

## Frontend (React)

### Build
Di mesin yang ada Node.js:
1. Buat env build:
   - salin `frontend/.env.example` menjadi `frontend/.env.production.local` (jangan commit)
   - isi `REACT_APP_BACKEND_URL=https://domain-backend-kamu.com`
2. Build:
   - `cd frontend`
   - `yarn install`
   - `yarn build`

### Hosting Static
Upload isi folder `frontend/build/` ke hosting static (Netlify/Vercel/Cloudflare Pages/cPanel public_html).

## Checklist Production
- Backend:
  - `APP_DEBUG=false`
  - `APP_URL` benar
  - `CORS_ALLOWED_ORIGINS` hanya domain frontend
  - database user non-root + password kuat
  - schedule/queue (jika nanti dipakai)
- Frontend:
  - `REACT_APP_BACKEND_URL` menunjuk backend production
  - pastikan route SPA (rewrite semua route ke `index.html`)
