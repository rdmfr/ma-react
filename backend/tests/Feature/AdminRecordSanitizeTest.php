<?php

namespace Tests\Feature;

use App\Models\Record;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminRecordSanitizeTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_sanitizes_rich_text_on_store(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $payload = [
            'title' => 'Berita Uji',
            'slug' => 'berita-uji',
            'category' => 'Akademik',
            'content' => '<p>Halo</p><script>alert(1)</script>',
            'status' => 'approved',
        ];

        $this->actingAs($admin)
            ->post('/admin/records/news', $payload)
            ->assertRedirect();

        $rec = Record::query()->where('type', 'news')->first();
        $this->assertNotNull($rec);
        $stored = (string) (($rec->data ?? [])['content'] ?? '');
        $this->assertStringContainsString('<p>Halo</p>', $stored);
        $this->assertStringNotContainsString('<script>', strtolower($stored));
    }
}

