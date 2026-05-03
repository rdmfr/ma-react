<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Record;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Database Seeder - Idempotent for Production
 * 
 * Menjalankan seeder:
 *   php artisan db:seed
 *   php artisan migrate:fresh --seed (untuk testing, reset database)
 * 
 * Aman untuk production karena menggunakan updateOrCreate:
 * - Tidak akan duplikat jika user sudah ada
 * - Password default untuk initial setup, harus diubah saat login pertama
 */
class DatabaseSeeder extends Seeder
{
    private function seedRecord(string $id, string $type, array $data): void
    {
        Record::query()->updateOrCreate(
            ['id' => $id],
            ['type' => $type, 'data' => $data]
        );
    }

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin user - initialize for production setup
        User::query()->updateOrCreate(
            ['email' => 'admin@mapulosari.sch.id'],
            [
                'name' => 'Ahmad Fauzi',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'status' => 'active',
                'avatar_url' => 'https://i.pravatar.cc/120?img=13',
            ]
        );

        // Teacher user - for testing
        User::query()->updateOrCreate(
            ['email' => 'guru@mapulosari.sch.id'],
            [
                'name' => 'Siti Nurhaliza, S.Pd',
                'password' => Hash::make('guru123'),
                'role' => 'teacher',
                'status' => 'active',
                'avatar_url' => 'https://i.pravatar.cc/120?img=45',
            ]
        );

        // OSIS user - for testing
        User::query()->updateOrCreate(
            ['email' => 'osis@mapulosari.sch.id'],
            [
                'name' => 'Rizky Pratama',
                'password' => Hash::make('osis123'),
                'role' => 'osis',
                'status' => 'active',
                'avatar_url' => 'https://i.pravatar.cc/120?img=33',
            ]
        );

        $this->seedPublicContent();
    }

    private function seedPublicContent(): void
    {
        $this->seedRecord('00000000-0000-4000-8000-000000000001', 'branding', [
            'id' => '00000000-0000-4000-8000-000000000001',
            'schoolName' => 'MAS YPI Pulosari',
            'schoolShort' => 'MAS YPI',
            'schoolTagline' => 'Madrasah Aliyah Berkarakter, Berilmu, Berakhlak',
            'accreditationLabel' => 'B',
            'heroImageUrl' => 'https://images.unsplash.com/photo-1610208322247-18af7775da05?w=900&q=80',
            'heroImageAlt' => 'Kegiatan siswa',
            'address' => 'Jl. Raya Bandung-Tasik Km. 45 Kp. Pulosari, Ds. Cijolang, Kec. Blubur Limbangan, Kab. Garut, Jawa Barat 44186',
            'email' => 'info@masypipulosari.sch.id',
            'phone' => '-',
            'instagram' => '@masypipulosari',
            'facebook' => 'MAS YPI Pulosari',
            'youtube' => 'MAS YPI Pulosari',
            'status' => 'approved',
        ]);

        return;

        $programs = [
            [
                'id' => '11111111-1111-4111-8111-111111111111',
                'name' => 'MIPA (Matematika & Ilmu Pengetahuan Alam)',
                'slug' => 'mipa',
                'icon' => 'Atom',
                'description' => 'Program peminatan sains dengan fokus Matematika, Fisika, Kimia, dan Biologi.',
                'highlights' => ['Lab sains', 'Pembinaan prestasi', 'Literasi & riset'],
                'status' => 'approved',
            ],
            [
                'id' => '22222222-2222-4222-8222-222222222222',
                'name' => 'Ilmu Agama Islam',
                'slug' => 'ilmu-agama-islam',
                'icon' => 'BookOpen',
                'description' => 'Program peminatan keagamaan dengan fokus Al-Qur\'an Hadits, Tafsir, Fiqih, Akhlak, dan Bahasa Arab.',
                'highlights' => ['Pembinaan tahfidz', 'Kajian kitab', 'Bina karakter'],
                'status' => 'approved',
            ],
        ];

        foreach ($programs as $p) {
            $this->seedRecord($p['id'], 'programStudies', [
                'id' => $p['id'],
                'name' => $p['name'],
                'slug' => $p['slug'],
                'icon' => $p['icon'],
                'description' => $p['description'],
                'highlights' => $p['highlights'],
                'status' => $p['status'],
            ]);
        }

        $extras = [
            ['id' => '30000000-0000-4300-8300-000000000001', 'slug' => 'multimedia', 'name' => 'Multimedia', 'image' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 'description' => 'Kegiatan kreatif untuk desain, fotografi, dan produksi konten digital.'],
            ['id' => '30000000-0000-4300-8300-000000000002', 'slug' => 'pmr', 'name' => 'PMR', 'image' => 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80', 'description' => 'Pelatihan pertolongan pertama, kesehatan, dan aksi kemanusiaan.'],
            ['id' => '30000000-0000-4300-8300-000000000003', 'slug' => 'pramuka', 'name' => 'Pramuka', 'image' => 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80', 'description' => 'Kepanduan untuk membentuk karakter tangguh, disiplin, dan mandiri.'],
            ['id' => '30000000-0000-4300-8300-000000000004', 'slug' => 'marawiss', 'name' => 'Marawis', 'image' => 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=800&q=80', 'description' => 'Seni musik islami marawis untuk mengasah bakat dan kekompakan.'],
            ['id' => '30000000-0000-4300-8300-000000000005', 'slug' => 'hadroh', 'name' => 'Hadroh', 'image' => 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80', 'description' => 'Seni hadroh untuk melatih ritme, vokal sholawat, dan adab tampil.'],
            ['id' => '30000000-0000-4300-8300-000000000006', 'slug' => 'olahraga', 'name' => 'Olahraga', 'image' => 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80', 'description' => 'Pembinaan kebugaran, sportivitas, dan kerja sama tim.'],
            ['id' => '30000000-0000-4300-8300-000000000007', 'slug' => 'kesenian', 'name' => 'Kesenian', 'image' => 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80', 'description' => 'Ruang ekspresi seni untuk mengembangkan kreativitas dan apresiasi budaya.'],
        ];

        foreach ($extras as $e) {
            $this->seedRecord($e['id'], 'extracurriculars', [
                'id' => $e['id'],
                'slug' => $e['slug'],
                'name' => $e['name'],
                'image' => $e['image'],
                'description' => $e['description'],
                'schedule' => 'Menyesuaikan jadwal sekolah',
                'coach' => 'Pembina',
                'status' => 'approved',
            ]);
        }

        $staff = [
            ['id' => '40000000-0000-4400-8400-000000000001', 'name' => 'K.H. Abdurrahman, M.Pd.I', 'subject' => 'Ketua Yayasan'],
            ['id' => '40000000-0000-4400-8400-000000000002', 'name' => 'Imron Abdul Rojak, M.Si.', 'subject' => 'Kepala Sekolah'],
            ['id' => '40000000-0000-4400-8400-000000000003', 'name' => 'Sofwan Saeful Malik, M.Pd.', 'subject' => 'Wakasek Bid. Akademik / Aqidah & SKI'],
            ['id' => '40000000-0000-4400-8400-000000000004', 'name' => 'Azmi Amrullah, S.Pd.', 'subject' => 'Wakasek Bid. Kesiswaan / Biologi'],
            ['id' => '40000000-0000-4400-8400-000000000005', 'name' => 'Asep Kusdrajat', 'subject' => 'Bendahara / Bahasa Sunda'],
            ['id' => '40000000-0000-4400-8400-000000000006', 'name' => 'Hj. Nani Nuraeni, S.Ag., MM.', 'subject' => "Al-Qur'an Hadits / Ilmu Hadits"],
            ['id' => '40000000-0000-4400-8400-000000000007', 'name' => 'Faisal, M.Ag.', 'subject' => 'Ilmu Tafsir'],
            ['id' => '40000000-0000-4400-8400-000000000008', 'name' => 'KH. Cecep Suhrowardi, S.Pd.', 'subject' => 'Bahasa Indonesia'],
            ['id' => '40000000-0000-4400-8400-000000000009', 'name' => 'KH. Asep Saepul Hidayat, S.Pd., MM.', 'subject' => 'Bahasa Arab'],
            ['id' => '40000000-0000-4400-8400-000000000010', 'name' => 'H. Ade Hasyim, S.Pd.', 'subject' => 'Bahasa Indonesia'],
            ['id' => '40000000-0000-4400-8400-000000000011', 'name' => 'Dra. Hj. Ai Diniah', 'subject' => 'Matematika'],
            ['id' => '40000000-0000-4400-8400-000000000012', 'name' => 'Drs. H. Sobarudin, MM.', 'subject' => 'Kimia'],
            ['id' => '40000000-0000-4400-8400-000000000013', 'name' => 'Tatu Samsudin, S.Ag.', 'subject' => 'PJOK'],
            ['id' => '40000000-0000-4400-8400-000000000014', 'name' => 'Iim Abdurrohim, S.Ag.', 'subject' => 'Ilmu Hadits'],
            ['id' => '40000000-0000-4400-8400-000000000015', 'name' => 'Wildan M. Taufik, S.Pd.I.', 'subject' => 'Fiqih / Ushul Fiqih'],
            ['id' => '40000000-0000-4400-8400-000000000016', 'name' => 'Dewi Faridaturrosidah, S.Pd.', 'subject' => 'Prakarya'],
            ['id' => '40000000-0000-4400-8400-000000000017', 'name' => 'Teten Hanafiah, S.Pd..', 'subject' => 'Fisika'],
            ['id' => '40000000-0000-4400-8400-000000000018', 'name' => 'Rudi Aziz Permana, S.Pd.', 'subject' => 'Matematika'],
            ['id' => '40000000-0000-4400-8400-000000000019', 'name' => 'Heni Rohaeni, S.Pd.', 'subject' => 'Matematika'],
            ['id' => '40000000-0000-4400-8400-000000000020', 'name' => 'Rifah Muharromah, S.Pd.I.', 'subject' => 'SKI'],
            ['id' => '40000000-0000-4400-8400-000000000021', 'name' => 'Diki Taqiyudin, SH.', 'subject' => 'PPKn'],
            ['id' => '40000000-0000-4400-8400-000000000022', 'name' => 'Budi Amaludin, S.Pd.', 'subject' => 'Seni Budaya'],
            ['id' => '40000000-0000-4400-8400-000000000023', 'name' => 'Rima Nabila Nuzula, M.Pd.', 'subject' => 'Bahasa Inggris'],
            ['id' => '40000000-0000-4400-8400-000000000024', 'name' => 'Ana Nasirotul Haq, S.Pd.', 'subject' => 'Fisika'],
            ['id' => '40000000-0000-4400-8400-000000000025', 'name' => 'Mila Fauzi Amaliah, S.Pd.', 'subject' => 'Bahasa Inggris'],
            ['id' => '40000000-0000-4400-8400-000000000026', 'name' => 'Siti Shofiatin, S,Pd.', 'subject' => 'Ekonomi'],
            ['id' => '40000000-0000-4400-8400-000000000027', 'name' => 'Didah Fauziah, S.Pd.', 'subject' => 'Sejarah Indonesia'],
            ['id' => '40000000-0000-4400-8400-000000000028', 'name' => 'N. Lina Yulianti, S.Pd.', 'subject' => 'Biologi'],
            ['id' => '40000000-0000-4400-8400-000000000029', 'name' => 'Yuyus Hilman Farid, S.Sos.', 'subject' => 'PPKn'],
            ['id' => '40000000-0000-4400-8400-000000000030', 'name' => 'Gilan Rifnaldi, S.Sos.', 'subject' => 'Sosiologi / Sejarah Indonesia'],
            ['id' => '40000000-0000-4400-8400-000000000031', 'name' => 'Fina Nur Fuady, S.Pd.', 'subject' => 'Kimia'],
            ['id' => '40000000-0000-4400-8400-000000000032', 'name' => 'Tasya Nailal Ulya, S.Si.', 'subject' => 'Matematika'],
            ['id' => '40000000-0000-4400-8400-000000000033', 'name' => 'Habibie Nashih Alhaq, S.Hum.', 'subject' => 'Tata Usaha'],
            ['id' => '40000000-0000-4400-8400-000000000034', 'name' => 'Ahmad Yafie Muharram, S.I.Kom', 'subject' => 'Operator'],
            ['id' => '40000000-0000-4400-8400-000000000035', 'name' => 'Ee Saepudin', 'subject' => 'Pegawai Umum'],
        ];

        foreach ($staff as $i => $t) {
            $slug = strtolower(preg_replace('/[^a-z0-9\s-]/i', '', $t['name']));
            $slug = trim(preg_replace('/\s+/', '-', $slug));
            $slug = preg_replace('/-+/', '-', $slug);
            $this->seedRecord($t['id'], 'teachers', [
                'id' => $t['id'],
                'name' => $t['name'],
                'subject' => $t['subject'],
                'slug' => $slug,
                'photo' => '',
                'bio' => '',
                'education' => '',
                'contact' => '',
                'is_featured' => $i < 4,
                'status' => 'approved',
            ]);
        }
    }
}
