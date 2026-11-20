<?php

namespace App\Console\Commands;

use App\Models\LogNotifikasi;
use App\Models\Tagihan;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendBillingReminders extends Command
{
    protected $signature = 'billing:remind';

    protected $description = 'Kirim pengingat tagihan otomatis pada H-3, H-1, dan H+1';

    public function handle(NotificationService $notifications): int
    {
        $today = Carbon::today();
        $sent = 0;

        $bills = Tagihan::with(['penghuni.user', 'kamar'])
            ->whereIn('status', ['belum_bayar', 'menunggu_pembayaran', 'terlambat'])
            ->get();

        foreach ($bills as $tagihan) {
            $due = Carbon::parse($tagihan->tanggal_jatuh_tempo)->startOfDay();
            $difference = (int) $today->diffInDays($due, false);

            $type = match ($difference) {
                3 => 'reminder_h3',
                1 => 'reminder_h1',
                -1 => 'reminder_overdue',
                default => null,
            };

            if (! $type) {
                continue;
            }

            $user = $tagihan->penghuni->user;
            $message = $this->message($tagihan, $type);

            foreach (['whatsapp', 'email'] as $channel) {
                $alreadySent = LogNotifikasi::where('tagihan_id', $tagihan->id)
                    ->where('kanal', $channel)
                    ->where('jenis_pesan', $type)
                    ->whereDate('created_at', $today->toDateString())
                    ->exists();

                if ($alreadySent) {
                    continue;
                }

                $target = $channel === 'whatsapp' ? $user->no_whatsapp : $user->email;
                $notifications->send($channel, $target, $type, $message, $tagihan->id);
                $sent++;
            }
        }

        $this->info("Pengingat tagihan diproses: {$sent}.");

        return self::SUCCESS;
    }

    private function message(Tagihan $tagihan, string $type): string
    {
        $user = $tagihan->penghuni->user;
        $due = $tagihan->tanggal_jatuh_tempo->format('d-m-Y');
        $nominal = 'Rp '.number_format((float) $tagihan->nominal, 0, ',', '.');

        $intro = match ($type) {
            'reminder_h3' => 'Tagihan sewa Anda akan jatuh tempo dalam 3 hari.',
            'reminder_h1' => 'Tagihan sewa Anda akan jatuh tempo besok.',
            default => 'Tagihan sewa Anda sudah melewati jatuh tempo 1 hari.',
        };

        return "Halo {$user->nama}, {$intro}\n\n"
            ."Kode tagihan: {$tagihan->kode_tagihan}\n"
            ."Kamar: {$tagihan->kamar->nomor_kamar}\n"
            ."Periode: {$tagihan->periode_bulan}\n"
            ."Nominal: {$nominal}\n"
            ."Jatuh tempo: {$due}\n\n"
            .'Silakan masuk ke portal penyewa untuk melakukan pembayaran.';
    }
}
