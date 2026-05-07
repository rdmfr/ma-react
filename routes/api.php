<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\BootstrapController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\PublicFormController;
use App\Http\Controllers\Api\PublicDownloadController;
use App\Http\Controllers\Api\RecordController;
use App\Http\Controllers\Api\DeploymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()->toIso8601String()]);
});

// Public endpoints - rate limited
Route::middleware('throttle:30,1')->group(function () {
    Route::get('/public/bootstrap', [BootstrapController::class, 'public']);
    Route::post('/public/contact', [PublicFormController::class, 'contact']);
    Route::post('/public/ppdb', [PublicFormController::class, 'ppdb']);
    Route::post('/public/modules/{record}/download', [PublicDownloadController::class, 'module']);
    Route::post('/public/student-works/{record}/download', [PublicDownloadController::class, 'studentWork']);
});

// Auth endpoints - rate limiting for login
Route::middleware('throttle:login')->post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [ProfileController::class, 'avatar']);

    Route::get('/dashboard/bootstrap', [BootstrapController::class, 'dashboard']);
    Route::get('/records', [RecordController::class, 'index']);
    Route::post('/records', [RecordController::class, 'store']);
    Route::get('/records/{record}', [RecordController::class, 'show']);
    Route::put('/records/{record}', [RecordController::class, 'update']);
    Route::post('/records/{record}', [RecordController::class, 'update']);
    Route::delete('/records/{record}', [RecordController::class, 'destroy']);

    Route::middleware('role:admin')->group(function () {
        Route::post('/admin/records/bulk-update', [RecordController::class, 'bulkUpdate']);
        Route::get('/admin/users', [AdminUserController::class, 'index']);
        Route::post('/admin/users', [AdminUserController::class, 'store']);
        Route::put('/admin/users/{user}', [AdminUserController::class, 'update']);
        Route::delete('/admin/users/{user}', [AdminUserController::class, 'destroy']);
    });
});

Route::get('/status', [StatusCheckController::class, 'index']);
Route::post('/status', [StatusCheckController::class, 'store']);

// Admin deployment endpoints (only accessible by admin users with token)
Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('role:admin')->group(function () {
        Route::post('/admin/deploy', [DeploymentController::class, 'migrate'])->name('deploy.migrate');
    });
});

// Health check endpoint - public, no auth required
Route::get('/admin/health', [DeploymentController::class, 'health']);
