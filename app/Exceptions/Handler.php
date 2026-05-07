<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        // Handle validation exceptions for API requests
        $this->renderable(function (ValidationException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Data tidak valid',
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        // Handle all exceptions for API requests - return JSON
        $this->renderable(function (Throwable $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                $status = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
                
                // Don't expose internal error details in production
                $isProduction = app()->environment('production');
                
                return response()->json([
                    'message' => $isProduction ? $this->getPublicMessage($status) : $e->getMessage(),
                    'error' => $isProduction ? null : class_basename($e),
                ], $status);
            }
        });
    }

    /**
     * Get user-friendly error message for production
     */
    private function getPublicMessage(int $status): string
    {
        return match ($status) {
            400 => 'Permintaan tidak valid',
            401 => 'Silakan login terlebih dahulu',
            403 => 'Anda tidak memiliki akses',
            404 => 'Data tidak ditemukan',
            422 => 'Data tidak valid',
            429 => 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
            500 => 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
            502, 503 => 'Server sedang dalam pemeliharaan. Silakan coba lagi nanti.',
            default => 'Terjadi kesalahan tidak diketahui',
        };
    }
}
