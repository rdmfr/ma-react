// Centralized mock data for MA PULOSARI v3.0

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

export const stats = [
    { label: "Siswa Aktif", value: "842", icon: "Users" },
    { label: "Guru & Staff", value: "56", icon: "GraduationCap" },
    { label: "Prestasi", value: "120+", icon: "Trophy" },
    { label: "Akreditasi", value: "B", icon: "ShieldCheck" },
];

export const subjects = [
    { id: 1, name: "Matematika", code: "MTK" },
    { id: 2, name: "Bahasa Indonesia", code: "BIND" },
    { id: 3, name: "Bahasa Inggris", code: "BING" },
    { id: 4, name: "Fisika", code: "FIS" },
    { id: 5, name: "Biologi", code: "BIO" },
    { id: 6, name: "Kimia", code: "KIM" },
    { id: 7, name: "Sejarah", code: "SEJ" },
    { id: 8, name: "Fikih", code: "FIQ" },
    { id: 9, name: "Akidah Akhlak", code: "AA" },
    { id: 10, name: "Qur'an Hadits", code: "QH" },
    { id: 11, name: "Bahasa Arab", code: "BAR" },
    { id: 12, name: "PKn", code: "PKN" },
];

export const teachers = [
    { id: 1, slug: "kh-abdurrahman-mpdi", name: "K.H. Abdurrahman, M.Pd.I", subject: "Ketua Yayasan", photo: "", bio: "", education: "", contact: "", is_featured: true },
    { id: 2, slug: "imron-abdul-rojak-msi", name: "Imron Abdul Rojak, M.Si.", subject: "Kepala Sekolah", photo: "", bio: "", education: "", contact: "", is_featured: true },
    { id: 3, slug: "sofwan-saeful-malik-mpd", name: "Sofwan Saeful Malik, M.Pd.", subject: "Wakasek Bid. Akademik / Aqidah & SKI", photo: "", bio: "", education: "", contact: "", is_featured: true },
    { id: 4, slug: "azmi-amrullah-spd", name: "Azmi Amrullah, S.Pd.", subject: "Wakasek Bid. Kesiswaan / Biologi", photo: "", bio: "", education: "", contact: "", is_featured: true },
    { id: 5, slug: "asep-kusdrajat", name: "Asep Kusdrajat", subject: "Bendahara / Bahasa Sunda", photo: "", bio: "", education: "", contact: "" },
    { id: 6, slug: "hj-nani-nuraeni-sag-mm", name: "Hj. Nani Nuraeni, S.Ag., MM.", subject: "Al-Qur'an Hadits / Ilmu Hadits", photo: "", bio: "", education: "", contact: "" },
    { id: 7, slug: "faisal-mag", name: "Faisal, M.Ag.", subject: "Ilmu Tafsir", photo: "", bio: "", education: "", contact: "" },
    { id: 8, slug: "kh-cecep-suhrowardi-spd", name: "KH. Cecep Suhrowardi, S.Pd.", subject: "Bahasa Indonesia", photo: "", bio: "", education: "", contact: "" },
    { id: 9, slug: "kh-asep-saepul-hidayat-spd-mm", name: "KH. Asep Saepul Hidayat, S.Pd., MM.", subject: "Bahasa Arab", photo: "", bio: "", education: "", contact: "" },
    { id: 10, slug: "h-ade-hasyim-spd", name: "H. Ade Hasyim, S.Pd.", subject: "Bahasa Indonesia", photo: "", bio: "", education: "", contact: "" },
    { id: 11, slug: "dra-hj-ai-diniah", name: "Dra. Hj. Ai Diniah", subject: "Matematika", photo: "", bio: "", education: "", contact: "" },
    { id: 12, slug: "drs-h-sobarudin-mm", name: "Drs. H. Sobarudin, MM.", subject: "Kimia", photo: "", bio: "", education: "", contact: "" },
    { id: 13, slug: "tatu-samsudin-sag", name: "Tatu Samsudin, S.Ag.", subject: "PJOK", photo: "", bio: "", education: "", contact: "" },
    { id: 14, slug: "iim-abdurrohim-sag", name: "Iim Abdurrohim, S.Ag.", subject: "Ilmu Hadits", photo: "", bio: "", education: "", contact: "" },
    { id: 15, slug: "wildan-m-taufik-spdi", name: "Wildan M. Taufik, S.Pd.I.", subject: "Fiqih / Ushul Fiqih", photo: "", bio: "", education: "", contact: "" },
    { id: 16, slug: "dewi-faridaturrosidah-spd", name: "Dewi Faridaturrosidah, S.Pd.", subject: "Prakarya", photo: "", bio: "", education: "", contact: "" },
    { id: 17, slug: "teten-hanafiah-spd", name: "Teten Hanafiah, S.Pd..", subject: "Fisika", photo: "", bio: "", education: "", contact: "" },
    { id: 18, slug: "rudi-aziz-permana-spd", name: "Rudi Aziz Permana, S.Pd.", subject: "Matematika", photo: "", bio: "", education: "", contact: "" },
    { id: 19, slug: "heni-rohaeni-spd", name: "Heni Rohaeni, S.Pd.", subject: "Matematika", photo: "", bio: "", education: "", contact: "" },
    { id: 20, slug: "rifah-muharromah-spdi", name: "Rifah Muharromah, S.Pd.I.", subject: "SKI", photo: "", bio: "", education: "", contact: "" },
    { id: 21, slug: "diki-taqiyudin-sh", name: "Diki Taqiyudin, SH.", subject: "PPKn", photo: "", bio: "", education: "", contact: "" },
    { id: 22, slug: "budi-amaludin-spd", name: "Budi Amaludin, S.Pd.", subject: "Seni Budaya", photo: "", bio: "", education: "", contact: "" },
    { id: 23, slug: "rima-nabila-nuzula-mpd", name: "Rima Nabila Nuzula, M.Pd.", subject: "Bahasa Inggris", photo: "", bio: "", education: "", contact: "" },
    { id: 24, slug: "ana-nasirotul-haq-spd", name: "Ana Nasirotul Haq, S.Pd.", subject: "Fisika", photo: "", bio: "", education: "", contact: "" },
    { id: 25, slug: "mila-fauzi-amaliah-spd", name: "Mila Fauzi Amaliah, S.Pd.", subject: "Bahasa Inggris", photo: "", bio: "", education: "", contact: "" },
    { id: 26, slug: "siti-shofiatin-spd", name: "Siti Shofiatin, S,Pd.", subject: "Ekonomi", photo: "", bio: "", education: "", contact: "" },
    { id: 27, slug: "didah-fauziah-spd", name: "Didah Fauziah, S.Pd.", subject: "Sejarah Indonesia", photo: "", bio: "", education: "", contact: "" },
    { id: 28, slug: "n-lina-yulianti-spd", name: "N. Lina Yulianti, S.Pd.", subject: "Biologi", photo: "", bio: "", education: "", contact: "" },
    { id: 29, slug: "yuyus-hilman-farid-ssos", name: "Yuyus Hilman Farid, S.Sos.", subject: "PPKn", photo: "", bio: "", education: "", contact: "" },
    { id: 30, slug: "gilan-rifnaldi-ssos", name: "Gilan Rifnaldi, S.Sos.", subject: "Sosiologi / Sejarah Indonesia", photo: "", bio: "", education: "", contact: "" },
    { id: 31, slug: "fina-nur-fuady-spd", name: "Fina Nur Fuady, S.Pd.", subject: "Kimia", photo: "", bio: "", education: "", contact: "" },
    { id: 32, slug: "tasya-nailal-ulya-ssi", name: "Tasya Nailal Ulya, S.Si.", subject: "Matematika", photo: "", bio: "", education: "", contact: "" },
    { id: 33, slug: "habibie-nashih-alhaq-shum", name: "Habibie Nashih Alhaq, S.Hum.", subject: "Tata Usaha", photo: "", bio: "", education: "", contact: "" },
    { id: 34, slug: "ahmad-yafie-muharram-sikom", name: "Ahmad Yafie Muharram, S.I.Kom", subject: "Operator", photo: "", bio: "", education: "", contact: "" },
    { id: 35, slug: "ee-saepudin", name: "Ee Saepudin", subject: "Pegawai Umum", photo: "", bio: "", education: "", contact: "" },
];

export const classes = [
    { id: 1, name: "X IPA 1", grade: "X", homeroom: "Siti Nurhaliza, S.Pd", students: 32 },
    { id: 2, name: "X IPA 2", grade: "X", homeroom: "Dewi Kartika, S.Si", students: 30 },
    { id: 3, name: "X IPS 1", grade: "X", homeroom: "Bambang Sutrisno, S.Pd", students: 28 },
    { id: 4, name: "XI IPA 1", grade: "XI", homeroom: "Farah Amalia, S.Pd", students: 31 },
    { id: 5, name: "XI IPA 2", grade: "XI", homeroom: "Husna Fitri, M.Pd", students: 29 },
    { id: 6, name: "XI IPS 1", grade: "XI", homeroom: "Yusuf Mahendra, S.Pd.I", students: 27 },
    { id: 7, name: "XII IPA 1", grade: "XII", homeroom: "Ahmad Fauzi, M.Pd", students: 30 },
    { id: 8, name: "XII IPS 1", grade: "XII", homeroom: "Rahmat Hidayat, Lc", students: 26 },
];

export const students = Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    nis: `2024${String(10000 + i).padStart(5, '0')}`,
    name: ["Aisyah Putri","Budi Santoso","Cahya Ramadhan","Dinda Lestari","Eka Prasetya","Fadli Ibrahim","Gita Amanda","Hafiz Rahman","Indah Puspita","Joko Wijaya","Kirana Maharani","Lukman Hakim","Maulida Sari","Nurul Hidayah","Omar Abdullah","Putri Rahayu","Qori Anisa","Rafli Firmansyah","Sari Wulandari","Taufik Akbar","Umi Kultsum","Vina Melati","Wahyu Nugroho","Xena Putri","Yasmin Azzahra","Zulfikar Ali","Annisa Fitri","Bagus Pambudi","Cinta Laura","Damar Jati"][i],
    gender: i % 2 === 0 ? "P" : "L",
    class: ["X IPA 1","X IPA 2","XI IPA 1","XII IPA 1","XII IPS 1"][i % 5],
    status: i % 11 === 0 ? "Alumni" : "Aktif",
    photo: `https://i.pravatar.cc/120?img=${(i % 50) + 1}`,
}));

export const newsCategories = ["Akademik", "Prestasi", "Kegiatan", "Pengumuman"];

export const news = [
    { id: 1, slug: "juara-osn-provinsi-2025", title: "Siswa MA Pulosari Juara OSN Matematika Tingkat Provinsi", category: "Prestasi", excerpt: "Ananda Rafli Firmansyah berhasil meraih medali emas pada Olimpiade Sains Nasional tingkat provinsi Jawa Barat.", content: "Ananda Rafli Firmansyah dari kelas XII IPA 1 berhasil meraih medali emas pada Olimpiade Sains Nasional (OSN) bidang Matematika tingkat Provinsi Jawa Barat tahun 2025. Prestasi ini mengantarkan Rafli untuk mewakili Jawa Barat di tingkat nasional.\n\nPrestasi ini merupakan hasil dari pembinaan intensif yang dilakukan oleh tim guru Matematika MA Pulosari.", image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1200&q=80", author: "Admin", date: "2025-02-14", views: 1245 },
    { id: 2, slug: "festival-budaya-islami-2025", title: "Festival Budaya Islami 2025: Meriahkan Ramadhan", category: "Kegiatan", excerpt: "Rangkaian kegiatan menyambut bulan suci Ramadhan digelar selama satu pekan penuh.", content: "Festival Budaya Islami 2025 digelar selama satu pekan dengan berbagai lomba dan kegiatan spiritual.", image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&q=80", author: "OSIS", date: "2025-02-10", views: 892 },
    { id: 3, slug: "penerimaan-siswa-baru-2025", title: "PPDB 2025/2026 Resmi Dibuka", category: "Pengumuman", excerpt: "Pendaftaran dibuka mulai 1 Maret 2025 dengan berbagai jalur seleksi.", content: "Pendaftaran Peserta Didik Baru (PPDB) MA Pulosari tahun ajaran 2025/2026 resmi dibuka.", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80", author: "Admin", date: "2025-02-08", views: 2103 },
    { id: 4, slug: "studi-banding-ke-gontor", title: "Studi Banding Guru ke Pondok Modern Gontor", category: "Akademik", excerpt: "Tim guru mengikuti studi banding untuk meningkatkan kualitas pembelajaran diniyyah.", content: "Sebanyak 15 guru MA Pulosari mengikuti studi banding ke Pondok Modern Darussalam Gontor selama 3 hari.", image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&q=80", author: "Admin", date: "2025-02-03", views: 654 },
    { id: 5, slug: "kejuaraan-futsal-kabupaten", title: "Tim Futsal Putra Raih Runner-Up Kejuaraan Kabupaten", category: "Prestasi", excerpt: "Perjuangan tim futsal putra di kejuaraan antar madrasah se-Kabupaten Garut.", content: "Tim futsal putra MA Pulosari meraih posisi runner-up dalam kejuaraan antar madrasah se-Kabupaten Garut.", image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80", author: "OSIS", date: "2025-01-28", views: 478 },
    { id: 6, slug: "workshop-kurikulum-merdeka", title: "Workshop Implementasi Kurikulum Merdeka", category: "Akademik", excerpt: "Seluruh guru mengikuti workshop intensif selama 2 hari.", content: "Workshop implementasi Kurikulum Merdeka diikuti oleh seluruh guru MA Pulosari.", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80", author: "Admin", date: "2025-01-20", views: 321 },
];

export const reflections = [
    { id: 1, slug: "makna-ramadhan-bagi-pelajar", title: "Makna Ramadhan Bagi Seorang Pelajar", author: "Ust. Rahmat Hidayat, Lc", date: "2025-02-12", image: "https://images.unsplash.com/photo-1564769625392-651b2c0f1c4b?w=1200&q=80", excerpt: "Ramadhan bukan sekadar menahan lapar dan dahaga, tapi bagaimana kita mengasah jiwa...", content: "Bulan Ramadhan adalah madrasah terbaik bagi setiap muslim..." },
    { id: 2, slug: "integritas-di-era-digital", title: "Integritas di Era Digital: Tantangan Generasi Z", author: "Ahmad Fauzi, M.Pd", date: "2025-02-05", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80", excerpt: "Di tengah derasnya arus informasi, integritas menjadi benteng terakhir...", content: "Integritas adalah kesesuaian antara perkataan dan perbuatan..." },
    { id: 3, slug: "belajar-dari-rasulullah", title: "Belajar dari Keteladanan Rasulullah SAW", author: "Ust. Yusuf Mahendra", date: "2025-01-25", image: "https://images.unsplash.com/photo-1591123220162-910ba122d00a?w=1200&q=80", excerpt: "Sosok Rasulullah adalah teladan sempurna dalam segala aspek kehidupan...", content: "Setiap muslim wajib menjadikan Rasulullah sebagai teladan..." },
];

export const events = [
    { id: 1, title: "Ujian Tengah Semester Genap", date: "2025-03-10", time: "07:30", location: "Seluruh Kelas", type: "Akademik" },
    { id: 2, title: "Peringatan Isra' Mi'raj", date: "2025-03-20", time: "08:00", location: "Aula Utama", type: "Keagamaan" },
    { id: 3, title: "Pekan Olahraga Antar Kelas", date: "2025-03-25", time: "07:00", location: "Lapangan Madrasah", type: "Kesiswaan" },
    { id: 4, title: "Pesantren Ramadhan", date: "2025-04-01", time: "05:00", location: "Musholla Madrasah", type: "Keagamaan" },
    { id: 5, title: "Perpisahan Kelas XII", date: "2025-05-18", time: "08:00", location: "Aula Utama", type: "Kesiswaan" },
];

export const announcements = [
    { id: 1, title: "Jadwal Ujian Akhir Semester Genap", date: "2025-02-14", pinned: true, content: "Diberitahukan kepada seluruh siswa bahwa UAS Genap akan dilaksanakan mulai tanggal 5 Juni 2025. Harap mempersiapkan diri dengan baik." },
    { id: 2, title: "Libur Akhir Tahun Hijriah", date: "2025-02-12", pinned: false, content: "Libur bersama akhir tahun hijriah mulai 28 Juni s.d 2 Juli 2025." },
    { id: 3, title: "Pembayaran SPP Februari", date: "2025-02-08", pinned: false, content: "Batas pembayaran SPP bulan Februari paling lambat tanggal 20." },
    { id: 4, title: "Rapat Wali Murid", date: "2025-02-05", pinned: true, content: "Rapat wali murid kelas XII akan diadakan hari Sabtu pukul 08.00 WIB." },
];

export const extracurriculars = [
    { id: 1, slug: "multimedia", name: "Multimedia", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", description: "Kegiatan kreatif untuk desain, fotografi, dan produksi konten digital.", schedule: "Menyesuaikan jadwal sekolah", coach: "Pembina" },
    { id: 2, slug: "pmr", name: "PMR", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80", description: "Pelatihan pertolongan pertama, kesehatan, dan aksi kemanusiaan.", schedule: "Menyesuaikan jadwal sekolah", coach: "Pembina" },
    { id: 3, slug: "pramuka", name: "Pramuka", image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80", description: "Kepanduan untuk membentuk karakter tangguh, disiplin, dan mandiri.", schedule: "Menyesuaikan jadwal sekolah", coach: "Pembina" },
    { id: 4, slug: "marawiss", name: "Marawis", image: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=800&q=80", description: "Seni musik islami marawis untuk mengasah bakat dan kekompakan.", schedule: "Menyesuaikan jadwal sekolah", coach: "Pembina" },
    { id: 5, slug: "hadroh", name: "Hadroh", image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80", description: "Seni hadroh untuk melatih ritme, vokal sholawat, dan adab tampil.", schedule: "Menyesuaikan jadwal sekolah", coach: "Pembina" },
    { id: 6, slug: "olahraga", name: "Olahraga", image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80", description: "Pembinaan kebugaran, sportivitas, dan kerja sama tim.", schedule: "Menyesuaikan jadwal sekolah", coach: "Pembina" },
    { id: 7, slug: "kesenian", name: "Kesenian", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80", description: "Ruang ekspresi seni untuk mengembangkan kreativitas dan apresiasi budaya.", schedule: "Menyesuaikan jadwal sekolah", coach: "Pembina" },
];

export const studentWorks = [
    { id: 1, title: "Antologi Puisi Kelas XI", author: "Kelas XI IPS 1", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80", downloads: 124, fileSize: "2.4 MB", category: "Sastra" },
    { id: 2, title: "Penelitian Kualitas Air Sungai Pulosari", author: "Tim KIR", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80", downloads: 87, fileSize: "4.1 MB", category: "Sains" },
    { id: 3, title: "Kaligrafi Digital Asmaul Husna", author: "Ekskul Seni Rupa", image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80", downloads: 203, fileSize: "8.2 MB", category: "Seni" },
    { id: 4, title: "Aplikasi Kamus Arab-Indonesia", author: "Tim IT Siswa", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80", downloads: 312, fileSize: "12.1 MB", category: "Teknologi" },
    { id: 5, title: "Cerpen Remaja Islami", author: "Klub Menulis", image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&q=80", downloads: 156, fileSize: "1.8 MB", category: "Sastra" },
    { id: 6, title: "Video Dokumenter Sejarah Pulosari", author: "OSIS", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80", downloads: 98, fileSize: "142 MB", category: "Film" },
];

export const programStudies = [
    { id: 1, name: "MIPA (Matematika & Ilmu Pengetahuan Alam)", icon: "Atom", description: "Program peminatan sains dengan fokus Matematika, Fisika, Kimia, dan Biologi.", highlights: ["Lab sains", "Pembinaan prestasi", "Literasi & riset"] },
    { id: 2, name: "Ilmu Agama Islam", icon: "BookOpen", description: "Program peminatan keagamaan dengan fokus Al-Qur'an Hadits, Tafsir, Fiqih, Akhlak, dan Bahasa Arab.", highlights: ["Pembinaan tahfidz", "Kajian kitab", "Bina karakter"] },
];

export const alumni = [
    { id: 1, name: "dr. Rizky Ananda", year: 2018, profession: "Dokter Umum - RSUD Garut", photo: "https://i.pravatar.cc/120?img=12", testimonial: "MA Pulosari mengajarkan saya bahwa ilmu tanpa akhlak adalah kosong. Alhamdulillah, kini saya bisa mengabdi." },
    { id: 2, name: "Lia Fitriani, S.Ak", year: 2019, profession: "Auditor di KAP Ternama Jakarta", photo: "https://i.pravatar.cc/120?img=47", testimonial: "Disiplin dan integritas yang dibentuk di madrasah membekas hingga kini." },
    { id: 3, name: "Ustadz Faiz, Lc", year: 2017, profession: "Pengajar Pesantren Modern", photo: "https://i.pravatar.cc/120?img=15", testimonial: "Dari sini saya memulai perjalanan ke Al-Azhar. Terima kasih guru-guru MA Pulosari." },
    { id: 4, name: "Ir. Bagus Nugroho", year: 2016, profession: "Software Engineer di Perusahaan Teknologi", photo: "https://i.pravatar.cc/120?img=52", testimonial: "Pondasi akhlak yang kuat membuat saya bekerja dengan hati." },
    { id: 5, name: "Anisa Rahmah, S.H", year: 2018, profession: "Pengacara & Aktivis Pendidikan", photo: "https://i.pravatar.cc/120?img=48", testimonial: "Pendidikan di madrasah menumbuhkan kepedulian sosial dalam diri saya." },
    { id: 6, name: "Capt. Ramadhan", year: 2015, profession: "Penerbang TNI AU", photo: "https://i.pravatar.cc/120?img=59", testimonial: "Mimpi setinggi langit bermula dari bangku madrasah." },
];

export const galleries = [
    { id: 1, title: "Kegiatan Multimedia", category: "multimedia", cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", date: "2024-06-15", count: 1 },
    { id: 2, title: "Latihan PMR", category: "pmr", cover: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80", date: "2024-04-10", count: 1 },
    { id: 3, title: "Kegiatan Pramuka", category: "pramuka", cover: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80", date: "2024-12-15", count: 1 },
    { id: 4, title: "Marawis", category: "marawiss", cover: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=800&q=80", date: "2024-10-05", count: 1 },
    { id: 5, title: "Hadroh", category: "hadroh", cover: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80", date: "2024-10-22", count: 1 },
    { id: 6, title: "Olahraga", category: "olahraga", cover: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80", date: "2024-09-10", count: 1 },
    { id: 7, title: "Kesenian", category: "kesenian", cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80", date: "2024-08-21", count: 1 },
];

export const faqs = [
    { id: 1, category: "PPDB", q: "Bagaimana cara mendaftar di MA Pulosari?", a: "Pendaftaran dilakukan secara online melalui website atau datang langsung ke sekretariat PPDB." },
    { id: 2, category: "PPDB", q: "Kapan jadwal penerimaan siswa baru dibuka?", a: "PPDB dibuka setiap awal tahun ajaran, biasanya pada bulan Maret s.d Juni." },
    { id: 3, category: "Akademik", q: "Apa saja program studi yang tersedia?", a: "MAS YPI Pulosari memiliki 2 program peminatan: MIPA dan Ilmu Agama Islam." },
    { id: 4, category: "Akademik", q: "Bagaimana sistem penilaian rapor?", a: "Penilaian mengikuti Kurikulum Merdeka dengan bobot: Harian 40%, UTS 25%, UAS 35%." },
    { id: 5, category: "Fasilitas", q: "Apakah tersedia asrama untuk siswa?", a: "Ya, kami menyediakan asrama putra dan putri yang nyaman dan aman." },
    { id: 6, category: "Fasilitas", q: "Kegiatan ekstrakurikuler apa saja yang ada?", a: "Tersedia ekstrakurikuler: Multimedia, PMR, Pramuka, Marawis, Hadroh, Olahraga, dan Kesenian." },
    { id: 7, category: "Biaya", q: "Berapa biaya pendidikan per bulan?", a: "Biaya pendidikan bervariasi mulai dari Rp 350.000. Rincian lengkap di bagian kontak." },
];

export const modules = [
    { id: 1, title: "Modul Matematika Wajib Kelas X", subject: "Matematika", grade: "X", fileSize: "3.2 MB", downloads: 524, updatedAt: "2025-02-10" },
    { id: 2, title: "Modul Fisika Peminatan Kelas XI", subject: "Fisika", grade: "XI", fileSize: "5.7 MB", downloads: 312, updatedAt: "2025-02-08" },
    { id: 3, title: "Modul Bahasa Arab Tingkat Dasar", subject: "Bahasa Arab", grade: "X", fileSize: "2.1 MB", downloads: 678, updatedAt: "2025-02-05" },
    { id: 4, title: "Modul Fikih Kontemporer", subject: "Fikih", grade: "XII", fileSize: "4.3 MB", downloads: 245, updatedAt: "2025-02-01" },
    { id: 5, title: "Modul Biologi Peminatan", subject: "Biologi", grade: "XI", fileSize: "6.1 MB", downloads: 189, updatedAt: "2025-01-28" },
];

export const approvalQueue = [
    { id: 1, type: "Berita", title: "Laporan Kegiatan MABIT", submittedBy: "OSIS - Rizky", date: "2025-02-14", status: "pending" },
    { id: 2, type: "Modul", title: "Modul Sejarah Indonesia XII", submittedBy: "Bambang Sutrisno", date: "2025-02-13", status: "pending" },
    { id: 3, type: "Gallery", title: "Foto Classmeeting 2025", submittedBy: "OSIS - Rizky", date: "2025-02-12", status: "approved" },
    { id: 4, type: "Refleksi", title: "Makna Puasa bagi Pelajar", submittedBy: "Siti Nurhaliza", date: "2025-02-10", status: "rejected" },
    { id: 5, type: "Karya Siswa", title: "Antologi Puisi Remaja", submittedBy: "OSIS - Rizky", date: "2025-02-09", status: "pending" },
];

export const ppdbRegistrants = [
    { id: 1, name: "Ahmad Zaky", school: "MTs Al-Hidayah", phone: "081234567890", status: "Diterima", date: "2025-02-14" },
    { id: 2, name: "Bella Safitri", school: "SMP Negeri 1", phone: "081234567891", status: "Proses", date: "2025-02-14" },
    { id: 3, name: "Candra Wijaya", school: "MTs Nurul Islam", phone: "081234567892", status: "Wawancara", date: "2025-02-13" },
    { id: 4, name: "Dinda Kusuma", school: "SMP Muhammadiyah", phone: "081234567893", status: "Diterima", date: "2025-02-12" },
    { id: 5, name: "Eko Prasetyo", school: "MTs Al-Ikhlas", phone: "081234567894", status: "Proses", date: "2025-02-11" },
];

export const contactMessages = [
    { id: 1, name: "Orang Tua Ahmad", email: "parent1@mail.com", subject: "Konsultasi PPDB", date: "2025-02-14", read: false },
    { id: 2, name: "Budi Santoso", email: "budi@mail.com", subject: "Kunjungan ke madrasah", date: "2025-02-13", read: false },
    { id: 3, name: "Calon Siswa", email: "calon@mail.com", subject: "Beasiswa tersedia?", date: "2025-02-12", read: true },
    { id: 4, name: "Alumni 2010", email: "alumni@mail.com", subject: "Reuni akbar", date: "2025-02-11", read: true },
];

export const notifications = [
    { id: 1, title: "Pengajuan konten baru dari OSIS", time: "5 menit lalu", read: false, icon: "FileText" },
    { id: 2, title: "3 pesan baru dari calon wali murid", time: "1 jam lalu", read: false, icon: "Mail" },
    { id: 3, title: "Guru Bambang mengunggah modul baru", time: "3 jam lalu", read: true, icon: "BookOpen" },
    { id: 4, title: "PPDB: 5 pendaftar baru hari ini", time: "5 jam lalu", read: true, icon: "UserPlus" },
    { id: 5, title: "Backup database berhasil", time: "Kemarin", read: true, icon: "Database" },
];

export const activityLog = [
    { id: 1, user: "admin@mapulosari.sch.id", action: "LOGIN", target: "-", date: "2025-02-14 07:30" },
    { id: 2, user: "admin@mapulosari.sch.id", action: "CREATE", target: "news/juara-osn", date: "2025-02-14 08:12" },
    { id: 3, user: "guru@mapulosari.sch.id", action: "UPDATE", target: "scores/X-IPA-1", date: "2025-02-14 09:45" },
    { id: 4, user: "osis@mapulosari.sch.id", action: "SUBMIT", target: "gallery/classmeeting", date: "2025-02-14 10:20" },
    { id: 5, user: "admin@mapulosari.sch.id", action: "APPROVE", target: "approval/#3", date: "2025-02-14 11:05" },
    { id: 6, user: "admin@mapulosari.sch.id", action: "DELETE", target: "user/#12", date: "2025-02-14 12:30" },
];

const hydrateArray = (target, items) => {
    if (!Array.isArray(target) || !Array.isArray(items) || items.length === 0) return;
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

export const scores = [
    { studentId: 1, name: "Aisyah Putri", harian: 88, uts: 85, uas: 90, rerata: 87.8 },
    { studentId: 2, name: "Budi Santoso", harian: 75, uts: 78, uas: 80, rerata: 77.8 },
    { studentId: 3, name: "Cahya Ramadhan", harian: 92, uts: 90, uas: 88, rerata: 89.8 },
    { studentId: 4, name: "Dinda Lestari", harian: 82, uts: 85, uas: 87, rerata: 84.8 },
    { studentId: 5, name: "Eka Prasetya", harian: 70, uts: 72, uas: 75, rerata: 72.5 },
    { studentId: 6, name: "Fadli Ibrahim", harian: 85, uts: 88, uas: 90, rerata: 87.7 },
];

export const users = [
    { id: 1, name: "Ahmad Fauzi", email: "admin@mapulosari.sch.id", role: "Admin", status: "Aktif", lastLogin: "2025-02-14 08:00" },
    { id: 2, name: "Siti Nurhaliza", email: "guru@mapulosari.sch.id", role: "Guru", status: "Aktif", lastLogin: "2025-02-14 07:45" },
    { id: 3, name: "Rizky Pratama", email: "osis@mapulosari.sch.id", role: "OSIS", status: "Aktif", lastLogin: "2025-02-13 14:20" },
    { id: 4, name: "Dewi Kartika", email: "dewi@mapulosari.sch.id", role: "Guru", status: "Aktif", lastLogin: "2025-02-13 10:15" },
    { id: 5, name: "Bambang Sutrisno", email: "bambang@mapulosari.sch.id", role: "Guru", status: "Nonaktif", lastLogin: "2025-01-20 09:30" },
];

export const academicYears = [
    { id: 1, year: "2024/2025", semester: "Genap", active: true },
    { id: 2, year: "2024/2025", semester: "Ganjil", active: false },
    { id: 3, year: "2023/2024", semester: "Genap", active: false },
    { id: 4, year: "2023/2024", semester: "Ganjil", active: false },
];

export const evaluations = [
    { id: 1, title: "UTS Matematika X IPA 1", subject: "Matematika", class: "X IPA 1", date: "2025-03-10", type: "UTS" },
    { id: 2, title: "UH Bahasa Arab XI IPA 2", subject: "Bahasa Arab", class: "XI IPA 2", date: "2025-03-05", type: "UH" },
    { id: 3, title: "UAS Fisika XII IPA 1", subject: "Fisika", class: "XII IPA 1", date: "2025-05-20", type: "UAS" },
];
