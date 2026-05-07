# Page Design Spec (Desktop-first) — Porting ke Laravel Blade + Alpine

## Global Styles (Semua Halaman)
- Layout system: Hybrid CSS Grid + Flexbox. Grid untuk struktur halaman (header/content/footer), Flex untuk alignment komponen.
- Breakpoints: desktop-first (≥1280px sebagai default), adaptasi untuk tablet (≤1024px) dan mobile (≤640px).
- Design tokens:
  - Background: #0B1220 (admin) / #FFFFFF atau #0B1220 tergantung tema public yang existing
  - Surface: #111A2E, border: rgba(255,255,255,0.08)
  - Text: #E5E7EB, muted: #9CA3AF
  - Primary: #3B82F6, hover: #2563EB, danger: #EF4444
  - Radius: 10px, spacing scale: 4/8/12/16/24/32
- Typography:
  - Base 16px; H1 32–36, H2 24–28, H3 18–20
  - Line-height 1.5 untuk konten; rich text gunakan prose styling (typography plugin) + limit max-width.
- Buttons:
  - Primary: filled primary, hover gelap
  - Secondary: surface + border
  - Disabled: opacity 0.5, cursor not-allowed
- Links: underline on hover, fokus jelas (ring).
- Interaction & transitions: 150–200ms ease-in-out untuk hover, dropdown, modal.

---

## 1) Beranda Publik
### Layout
- Struktur: Header sticky + konten bertingkat (stacked sections) + Footer.
- Konten: max-width 1200–1280px, padding 24px desktop, 16px tablet, 12px mobile.

### Meta Information
- Title: "Beranda"
- Description: ringkas sesuai value utama situs
- Open Graph: og:title, og:description, og:image (default)

### Page Structure
1. Header
2. Hero/Section utama (mengikuti komponen React existing)
3. Section konten tambahan (yang sebelumnya belum lengkap) dengan placeholder state jelas bila data belum tersedia
4. Footer

### Sections & Components
- Header
  - Logo kiri, menu kanan, tombol CTA (opsional jika sudah ada sebelumnya)
  - Mobile: hamburger dengan drawer Alpine
- Hero
  - Judul besar + subjudul + CTA
- Content Sections
  - Card grid (3 kolom desktop, 2 tablet, 1 mobile)
  - Empty state: pesan singkat + CTA kembali ke beranda
- Footer
  - 2–4 kolom link + info perusahaan

---

## 2) Halaman Konten Publik (/p/{slug})
### Layout
- Struktur 2 kolom desktop: konten utama (8/12) + sidebar (4/12, opsional jika memang sudah ada). Jika tidak ada sidebar pada versi React, gunakan 1 kolom.
- Gunakan CSS typography untuk konten rich text.

### Meta Information
- Title: "{title}"
- Description: ambil ringkasan pertama dari konten (atau field excerpt bila ada)
- Open Graph: og:title, og:description, og:type=article, og:image (first image jika ada)

### Page Structure
1. Breadcrumbs (opsional, jika sudah ada sebelumnya)
2. Judul + meta (tanggal/status)
3. Body rich text (render HTML)
4. Media embed (gambar/file) di dalam body

### Sections & Components
- Content header: title + meta
- Content body:
  - Style heading/list/code/blockquote/table
  - Keamanan: render HTML dengan sanitasi/whitelist tag
- 404 state:
  - Title "Konten tidak ditemukan" + link kembali

---

## 3) Login
### Layout
- Centered auth card (max-width 420px) di atas background.
- Form layout: vertical, gap 12–16.

### Meta Information
- Title: "Login"
- Description: "Masuk untuk mengelola dashboard"

### Page Structure
1. Brand header kecil
2. Auth card: email + password + tombol submit
3. Error banner inline

### Sections & Components
- Input states: default, focus ring, error (border merah + helper text)
- Submit loading state: disabled + spinner kecil
- Redirect: setelah login sukses menuju /admin

---

## 4) Dashboard Admin (/admin dan /admin/{module}*)
### Layout
- Desktop-first dashboard shell:
  - Sidebar kiri fixed (280px)
  - Topbar di area konten
  - Main content scroll
- Tablet/mobile: sidebar berubah jadi drawer (Alpine: x-show + overlay).

### Meta Information
- Title: "Dashboard"
- Description: ringkas sesuai modul
- Open Graph: tidak perlu (noindex)

### Page Structure
1. Sidebar navigation
2. Topbar: judul halaman + aksi utama (Tambah)
3. Area konten:
  - Halaman list (tabel)
  - Halaman form (create/edit)

### Sections & Components
- Sidebar
  - Daftar modul mengikuti dashboard React (tanpa menambah modul baru)
  - Item aktif + icon
- List Page (/admin/{module})
  - Toolbar: search (jika ada), tombol tambah
  - Table: kolom inti + aksi (Edit/Hapus)
  - Pagination di bawah
  - Empty state dengan tombol tambah
- Form Page (/admin/{module}/create, /edit)
  - Form sections: field umum, rich text editor, upload
  - Validasi server-side tampil inline per field
  - Action bar: Simpan, Batal
- Upload UI
  - Single/multi file sesuai kebutuhan modul
  - Preview thumbnail untuk gambar
  - Progress bar (Alpine) bila upload async
- Rich Text Editor
  - Toolbar dasar: bold/italic/heading/list/link/image
  - Insert image: memanggil endpoint upload lalu embed URL
- Dialog Konfirmasi Hapus
  - Modal dengan overlay + tombol "Hapus" (danger) dan "Batal"

### Responsive & Accessibility
- Keyboard navigation untuk menu, modal focus-trap.
- Kontras warna minimal AA.
- Tabel pada mobile berubah ke card list (stacked rows) bila diperlukan.
