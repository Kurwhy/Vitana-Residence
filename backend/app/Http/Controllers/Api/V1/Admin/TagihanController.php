<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tagihan;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class TagihanController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');

        $tagihan = Tagihan::with(['penghuni.user', 'kamar'])
            ->when(
                $status && $status !== 'semua',
                fn ($query) => $query->where('status', $status)
            )
            ->latest()
            ->paginate(15);

        return response()->json($tagihan);
    }

    public function remind(Tagihan $tagihan, NotificationService $notifications)
    {
        if ($tagihan->status === 'lunas') {
            return response()->json(['message' => 'Tagihan sudah lunas. Pengingat tidak diperlukan.'], 422);
        }

        $tagihan->load(['penghuni.user', 'kamar']);
        $user = $tagihan->penghuni->user;

        $message = "Halo {$user->nama}, berikut pengingat tagihan sewa Anda di Vitana Residence.\n\n"
            ."Kode tagihan: {$tagihan->kode_tagihan}\n"
            ."Kamar: {$tagihan->kamar->nomor_kamar}\n"
            ."Periode: {$tagihan->periode_bulan}\n"
            .'Nominal: Rp '.number_format((float) $tagihan->nominal, 0, ',', '.')."\n"
            ."Jatuh tempo: {$tagihan->tanggal_jatuh_tempo->format('d-m-Y')}\n"
            ."Status: {$tagihan->status}\n\n"
            .'Silakan masuk ke portal penyewa untuk melakukan pembayaran.';

        $logs = $notifications->sendBoth(
            $user->no_whatsapp,
            $user->email,
            'reminder_manual',
            $message,
            $tagihan
        );

        return response()->json([
            'message' => 'Pengingat tagihan dikirim melalui WhatsApp dan email.',
            'logs' => $logs,
        ]);
    }
}
