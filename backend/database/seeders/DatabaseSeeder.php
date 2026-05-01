<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
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
