<?php

namespace App\Providers;

use App\Models\Record;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\View;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $default = [
            'schoolName' => 'MAS YPI Pulosari',
            'schoolShort' => 'MA-Pulosari',
            'schoolTagline' => 'Madrasah Aliyah Berkarakter, Berilmu, Berakhlak',
            'accreditationLabel' => 'B',
            'heroImageUrl' => 'https://images.unsplash.com/photo-1610208322247-18af7775da05?w=900&q=80',
            'heroImageAlt' => 'Kegiatan siswa',
            'profileImageUrl' => '',
            'profileImageAlt' => '',
            'vision' => '',
            'missions' => [],
            'logoUrl' => "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23064e3b'/><stop offset='1' stop-color='%2310b981'/></linearGradient></defs><circle cx='50' cy='50' r='46' fill='url(%23g)'/><path d='M50 20 L72 35 L72 65 L50 80 L28 65 L28 35 Z' fill='none' stroke='white' stroke-width='3'/><text x='50' y='58' text-anchor='middle' font-family='serif' font-weight='bold' font-size='22' fill='white'>MA</text></svg>",
            'address' => 'Jl. Raya Bandung-Tasik Km. 45 Kp. Pulosari, Ds. Cijolang, Kec. Blubur Limbangan, Kab. Garut, Jawa Barat 44186',
            'email' => 'info@mapulosari.sch.id',
            'phone' => '(0284) 3274xxx',
            'instagram' => '@mapulosari',
            'facebook' => 'MA Pulosari Official',
            'youtube' => 'MA Pulosari',
            'mapEmbed' => 'https://www.openstreetmap.org/export/embed.html?bbox=109.3%2C-7.1%2C109.5%2C-7.0&layer=mapnik',
            'accentColor' => '#10b981',
            'darkColor' => '#064e3b',
        ];

        $branding = $default;

        if (!$this->app->runningInConsole()) {
            $branding = Cache::remember('branding.v1', 60, function () use ($default) {
                try {
                    $r = Record::query()
                        ->where('type', 'branding')
                        ->orderByDesc('updated_at')
                        ->first();
                } catch (\Throwable $e) {
                    return $default;
                }

                $data = is_array($r?->data) ? $r->data : [];
                return array_merge($default, $data);
            });
        }

        View::share('branding', $branding);
    }
}
