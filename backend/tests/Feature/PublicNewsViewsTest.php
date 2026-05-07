<?php

namespace Tests\Feature;

use App\Models\Record;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicNewsViewsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_increments_views_on_news_detail(): void
    {
        $r = Record::query()->create([
            'type' => 'news',
            'data' => [
                'slug' => 'uji-berita',
                'title' => 'Uji Berita',
                'category' => 'Akademik',
                'author' => 'Admin',
                'date' => now()->toDateString(),
                'views' => 0,
                'status' => 'approved',
            ],
        ]);

        $this->get('/berita/uji-berita')->assertOk();

        $r->refresh();
        $this->assertSame(1, (int) ($r->data['views'] ?? 0));
    }
}

