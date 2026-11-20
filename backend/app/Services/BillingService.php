<?php

namespace App\Services;

use App\Models\Kamar;
use App\Models\Penghuni;
use App\Models\Tagihan;
use App\Support\KodeGenerator;
use Carbon\Carbon;

class BillingService
{
    public function createFirstBill(Penghuni $penghuni, Kamar $kamar): Tagihan
    {
        $periode = $penghuni->tanggal_masuk->format('Y-m');
        $approvalDue = now()->addDays(2)->startOfDay();
        $moveIn = $penghuni->tanggal_masuk->copy()->startOfDay();
        $due = $approvalDue->lessThan($moveIn) ? $approvalDue : $moveIn;

        return $this->createBill($penghuni, $kamar, $periode, $due);
    }

    public function createPeriodicBill(Penghuni $penghuni, Kamar $kamar, string $periode, Carbon $due): Tagihan
    {
        return $this->createBill($penghuni, $kamar, $periode, $due);
    }

    private function createBill(Penghuni $penghuni, Kamar $kamar, string $periode, Carbon $due): Tagihan
    {
        $existing = Tagihan::where('penghuni_id', $penghuni->id)
            ->where('periode_bulan', $periode)
            ->first();

        if ($existing) {
            return $existing;
        }

        return Tagihan::create([
            'kode_tagihan' => KodeGenerator::monthly('INV', 'tagihan', 'kode_tagihan', $periode),
            'penghuni_id' => $penghuni->id,
            'kamar_id' => $kamar->id,
            'periode_bulan' => $periode,
            'nominal' => $kamar->harga_bulanan,
            'tanggal_jatuh_tempo' => $due->toDateString(),
            'status' => 'belum_bayar',
        ]);
    }
}
