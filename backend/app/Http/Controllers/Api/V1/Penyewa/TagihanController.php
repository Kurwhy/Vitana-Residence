<?php

namespace App\Http\Controllers\Api\V1\Penyewa;

use App\Models\Tagihan;
use App\Services\MidtransService;
use Illuminate\Http\Request;

class TagihanController extends PenyewaController
{
    public function index(Request $request)
    {
        $penghuni = $this->currentPenghuni($request);

        $tagihan = $penghuni->tagihan()
            ->with('kamar')
            ->orderByDesc('periode_bulan')
            ->get();

        return response()->json(['data' => $tagihan]);
    }

    public function bayar(Request $request, int $id, MidtransService $midtrans)
    {
        $penghuni = $this->currentPenghuni($request);

        $tagihan = Tagihan::with(['penghuni.user', 'kamar'])
            ->where('penghuni_id', $penghuni->id)
            ->where('id', $id)
            ->first();

        if (! $tagihan) {
            return response()->json(['message' => 'Tagihan tidak ditemukan.'], 404);
        }

        if (! in_array($tagihan->status, ['belum_bayar', 'menunggu_pembayaran', 'terlambat'], true)) {
            return response()->json(['message' => 'Tagihan ini tidak dapat dibayar.'], 422);
        }

        $timestamp = now()->timestamp;
        do {
            $orderId = $tagihan->kode_tagihan.'-'.$timestamp;
            $timestamp++;
        } while (Tagihan::where('midtrans_order_id', $orderId)->exists());

        try {
            $transaction = $midtrans->createSnapTransaction($tagihan, $orderId);
        } catch (\Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Permintaan pembayaran ke Midtrans gagal. Silakan coba lagi.',
            ], 502);
        }

        $tagihan->update([
            'midtrans_order_id' => $transaction['order_id'],
            'midtrans_snap_token' => $transaction['snap_token'],
            'status' => 'menunggu_pembayaran',
        ]);

        return response()->json([
            'message' => 'Token pembayaran berhasil dibuat.',
            'data' => [
                'tagihan' => $tagihan->fresh(),
                'snap_token' => $transaction['snap_token'],
                'order_id' => $transaction['order_id'],
                'mock' => $transaction['mock'],
                'mock_notification' => $transaction['mock_notification'] ?? null,
            ],
        ]);
    }
}
