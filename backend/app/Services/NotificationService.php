<?php

namespace App\Services;

use App\Models\LogNotifikasi;
use App\Models\Tagihan;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Throwable;

class NotificationService
{
    public function send(
        string $channel,
        string $target,
        string $type,
        string $message,
        ?int $tagihanId = null,
        ?string $logSummary = null
    ): array {
        $status = 'gagal';
        $response = null;

        try {
            if ($channel === 'whatsapp') {
                $result = $this->sendWhatsApp($target, $message);
            } else {
                $result = $this->sendEmail($target, $type, $message);
            }

            $status = $result['success'] ? 'terkirim' : 'gagal';
            $response = $result['response'];
        } catch (Throwable $exception) {
            $status = 'gagal';
            $response = $exception->getMessage();
        }

        LogNotifikasi::create([
            'tagihan_id' => $tagihanId,
            'tujuan' => $target,
            'kanal' => $channel,
            'jenis_pesan' => $type,
            'isi_ringkas' => $logSummary ?? $message,
            'status' => $status,
            'respons_api' => $response,
        ]);

        return [
            'channel' => $channel,
            'status' => $status,
            'response' => $response,
        ];
    }

    public function sendBoth(
        string $waTarget,
        string $emailTarget,
        string $type,
        string $message,
        ?Tagihan $tagihan = null,
        ?string $logSummary = null
    ): array {
        $results = [];
        $results[] = $this->send('whatsapp', $waTarget, $type, $message, $tagihan?->id, $logSummary);

        try {
            $results[] = $this->send('email', $emailTarget, $type, $message, $tagihan?->id, $logSummary);
        } catch (Throwable $exception) {
            $results[] = [
                'channel' => 'email',
                'status' => 'gagal',
                'response' => $exception->getMessage(),
            ];
        }

        return $results;
    }

    private function sendWhatsApp(string $target, string $message): array
    {
        $token = config('services.fonnte.token');
        $url = config('services.fonnte.url');

        if (config('services.notifications.mock') || blank($token) || str_contains($token, 'your_fonnte')) {
            return [
                'success' => true,
                'response' => 'MOCK_MODE',
            ];
        }

        $response = Http::withHeaders([
            'Authorization' => $token,
        ])->timeout(15)->post($url, [
            'target' => $target,
            'message' => $message,
        ]);

        $payload = $response->json();
        $success = $response->successful() && (($payload['status'] ?? true) !== false);

        return [
            'success' => $success,
            'response' => $response->body(),
        ];
    }

    private function sendEmail(string $target, string $type, string $message): array
    {
        if (config('services.notifications.mock') || blank(config('mail.mailers.smtp.password')) || str_contains((string) config('mail.mailers.smtp.password'), 'xxxx')) {
            return [
                'success' => true,
                'response' => 'MOCK_MODE',
            ];
        }

        Mail::raw($message, function ($mail) use ($target, $type) {
            $mail->to($target)->subject($this->subject($type));
        });

        return [
            'success' => true,
            'response' => 'SMTP accepted',
        ];
    }

    private function subject(string $type): string
    {
        $labels = [
            'pengajuan_diterima' => 'Pengajuan sewa diterima',
            'pengajuan_disetujui' => 'Pengajuan sewa disetujui',
            'pengajuan_ditolak' => 'Pengajuan sewa ditolak',
            'tagihan_pertama' => 'Tagihan pertama',
            'pembayaran_lunas' => 'Pembayaran tagihan lunas',
            'reminder_h3' => 'Pengingat jatuh tempo H-3',
            'reminder_h1' => 'Pengingat jatuh tempo H-1',
            'reminder_overdue' => 'Pengingat tagihan terlambat',
            'reminder_manual' => 'Pengingat tagihan',
            'keluhan_selesai' => 'Keluhan selesai ditangani',
        ];

        return 'Vitana Residence - '.($labels[$type] ?? 'Notifikasi');
    }
}
