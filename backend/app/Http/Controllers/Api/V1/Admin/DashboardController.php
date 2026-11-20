<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kamar;
use App\Models\Keluhan;
use App\Models\PengajuanSewa;
use App\Models\Tagihan;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $periode = now()->format('Y-m');

        $kamar = Kamar::query()->get(['id', 'nomor_kamar', 'status']);

        $tagihanPerhatian = Tagihan::with(['penghuni.user', 'kamar'])
            ->where('status', '!=', 'lunas')
            ->orderBy('tanggal_jatuh_tempo')
            ->limit(5)
            ->get();

        $keluhanAktif = Keluhan::with(['penghuni.user', 'kamar'])
            ->whereIn('status', ['menunggu', 'diproses'])
            ->latest()
            ->limit(5)
            ->get();

        $lunasBulanIni = Tagihan::where('status', 'lunas')
            ->where('periode_bulan', $periode);

        return response()->json([
            'data' => [
                'periode_berjalan' => $periode,
                'kamar' => [
                    'total' => $kamar->count(),
                    'tersedia' => $kamar->where('status', 'tersedia')->count(),
                    'terisi' => $kamar->where('status', 'terisi')->count(),
                    'perawatan' => $kamar->where('status', 'perawatan')->count(),
                ],
                'pengajuan_menunggu' => PengajuanSewa::where('status', 'menunggu_verifikasi')->count(),
                'pendapatan_lunas_bulan_ini' => (float) (clone $lunasBulanIni)->sum('nominal'),
                'jumlah_tagihan_lunas_bulan_ini' => (clone $lunasBulanIni)->count(),
                'tagihan_perhatian' => $tagihanPerhatian,
                'keluhan_aktif' => $keluhanAktif,
                'kamar_tersedia' => $kamar->where('status', 'tersedia')->values(),
                'kamar_perawatan' => $kamar->where('status', 'perawatan')->values(),
            ],
        ]);
    }
}
