<?php

namespace Tests\Feature;

use App\Models\Record;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicGalleryDetailTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_renders_gallery_photos_if_present(): void
    {
        $g = Record::query()->create([
            'type' => 'galleries',
            'data' => [
                'title' => 'Album Uji',
                'category' => 'multimedia',
                'date' => now()->toDateString(),
                'cover' => 'https://example.com/cover.jpg',
                'photos' => [
                    'https://example.com/a.jpg',
                    'https://example.com/b.jpg',
                ],
                'status' => 'approved',
            ],
        ]);

        $res = $this->get('/galeri/' . $g->id);
        $res->assertOk();
        $res->assertSee('https://example.com/a.jpg');
        $res->assertSee('https://example.com/b.jpg');
    }
}

