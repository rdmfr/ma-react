<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

/**
 * Deployment Controller for Shared Hosting
 * 
 * Endpoint untuk menjalankan deployment tasks tanpa SSH access
 * Hanya dapat diakses oleh admin dengan token yang benar
 * 
 * Penggunaan:
 * POST /api/admin/deploy?key=DEPLOY_SECRET_KEY
 * Headers: Authorization: Bearer <admin_token>
 */
class DeploymentController
{
    /**
     * Run database migrations
     */
    public function migrate(Request $request)
    {
        // Check deployment secret key (additional security layer)
        $secretKey = env('DEPLOY_SECRET_KEY', null);
        if ($secretKey && $request->query('key') !== $secretKey) {
            Log::warning('Unauthorized deployment attempt', ['ip' => $request->ip()]);
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Verify user is admin
        if (!$request->user() || $request->user()->role !== 'admin') {
            Log::warning('Non-admin deployment attempt', ['user' => $request->user()?->email]);
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            Log::info('Deployment started', ['user' => $request->user()->email]);
            
            $output = [];
            
            // Run migrations
            Artisan::call('migrate', ['--force' => true], $outputBuffer = fopen('php://memory', 'w'));
            $migrationOutput = stream_get_contents($outputBuffer);
            fclose($outputBuffer);
            $output[] = 'Migrations: ' . ($migrationOutput ?: 'No new migrations');

            // Run seeders (idempotent - safe to run multiple times)
            Artisan::call('db:seed', ['--force' => true], $outputBuffer = fopen('php://memory', 'w'));
            $seederOutput = stream_get_contents($outputBuffer);
            fclose($outputBuffer);
            $output[] = 'Seeders: ' . ($seederOutput ?: 'No seeders to run');

            // Create storage symlink if not exists
            if (!file_exists(public_path('storage'))) {
                Artisan::call('storage:link');
                $output[] = 'Storage symlink created';
            } else {
                $output[] = 'Storage symlink already exists';
            }

            // Clear caches
            Artisan::call('cache:clear');
            $output[] = 'Cache cleared';

            Log::info('Deployment completed successfully', ['user' => $request->user()->email, 'outputs' => $output]);

            return response()->json([
                'status' => 'success',
                'message' => 'Deployment completed',
                'log' => $output,
                'timestamp' => now()->toIso8601String(),
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Deployment failed', [
                'user' => $request->user()->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Deployment failed: ' . $e->getMessage(),
                'timestamp' => now()->toIso8601String(),
            ], 500);
        }
    }

    /**
     * Health check endpoint
     */
    public function health()
    {
        return response()->json([
            'status' => 'ok',
            'environment' => app()->environment(),
            'debug' => config('app.debug'),
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
