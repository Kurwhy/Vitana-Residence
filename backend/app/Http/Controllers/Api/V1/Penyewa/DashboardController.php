<?php

namespace App\Http\Controllers\Api\V1\Penyewa;

use Illuminate\Http\Request;

class DashboardController extends PenyewaController
{
    public function __invoke(Request $request)
    {
        $penghuni = $this->currentPenghuni($request);

        $tagihan = $penghuni->tagihan()
            ->orderByDesc('periode_bulan')
            ->get();

        $tagihanAktif = $tagihan
            ->where('status', '!=', 'lunas')
            ->sortBy('tanggal_jatuh_tempo')
            ->first();

        $keluhan = $penghuni->keluhan()
            ->latest()
            ->limit(3)
            ->get();

        return response()->json([
            'data' => [
                'penghuni' => $penghuni,
                'kamar' => $penghuni->kamar,
                'tanggal_masuk' => $penghuni->tanggal_masuk->toDateString(),
                'tanggal_jatuh_tempo_berikutnya' => $this->nextDueDate($penghuni->tanggal_siklus_bulanan),
                'tagihan_aktif' => $tagihanAktif,
                'keluhan_terakhir' => $keluhan,
            ],
        ]);
    }
}
