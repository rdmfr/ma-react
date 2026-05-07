# MA-React Smoke Test Checklist

**Waktu Estimasi**: 30-45 menit per environment  
**Dilakukan oleh**: QA / Developer sebelum production

## 1. SETUP & PREREQUISITES

- [ ] MySQL running dan database `ma_react` sudah dibuat
- [ ] Backend running di `http://localhost:8000`
- [ ] Frontend running di `http://localhost:3000`
- [ ] Browser DevTools Console terbuka (untuk cek error)
- [ ] Network tab DevTools aktif (untuk cek API calls)
- [ ] Database sudah di-seed: `php artisan migrate:fresh --seed`
- [ ] Storage symlink sudah dibuat: `php artisan storage:link`

---

## 2. AUTHENTICATION & ROLES

### Login Admin
- [ ] Buka `http://localhost:3000/login`
- [ ] Email: `admin@mapulosari.sch.id`, Password: `admin123`
- [ ] Klik Login
- [ ] ✓ Redirect ke `/admin/dashboard`
- [ ] ✓ Token tersimpan di localStorage (lihat DevTools → Application → LocalStorage)
- [ ] ✓ Tidak ada error di console

### Login Teacher
- [ ] Logout atau clear localStorage
- [ ] Login dengan email: `guru@mapulosari.sch.id`, password: `guru123`
- [ ] ✓ Redirect ke `/guru/dashboard`
- [ ] ✓ Tidak bisa akses `/admin/*` pages (jika diakses langsung, redirect ke guru dashboard)

### Login OSIS
- [ ] Login dengan email: `osis@mapulosari.sch.id`, password: `osis123`
- [ ] ✓ Redirect ke `/osis/dashboard`
- [ ] ✓ Hanya bisa akses OSIS-specific pages

### Logout
- [ ] Klik Logout button
- [ ] ✓ Redirect ke `/login`
- [ ] ✓ Token dihapus dari localStorage
- [ ] ✓ Tidak bisa akses protected pages (redirect ke login)

---

## 3. ADMIN DASHBOARD - GURU (Teachers)

### View List
- [ ] Login sebagai admin
- [ ] Buka `Admin → Guru`
- [ ] ✓ List guru tampil dengan foto (atau avatar fallback)
- [ ] ✓ Tidak ada 404 error untuk foto
- [ ] ✓ Check Network tab: `/api/records?type=teachers` response `200`

### Tambah Guru (Single)
- [ ] Klik "Tambah Guru" button
- [ ] Dialog form terbuka
- [ ] Isi: Nama: "Budi Santoso", Mapel: "Matematika", Bio: "Guru math", dll
- [ ] Pilih foto guru (JPG/PNG max 5MB)
- [ ] Klik Simpan
- [ ] ✓ Success toast muncul
- [ ] ✓ Guru baru muncul di list (paling atas)
- [ ] ✓ Foto tampil (tidak 404)
- [ ] ✓ Network tab: `POST /api/records` → `201` (created)
- [ ] Console: Tidak ada error

### Validasi Form
- [ ] Buka Tambah Guru lagi
- [ ] **Kosongkan Nama**, klik Simpan
- [ ] ✓ Error toast: "Nama guru wajib diisi"
- [ ] ✓ Form tetap terbuka, data tidak dikirim
- [ ] **Tidak pilih foto**, klik Simpan
- [ ] ✓ Error toast: "Silakan pilih foto guru"
- [ ] **Upload file > 5MB** (atau non-image)
- [ ] ✓ Error toast: "File terlalu besar (maks 5MB)" atau format error

### Edit Guru
- [ ] Klik Edit pada guru di list
- [ ] Form terbuka dengan data guru yang ada
- [ ] Ubah Nama menjadi "Budi Santoso UPDATED"
- [ ] Klik Simpan
- [ ] ✓ Success toast
- [ ] ✓ Data terupdate di list
- [ ] ✓ Network: `POST /api/records/{id}` → `200`

### Delete Guru
- [ ] Klik Delete icon pada guru
- [ ] ✓ Confirm dialog atau direct delete (tergantung UI)
- [ ] ✓ Success toast
- [ ] ✓ Guru hilang dari list
- [ ] ✓ Network: `DELETE /api/records/{id}` → `200`

---

## 4. ADMIN DASHBOARD - SISWA (Students)

### View List & Filter
- [ ] Buka Admin → Siswa
- [ ] ✓ List siswa tampil
- [ ] Gunakan search: ketik nama / NIS
- [ ] ✓ Filter bekerja (list update sesuai keyword)
- [ ] Filter by Kelas (dropdown)
- [ ] ✓ Hanya siswa dari kelas tertentu tampil

### Tambah Siswa (Single)
- [ ] Klik "Tambah Siswa"
- [ ] Isi: NIS: "202410001", Nama: "Andi Wijaya", Kelas: "X IPA 1", JK: "L", Status: "Aktif"
- [ ] Pilih foto
- [ ] Klik Simpan
- [ ] ✓ Success toast
- [ ] ✓ Siswa baru di list
- [ ] ✓ Network: `POST /api/records` → `201`

### Tambah Siswa - Validasi
- [ ] Buka Tambah Siswa
- [ ] Kosongkan NIS, klik Simpan
- [ ] ✓ Error: "NIS wajib diisi"
- [ ] Kosongkan Kelas, klik Simpan
- [ ] ✓ Error: "Kelas wajib diisi"

### Import CSV
- [ ] Klik "Import Excel" button
- [ ] Download template CSV
- [ ] Isi: NIS, Nama, Kelas (required fields)
- [ ] Upload CSV
- [ ] Klik "Mulai Import"
- [ ] ✓ Import dialog close
- [ ] ✓ Result dialog tampil dengan success/fail count
- [ ] ✓ Siswa baru muncul di list
- [ ] Network: Cek setiap row `POST /api/records` → `201` atau `422` untuk invalid rows

### Bulk Actions
- [ ] Pilih beberapa siswa (checkbox)
- [ ] ✓ "Action bar" tampil (Pindah Kelas, Export, Hapus)
- [ ] Klik "Pindah Kelas"
- [ ] Pilih kelas tujuan, klik Pindahkan
- [ ] ✓ Success toast
- [ ] ✓ Siswa terpilih sekarang di kelas baru
- [ ] Network: `POST /api/admin/records/bulk-update` → `200`

### Export CSV
- [ ] Select beberapa siswa atau "Export CSV" (export semua)
- [ ] Klik Export
- [ ] ✓ File CSV download
- [ ] ✓ Buka CSV, lihat data benar (NIS, Nama, Kelas, dll)

---

## 5. UPLOAD & STORAGE

### Photo Upload Validation
- [ ] Pada add guru/siswa, coba upload:
  - [ ] File JPG/PNG < 5MB → ✓ Berhasil
  - [ ] File WEBP/GIF < 5MB → ✓ Berhasil
  - [ ] File > 5MB → ✓ Error: "File terlalu besar"
  - [ ] File .txt / .pdf → ✓ Error: "Format file tidak didukung"

### Photo URL Consistency
- [ ] Setelah upload, lihat foto di list
- [ ] Klik foto untuk preview
- [ ] Network tab: URL like `/storage/uploads/teachers/...` → ✓ `200` (image loads)
- [ ] Inspect foto URL: `src="http://localhost:8000/storage/uploads/..."`
- [ ] ✓ Tidak ada `127.0.0.1` vs `localhost` mismatch (atau keduanya work)

---

## 6. PUBLIC PAGES

### Public Home
- [ ] Buka `http://localhost:3000/` (logout dulu atau incognito)
- [ ] ✓ List guru tampil dengan foto
- [ ] ✓ Foto load (tidak 404)
- [ ] Klik guru → ✓ Detail page (jika ada)

### Public Siswa Page
- [ ] Buka `/siswa` (public)
- [ ] ✓ List siswa tampil (tergantung status filter)
- [ ] ✓ Foto load

### Network Check
- [ ] DevTools Network tab
- [ ] Klik guru/siswa card
- [ ] ✓ `GET /api/records?type=teachers` → `200`
- [ ] ✓ Tidak ada 404 untuk assets/images

---

## 7. ERROR HANDLING

### Validation Error (422)
- [ ] Try create teacher dengan data kosong
- [ ] Network tab: Response status `422`
- [ ] ✓ Response JSON: `{message: "...", errors: {...}}`
- [ ] ✓ Not HTML page (JSON format)

### Server Error (500)
- [ ] Shutdown MySQL
- [ ] Try create record
- [ ] Network: `500` error
- [ ] ✓ Response JSON: `{message: "Gagal menyimpan data..."}`
- [ ] ✓ Not HTML error page
- [ ] Console: Error logged (lihat `storage/logs/laravel.log`)
- [ ] Restart MySQL untuk test lanjut

### Network Error (Connection Refused)
- [ ] Shutdown backend (Ctrl+C pada `php artisan serve`)
- [ ] Try load admin page
- [ ] ✓ Error toast: "Koneksi gagal..."
- [ ] ✓ Console: Network error logged
- [ ] Restart backend

### File Size Limit
- [ ] Try upload file > 5MB
- [ ] ✓ Frontend shows error (tidak dikirim ke server)
- [ ] If somehow sent: Server returns `422` + error message

---

## 8. SECURITY & LOGGING

### CORS
- [ ] Buka DevTools, lihat Network request
- [ ] Request ke `http://localhost:8000/api/...`
- [ ] Response header: `Access-Control-Allow-Origin: http://localhost:3000` (atau pattern match)
- [ ] ✓ CORS error tidak ada di console

### Rate Limiting (Login)
- [ ] Coba login 6x dengan password salah (cepat-cepat)
- [ ] Request ke-6: ✓ Response `429 Too Many Requests`
- [ ] Tunggu 1 menit, coba lagi
- [ ] ✓ Bisa login lagi

### API Logging
- [ ] Buka `backend/storage/logs/api.log` (atau `laravel.log`)
- [ ] ✓ Setiap API request tercatat:
  ```
  [2026-05-02 ...] INFO: API Request [POST /api/records]
  [2026-05-02 ...] INFO: API Response [POST /api/records] 201
  ```

### Debug Mode
- [ ] Backend `.env`: `APP_DEBUG=true` (dev), `APP_DEBUG=false` (production)
- [ ] Trigger server error (shutdown DB)
- [ ] Dev (DEBUG=true): ✓ Stack trace muncul di response
- [ ] Production (DEBUG=false): ✓ Generic error message (no stack trace)

---

## 9. INTEGRATION TESTS

### Full Flow: Add & View
1. [ ] Login admin
2. [ ] Navigate to Guru
3. [ ] Add new guru dengan foto
4. [ ] Logout
5. [ ] Buka public guru page (no auth)
6. [ ] ✓ Guru baru muncul dengan foto
7. [ ] ✓ Tidak ada error di console atau network

### Full Flow: Student Bulk Import
1. [ ] Login admin
2. [ ] Navigate to Siswa
3. [ ] Download template CSV
4. [ ] Add 3 students ke CSV
5. [ ] Import CSV
6. [ ] ✓ All 3 siswa created
7. [ ] Select all → Move to different class
8. [ ] ✓ All moved
9. [ ] Export filtered list
10. [ ] ✓ CSV berisi siswa yang dipindah

### Multi-User Access
1. [ ] Buka 2 browser window: Admin di tab 1, Teacher di tab 2
2. [ ] Admin: Add guru
3. [ ] Teacher (guru dashboard): Refresh page
4. [ ] ✓ Guru baru tampil (data sync)
5. [ ] Teacher: Try access admin page directly
6. [ ] ✓ Redirect ke guru dashboard (permission check)

---

## 10. PERFORMANCE

### Load Time
- [ ] Open Chrome DevTools → Network tab
- [ ] Reload admin dashboard
- [ ] ✓ Full page load < 3 seconds (dev machine, local)
- [ ] ✓ Guru list load < 1 second
- [ ] ✓ No layout shift or flash

### List Performance (Large Dataset)
- [ ] Seed database dengan 100+ records
- [ ] Load guru/siswa list
- [ ] ✓ Page still responsive
- [ ] Scroll smooth (tidak freeze)

---

## 11. BROWSER COMPATIBILITY

Test di multiple browsers (jika possible):
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (macOS/iOS)
- [ ] Edge

Apa yang di-check:
- [ ] Form input bekerja
- [ ] File upload bekerja
- [ ] Modal dialog tampil dengan benar
- [ ] Foto load
- [ ] No console errors

---

## 12. MOBILE/RESPONSIVE

- [ ] Resize browser ke mobile size (375px width)
- [ ] Admin guru list: ✓ Cards stack, readable
- [ ] Add guru form: ✓ Inputs full width, usable
- [ ] Modal: ✓ Responsive, scrollable
- [ ] Upload: ✓ File picker works
- [ ] Navigation: ✓ No horizontal scroll

---

## 13. DEPLOYMENT CHECKLIST (PRODUCTION)

Sebelum deploy ke production:

### Backend Configuration
- [ ] `.env` production: `APP_ENV=production`, `APP_DEBUG=false`
- [ ] `.env` production: `APP_URL=https://your-domain.com`
- [ ] `.env` production: `DB_PASSWORD` set ke password yang kuat
- [ ] `.env` production: `CORS_ALLOWED_ORIGINS=https://frontend-domain.com`
- [ ] `.env` production: `LOG_LEVEL=warning` (jangan debug)
- [ ] APP_KEY sudah di-generate: `php artisan key:generate`

### Frontend Configuration
- [ ] `.env.production`: `REACT_APP_BACKEND_URL=https://your-backend-domain.com`
- [ ] Run build: `npm run build`
- [ ] Test build locally: `npx serve -s build` → ✓ works
- [ ] Check Network requests point ke production backend

### Database Preparation
- [ ] Database backup dibuat
- [ ] Migration script ready: `php artisan migrate --force`
- [ ] Seeder script ready: `php artisan db:seed`
- [ ] Storage link ready: `php artisan storage:link`

### Server Setup
- [ ] Web server (Apache/Nginx) configured
- [ ] PHP version compatible (8.2+)
- [ ] MySQL version compatible (5.7+)
- [ ] Node.js LTS installed (18+)
- [ ] SSL certificate installed

### Pre-Deployment
- [ ] All local smoke tests PASSED
- [ ] Error logs cleaned
- [ ] Assets optimized (minified CSS/JS)
- [ ] Cache cleared: `php artisan config:cache`, `php artisan view:cache`

### Post-Deployment
- [ ] Run deployment endpoint: `POST /api/admin/deploy?key=SECRET`
- [ ] Verify migrations completed
- [ ] Verify seeder ran
- [ ] Verify storage link created
- [ ] Test login dengan credentials seeder
- [ ] Verify CORS working (frontend can call backend)
- [ ] Monitor logs untuk 24 hours: `tail -f storage/logs/api.log`

---

## NOTES

- **Preserve Test Data**: Jangan hapus test users/records selama development
- **Log Monitoring**: Cek `storage/logs/api.log` secara berkala untuk errors
- **Backup First**: Sebelum production deploy, backup database
- **Slow Networks**: Test juga di slow 3G network (DevTools → Throttle)
- **Database Stats**: Perhatikan growth - jika besar, perlu optimize queries
