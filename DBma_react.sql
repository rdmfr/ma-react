-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2026 at 04:11 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ma_react`
--

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2026_05_01_000000_create_status_checks_table', 1),
(6, '2026_05_01_010000_create_records_table', 1),
(7, '2026_05_01_020000_add_profile_fields_to_users_table', 1),
(8, '2026_05_01_030000_add_extra_fields_to_users_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `records`
--

CREATE TABLE `records` (
  `id` char(36) NOT NULL,
  `type` varchar(64) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `records`
--

INSERT INTO `records` (`id`, `type`, `data`, `created_at`, `updated_at`) VALUES
('00000000-0000-4000-8000-000000000001', 'branding', '{\"id\":\"00000000-0000-4000-8000-000000000001\",\"schoolName\":\"MAS YPI Pulosari\",\"schoolShort\":\"MAS YPI\",\"schoolTagline\":\"Madrasah Aliyah Berkarakter, Berilmu, Berakhlak\",\"accreditationLabel\":\"B\",\"heroImageUrl\":\"\\/storage\\/uploads\\/branding\\/Q2yEEXTlrChIEP7LrFtSwa6Gl832W4fj5U6jqelN.jpg\",\"heroImageAlt\":\"Kegiatan siswa\",\"address\":\"Jl. Raya Bandung-Tasik Km. 45 Kp. Pulosari, Ds. Cijolang, Kec. Blubur Limbangan, Kab. Garut, Jawa Barat 44186\",\"email\":\"info@masypipulosari.sch.id\",\"phone\":\"-\",\"instagram\":\"@masypipulosari\",\"facebook\":\"MAS YPI Pulosari\",\"youtube\":\"MAS YPI Pulosari\",\"status\":\"approved\",\"mapEmbed\":\"https:\\/\\/www.openstreetmap.org\\/export\\/embed.html?bbox=109.3%2C-7.1%2C109.5%2C-7.0&layer=mapnik\",\"accentColor\":\"#10b981\",\"darkColor\":\"#064e3b\",\"logoUrl\":\"\\/storage\\/uploads\\/branding\\/LDbV9K9XjtPQJuPxc5jZ4Dg66CSxdHWluMziDYyO.png\",\"profileImageUrl\":\"\\/storage\\/uploads\\/branding\\/a13hSy4Qesw0rcwKXXUgQ9eTHfkf5ZVZP575G02G.jpg\"}', '2026-05-07 05:19:51', '2026-05-07 06:23:29'),
('11111111-1111-4111-8111-111111111111', 'programStudies', '{\"id\":\"11111111-1111-4111-8111-111111111111\",\"name\":\"MIPA (Matematika & Ilmu Pengetahuan Alam)\",\"slug\":\"mipa\",\"icon\":\"Atom\",\"description\":\"Program peminatan sains dengan fokus Matematika, Fisika, Kimia, dan Biologi.\",\"highlights\":[\"Lab sains\",\"Pembinaan prestasi\",\"Literasi & riset\"],\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('22222222-2222-4222-8222-222222222222', 'programStudies', '{\"id\":\"22222222-2222-4222-8222-222222222222\",\"name\":\"Ilmu Agama Islam\",\"slug\":\"ilmu-agama-islam\",\"icon\":\"BookOpen\",\"description\":\"Program peminatan keagamaan dengan fokus Al-Qur\'an Hadits, Tafsir, Fiqih, Akhlak, dan Bahasa Arab.\",\"highlights\":[\"Pembinaan tahfidz\",\"Kajian kitab\",\"Bina karakter\"],\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('30000000-0000-4300-8300-000000000001', 'extracurriculars', '{\"id\":\"30000000-0000-4300-8300-000000000001\",\"slug\":\"multimedia\",\"name\":\"Multimedia\",\"image\":\"https:\\/\\/images.unsplash.com\\/photo-1518770660439-4636190af475?w=800&q=80\",\"description\":\"Kegiatan kreatif untuk desain, fotografi, dan produksi konten digital.\",\"schedule\":\"Menyesuaikan jadwal sekolah\",\"coach\":\"Pembina\",\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('30000000-0000-4300-8300-000000000002', 'extracurriculars', '{\"id\":\"30000000-0000-4300-8300-000000000002\",\"slug\":\"pmr\",\"name\":\"PMR\",\"image\":\"https:\\/\\/images.unsplash.com\\/photo-1587854692152-cbe660dbde88?w=800&q=80\",\"description\":\"Pelatihan pertolongan pertama, kesehatan, dan aksi kemanusiaan.\",\"schedule\":\"Menyesuaikan jadwal sekolah\",\"coach\":\"Pembina\",\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('30000000-0000-4300-8300-000000000003', 'extracurriculars', '{\"id\":\"30000000-0000-4300-8300-000000000003\",\"slug\":\"pramuka\",\"name\":\"Pramuka\",\"image\":\"https:\\/\\/images.unsplash.com\\/photo-1509099836639-18ba1795216d?w=800&q=80\",\"description\":\"Kepanduan untuk membentuk karakter tangguh, disiplin, dan mandiri.\",\"schedule\":\"Menyesuaikan jadwal sekolah\",\"coach\":\"Pembina\",\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('30000000-0000-4300-8300-000000000004', 'extracurriculars', '{\"id\":\"30000000-0000-4300-8300-000000000004\",\"slug\":\"marawiss\",\"name\":\"Marawis\",\"image\":\"https:\\/\\/images.unsplash.com\\/photo-1519682577862-22b62b24e493?w=800&q=80\",\"description\":\"Seni musik islami marawis untuk mengasah bakat dan kekompakan.\",\"schedule\":\"Menyesuaikan jadwal sekolah\",\"coach\":\"Pembina\",\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('30000000-0000-4300-8300-000000000005', 'extracurriculars', '{\"id\":\"30000000-0000-4300-8300-000000000005\",\"slug\":\"hadroh\",\"name\":\"Hadroh\",\"image\":\"https:\\/\\/images.unsplash.com\\/photo-1542816417-0983c9c9ad53?w=800&q=80\",\"description\":\"Seni hadroh untuk melatih ritme, vokal sholawat, dan adab tampil.\",\"schedule\":\"Menyesuaikan jadwal sekolah\",\"coach\":\"Pembina\",\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('30000000-0000-4300-8300-000000000006', 'extracurriculars', '{\"id\":\"30000000-0000-4300-8300-000000000006\",\"slug\":\"olahraga\",\"name\":\"Olahraga\",\"image\":\"https:\\/\\/images.unsplash.com\\/photo-1551958219-acbc608c6377?w=800&q=80\",\"description\":\"Pembinaan kebugaran, sportivitas, dan kerja sama tim.\",\"schedule\":\"Menyesuaikan jadwal sekolah\",\"coach\":\"Pembina\",\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('30000000-0000-4300-8300-000000000007', 'extracurriculars', '{\"id\":\"30000000-0000-4300-8300-000000000007\",\"slug\":\"kesenian\",\"name\":\"Kesenian\",\"image\":\"https:\\/\\/images.unsplash.com\\/photo-1511379938547-c1f69419868d?w=800&q=80\",\"description\":\"Ruang ekspresi seni untuk mengembangkan kreativitas dan apresiasi budaya.\",\"schedule\":\"Menyesuaikan jadwal sekolah\",\"coach\":\"Pembina\",\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000001', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000001\",\"name\":\"K.H. Abdurrahman, M.Pd.I\",\"subject\":\"Ketua Yayasan\",\"slug\":\"kh-abdurrahman-mpdi\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":true,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000002', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000002\",\"name\":\"Imron Abdul Rojak, M.Si.\",\"subject\":\"Kepala Sekolah\",\"slug\":\"imron-abdul-rojak-msi\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":true,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000003', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000003\",\"name\":\"Sofwan Saeful Malik, M.Pd.\",\"subject\":\"Wakasek Bid. Akademik \\/ Aqidah & SKI\",\"slug\":\"sofwan-saeful-malik-mpd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":true,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000004', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000004\",\"name\":\"Azmi Amrullah, S.Pd.\",\"subject\":\"Wakasek Bid. Kesiswaan \\/ Biologi\",\"slug\":\"azmi-amrullah-spd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":true,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000005', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000005\",\"name\":\"Asep Kusdrajat\",\"subject\":\"Bendahara \\/ Bahasa Sunda\",\"slug\":\"asep-kusdrajat\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000006', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000006\",\"name\":\"Hj. Nani Nuraeni, S.Ag., MM.\",\"subject\":\"Al-Qur\'an Hadits \\/ Ilmu Hadits\",\"slug\":\"hj-nani-nuraeni-sag-mm\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000007', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000007\",\"name\":\"Faisal, M.Ag.\",\"subject\":\"Ilmu Tafsir\",\"slug\":\"faisal-mag\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000008', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000008\",\"name\":\"KH. Cecep Suhrowardi, S.Pd.\",\"subject\":\"Bahasa Indonesia\",\"slug\":\"kh-cecep-suhrowardi-spd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000009', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000009\",\"name\":\"KH. Asep Saepul Hidayat, S.Pd., MM.\",\"subject\":\"Bahasa Arab\",\"slug\":\"kh-asep-saepul-hidayat-spd-mm\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000010', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000010\",\"name\":\"H. Ade Hasyim, S.Pd.\",\"subject\":\"Bahasa Indonesia\",\"slug\":\"h-ade-hasyim-spd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000011', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000011\",\"name\":\"Dra. Hj. Ai Diniah\",\"subject\":\"Matematika\",\"slug\":\"dra-hj-ai-diniah\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000012', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000012\",\"name\":\"Drs. H. Sobarudin, MM.\",\"subject\":\"Kimia\",\"slug\":\"drs-h-sobarudin-mm\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000013', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000013\",\"name\":\"Tatu Samsudin, S.Ag.\",\"subject\":\"PJOK\",\"slug\":\"tatu-samsudin-sag\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000014', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000014\",\"name\":\"Iim Abdurrohim, S.Ag.\",\"subject\":\"Ilmu Hadits\",\"slug\":\"iim-abdurrohim-sag\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000015', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000015\",\"name\":\"Wildan M. Taufik, S.Pd.I.\",\"subject\":\"Fiqih \\/ Ushul Fiqih\",\"slug\":\"wildan-m-taufik-spdi\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000016', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000016\",\"name\":\"Dewi Faridaturrosidah, S.Pd.\",\"subject\":\"Prakarya\",\"slug\":\"dewi-faridaturrosidah-spd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000017', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000017\",\"name\":\"Teten Hanafiah, S.Pd..\",\"subject\":\"Fisika\",\"slug\":\"teten-hanafiah-spd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000018', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000018\",\"name\":\"Rudi Aziz Permana, S.Pd.\",\"subject\":\"Matematika\",\"slug\":\"rudi-aziz-permana-spd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000019', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000019\",\"name\":\"Heni Rohaeni, S.Pd.\",\"subject\":\"Matematika\",\"slug\":\"heni-rohaeni-spd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000020', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000020\",\"name\":\"Rifah Muharromah, S.Pd.I.\",\"subject\":\"SKI\",\"slug\":\"rifah-muharromah-spdi\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000021', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000021\",\"name\":\"Diki Taqiyudin, SH.\",\"subject\":\"PPKn\",\"slug\":\"diki-taqiyudin-sh\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000022', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000022\",\"name\":\"Budi Amaludin, S.Pd.\",\"subject\":\"Seni Budaya\",\"slug\":\"budi-amaludin-spd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000023', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000023\",\"name\":\"Rima Nabila Nuzula, M.Pd.\",\"subject\":\"Bahasa Inggris\",\"slug\":\"rima-nabila-nuzula-mpd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000024', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000024\",\"name\":\"Ana Nasirotul Haq, S.Pd.\",\"subject\":\"Fisika\",\"slug\":\"ana-nasirotul-haq-spd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000025', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000025\",\"name\":\"Mila Fauzi Amaliah, S.Pd.\",\"subject\":\"Bahasa Inggris\",\"slug\":\"mila-fauzi-amaliah-spd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000026', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000026\",\"name\":\"Siti Shofiatin, S,Pd.\",\"subject\":\"Ekonomi\",\"slug\":\"siti-shofiatin-spd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000027', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000027\",\"name\":\"Didah Fauziah, S.Pd.\",\"subject\":\"Sejarah Indonesia\",\"slug\":\"didah-fauziah-spd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000028', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000028\",\"name\":\"N. Lina Yulianti, S.Pd.\",\"subject\":\"Biologi\",\"slug\":\"n-lina-yulianti-spd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000029', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000029\",\"name\":\"Yuyus Hilman Farid, S.Sos.\",\"subject\":\"PPKn\",\"slug\":\"yuyus-hilman-farid-ssos\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000030', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000030\",\"name\":\"Gilan Rifnaldi, S.Sos.\",\"subject\":\"Sosiologi \\/ Sejarah Indonesia\",\"slug\":\"gilan-rifnaldi-ssos\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000031', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000031\",\"name\":\"Fina Nur Fuady, S.Pd.\",\"subject\":\"Kimia\",\"slug\":\"fina-nur-fuady-spd\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000032', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000032\",\"name\":\"Tasya Nailal Ulya, S.Si.\",\"subject\":\"Matematika\",\"slug\":\"tasya-nailal-ulya-ssi\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000033', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000033\",\"name\":\"Habibie Nashih Alhaq, S.Hum.\",\"subject\":\"Tata Usaha\",\"slug\":\"habibie-nashih-alhaq-shum\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000034', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000034\",\"name\":\"Ahmad Yafie Muharram, S.I.Kom\",\"subject\":\"Operator\",\"slug\":\"ahmad-yafie-muharram-sikom\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('40000000-0000-4400-8400-000000000035', 'teachers', '{\"id\":\"40000000-0000-4400-8400-000000000035\",\"name\":\"Ee Saepudin\",\"subject\":\"Pegawai Umum\",\"slug\":\"ee-saepudin\",\"photo\":\"\",\"bio\":\"\",\"education\":\"\",\"contact\":\"\",\"is_featured\":false,\"status\":\"approved\"}', '2026-05-07 05:19:51', '2026-05-07 05:19:51'),
('a1b908f0-c9d6-4403-95fb-fe70b6addb76', 'academicYears', '{\"year\":\"2026\\/2027\",\"semester\":\"Ganjil\",\"is_active\":\"Aktif\"}', '2026-05-07 06:35:10', '2026-05-07 06:35:10');

-- --------------------------------------------------------

--
-- Table structure for table `status_checks`
--

CREATE TABLE `status_checks` (
  `id` char(36) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(32) NOT NULL DEFAULT 'teacher',
  `status` varchar(32) NOT NULL DEFAULT 'active',
  `avatar_url` varchar(255) DEFAULT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `class_name` varchar(64) DEFAULT NULL,
  `position` varchar(64) DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `status`, `avatar_url`, `phone`, `bio`, `class_name`, `position`, `last_login_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Ahmad Fauzi', 'admin@mapulosari.sch.id', NULL, '$2y$12$.DQcHavpcrM5N5.E3LB09u4NJ3T0eo2wyxqjOgLxVZVhS23GblrJe', 'admin', 'active', 'https://i.pravatar.cc/120?img=13', NULL, NULL, NULL, NULL, NULL, 'D2EdjLc6g1rycw9WY5flGGlIaNVltEtgYbNqQwRIQfW6V9Py2VtcXD1ltaRf', '2026-05-07 05:19:50', '2026-05-07 05:19:50'),
(2, 'Siti Nurhaliza, S.Pd', 'guru@mapulosari.sch.id', NULL, '$2y$12$1iblM2x8BvE62hElKZ8FK.dZyrnId/0kisxd1pV8ccCGpljyTcQAq', 'teacher', 'active', 'https://i.pravatar.cc/120?img=45', NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-07 05:19:50', '2026-05-07 05:19:50'),
(3, 'Rizky Pratama', 'osis@mapulosari.sch.id', NULL, '$2y$12$afv1xscJCNKAHksku/DyuedBH05fK5PpL/dQEpJpfZ7u1yMh8FUSW', 'osis', 'active', 'https://i.pravatar.cc/120?img=33', NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-07 05:19:51', '2026-05-07 05:19:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `records`
--
ALTER TABLE `records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `records_type_index` (`type`);

--
-- Indexes for table `status_checks`
--
ALTER TABLE `status_checks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
