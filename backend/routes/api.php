<?php

use App\Http\Controllers\Api\V1\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\KamarController as AdminKamarController;
use App\Http\Controllers\Api\V1\Admin\KeluhanController as AdminKeluhanController;
use App\Http\Controllers\Api\V1\Admin\PengajuanController as AdminPengajuanController;
use App\Http\Controllers\Api\V1\Admin\PenghuniController as AdminPenghuniController;
use App\Http\Controllers\Api\V1\Admin\ProfilKosController as AdminProfilKosController;
use App\Http\Controllers\Api\V1\Admin\TagihanController as AdminTagihanController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\Penyewa\DashboardController as PenyewaDashboardController;
use App\Http\Controllers\Api\V1\Penyewa\KeluhanController as PenyewaKeluhanController;
use App\Http\Controllers\Api\V1\Penyewa\ProfilController as PenyewaProfilController;
use App\Http\Controllers\Api\V1\Penyewa\TagihanController as PenyewaTagihanController;
use App\Http\Controllers\Api\V1\Publik\KamarController as PublikKamarController;
use App\Http\Controllers\Api\V1\Publik\PengajuanController as PublikPengajuanController;
use App\Http\Controllers\Api\V1\Publik\ProfilKosController as PublikProfilKosController;
use App\Http\Controllers\Api\V1\Webhook\MidtransController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('publik')->group(function () {
        Route::get('/profil-kos', [PublikProfilKosController::class, 'show']);
        Route::get('/kamar', [PublikKamarController::class, 'index']);
        Route::get('/kamar/{kamar}', [PublikKamarController::class, 'show']);
        Route::post('/pengajuan', [PublikPengajuanController::class, 'store']);
        Route::post('/cek-pengajuan', [PublikPengajuanController::class, 'check']);
    });

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/webhooks/midtrans', MidtransController::class);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profil/password', [AuthController::class, 'changePassword']);

        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('/dashboard', AdminDashboardController::class);

            Route::get('/profil-kos', [AdminProfilKosController::class, 'show']);
            Route::put('/profil-kos', [AdminProfilKosController::class, 'update']);

            Route::get('/kamar', [AdminKamarController::class, 'index']);
            Route::post('/kamar', [AdminKamarController::class, 'store']);
            Route::get('/kamar/{kamar}', [AdminKamarController::class, 'show']);
            Route::match(['post', 'put'], '/kamar/{kamar}', [AdminKamarController::class, 'update']);
            Route::delete('/kamar/{kamar}', [AdminKamarController::class, 'destroy']);

            Route::get('/pengajuan', [AdminPengajuanController::class, 'index']);
            Route::get('/pengajuan/{pengajuan}', [AdminPengajuanController::class, 'show']);
            Route::get('/pengajuan/{pengajuan}/identitas', [AdminPengajuanController::class, 'identitas']);
            Route::post('/pengajuan/{pengajuan}/setujui', [AdminPengajuanController::class, 'setujui']);
            Route::post('/pengajuan/{pengajuan}/tolak', [AdminPengajuanController::class, 'tolak']);

            Route::get('/penghuni', [AdminPenghuniController::class, 'index']);
            Route::post('/penghuni/{penghuni}/checkout', [AdminPenghuniController::class, 'checkout']);

            Route::get('/tagihan', [AdminTagihanController::class, 'index']);
            Route::post('/tagihan/{tagihan}/ingatkan', [AdminTagihanController::class, 'remind']);

            Route::get('/keluhan', [AdminKeluhanController::class, 'index']);
            Route::get('/keluhan/{keluhan}', [AdminKeluhanController::class, 'show']);
            Route::patch('/keluhan/{keluhan}', [AdminKeluhanController::class, 'update']);
        });

        Route::middleware('role:penyewa')->prefix('penyewa')->group(function () {
            Route::get('/dashboard', PenyewaDashboardController::class);
            Route::get('/tagihan', [PenyewaTagihanController::class, 'index']);
            Route::post('/tagihan/{id}/bayar', [PenyewaTagihanController::class, 'bayar']);
            Route::get('/keluhan', [PenyewaKeluhanController::class, 'index']);
            Route::post('/keluhan', [PenyewaKeluhanController::class, 'store']);
            Route::get('/profil', PenyewaProfilController::class);
        });
    });
});
