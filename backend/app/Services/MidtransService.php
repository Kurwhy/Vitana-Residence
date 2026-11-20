<?php

namespace App\Services;

use App\Models\Tagihan;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class MidtransService
{
    public function createSnapTransaction(Tagihan $tagihan, string $orderId): array
    {
        $grossAmount = number_format((float) $tagihan->nominal, 2, '.', '');
        $serverKey = (string) config('services.midtrans.server_key');

        if (
            config('services.midtrans.mock') ||
            blank($serverKey) ||
            str_contains($serverKey, 'xxxx')
        ) {
            return [
                'order_id' => $orderId,
                'snap_token' => 'MOCK-SNAP-'.$orderId,
                'mock' => true,
                'mock_notification' => [
                    'order_id' => $orderId,
                    'status_code' => '200',
                    'gross_amount' => $grossAmount,
                    'signature_key' => $this->signature($orderId, '200', $grossAmount),
                    'transaction_status' => 'settlement',
                    'fraud_status' => 'accept',
                    'payment_type' => 'qris',
                ],
            ];
        }

        $tagihan->loadMissing(['penghuni.user', 'kamar']);
        $baseUrl = config('services.midtrans.is_production')
            ? 'https://app.midtrans.com'
            : 'https://app.sandbox.midtrans.com';

        $response = Http::withBasicAuth($serverKey, '')
            ->acceptJson()
            ->timeout(20)
            ->post($baseUrl.'/snap/v1/transactions', [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => (int) $tagihan->nominal,
                ],
                'item_details' => [[
                    'id' => (string) $tagihan->kode_tagihan,
                    'price' => (int) $tagihan->nominal,
                    'quantity' => 1,
                    'name' => 'Sewa Kamar '.$tagihan->kamar->nomor_kamar.' '.$tagihan->periode_bulan,
                ]],
                'customer_details' => [
                    'first_name' => $tagihan->penghuni->user->nama,
                    'email' => $tagihan->penghuni->user->email,
                    'phone' => $tagihan->penghuni->user->no_whatsapp,
                ],
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Midtrans menolak permintaan pembayaran: '.$response->body());
        }

        return [
            'order_id' => $orderId,
            'snap_token' => $response->json('token'),
            'mock' => false,
        ];
    }

    public function signature(string $orderId, string $statusCode, string $grossAmount): string
    {
        return hash(
            'sha512',
            $orderId.$statusCode.$grossAmount.(string) config('services.midtrans.server_key')
        );
    }

    public function verifySignature(array $payload): bool
    {
        if (! isset(
            $payload['order_id'],
            $payload['status_code'],
            $payload['gross_amount'],
            $payload['signature_key']
        )) {
            return false;
        }

        $expected = $this->signature(
            (string) $payload['order_id'],
            (string) $payload['status_code'],
            (string) $payload['gross_amount']
        );

        return hash_equals($expected, (string) $payload['signature_key']);
    }
}
