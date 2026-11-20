<?php

namespace App\Http\Controllers\Api\V1\Webhook;

use App\Http\Controllers\Controller;
use App\Models\Tagihan;
use App\Services\MidtransService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MidtransController extends Controller
{
    public function __invoke(
        Request $request,
        MidtransService $midtrans,
        NotificationService $notifications
    ) {
        $payload = $request->all();

        if (! $midtrans->verifySignature($payload)) {
            return response()->json(['message' => 'Signature tidak valid.'], 403);
        }

        $paidNow = false;
        $tagihan = null;
        $notFound = false;

        DB::transaction(function () use ($payload, &$paidNow, &$tagihan, &$notFound) {
            $tagihan = Tagihan::with(['penghuni.user', 'kamar'])
                ->where('midtrans_order_id', $payload['order_id'])
                ->lockForUpdate()
                ->first();

            if (! $tagihan) {
                $notFound = true;

                return;
            }

            $transactionStatus = $payload['transaction_status'] ?? null;
            $fraudStatus = $payload['fraud_status'] ?? null;
            $isPaid = $transactionStatus === 'settlement'
                || ($transactionStatus === 'capture' && $fraudStatus === 'accept');

            if ($isPaid && $tagihan->status !== 'lunas') {
                $tagihan->update([
                    'status' => 'lunas',
                    'metode_pembayaran' => $payload['payment_type'] ?? null,
                    'dibayar_pada' => now(),
                ]);
                $paidNow = true;
            }
        });

        if ($notFound) {
            return response()->json(['message' => 'Tagihan tidak ditemukan.'], 404);
        }

        if ($paidNow && $tagihan) {
            try {
                $user = $tagihan->penghuni->user;
                $message = "Halo {$user->nama}, pembayaran tagihan sewa Anda di Vitana Residence sudah kami terima.\n\n"
                    ."Kode tagihan: {$tagihan->kode_tagihan}\n"
                    ."Kamar: {$tagihan->kamar->nomor_kamar}\n"
                    ."Periode: {$tagihan->periode_bulan}\n"
                    .'Nominal: Rp '.number_format((float) $tagihan->nominal, 0, ',', '.')."\n"
                    ."Metode: {$tagihan->metode_pembayaran}\n"
                    ."Dibayar pada: {$tagihan->dibayar_pada->format('d-m-Y H:i')} WIB\n\n"
                    .'Status tagihan: lunas. Terima kasih.';

                $notifications->sendBoth(
                    $user->no_whatsapp,
                    $user->email,
                    'pembayaran_lunas',
                    $message,
                    $tagihan
                );
            } catch (\Throwable $exception) {
                report($exception);
            }
        }

        return response()->json(['message' => 'OK']);
    }
}
