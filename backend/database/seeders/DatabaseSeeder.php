<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
    }
}
