<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\BootstrapController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\PublicFormController;
use App\Http\Controllers\Api\RecordController;
use App\Http\Controllers\Api\StatusCheckController;

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
    return response()->json(['status' => 'ok']);
});

Route::get('/public/bootstrap', [BootstrapController::class, 'public']);
Route::post('/public/contact', [PublicFormController::class, 'contact']);
Route::post('/public/ppdb', [PublicFormController::class, 'ppdb']);

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::get('/dashboard/bootstrap', [BootstrapController::class, 'dashboard']);
    Route::get('/records', [RecordController::class, 'index']);
    Route::post('/records', [RecordController::class, 'store']);
    Route::get('/records/{record}', [RecordController::class, 'show']);
    Route::put('/records/{record}', [RecordController::class, 'update']);
    Route::delete('/records/{record}', [RecordController::class, 'destroy']);

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/users', [AdminUserController::class, 'index']);
        Route::post('/admin/users', [AdminUserController::class, 'store']);
        Route::put('/admin/users/{user}', [AdminUserController::class, 'update']);
        Route::delete('/admin/users/{user}', [AdminUserController::class, 'destroy']);
    });
});

Route::get('/status', [StatusCheckController::class, 'index']);
Route::post('/status', [StatusCheckController::class, 'store']);
