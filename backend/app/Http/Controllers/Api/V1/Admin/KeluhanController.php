<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateKeluhanRequest;
use App\Models\Keluhan;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class KeluhanController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');

        $keluhan = Keluhan::with(['penghuni.user', 'kamar'])
            ->when(
                $status && $status !== 'semua',
                fn ($query) => $query->where('status', $status)
            )
            ->latest()
            ->paginate(15);

        return response()->json($keluhan);
    }

    public function show(Keluhan $keluhan)
    {
        $keluhan->load(['penghuni.user', 'kamar']);

        return response()->json(['data' => $keluhan]);
    }

    public function update(
        UpdateKeluhanRequest $request,
        Keluhan $keluhan,
        NotificationService $notifications
    ) {
        $previousStatus = $keluhan->status;
        $status = $request->validated('status');
        $tanggapan = $request->validated('tanggapan_admin');

        $keluhan->update([
            'status' => $status,
            'tanggapan_admin' => $tanggapan,
            'diselesaikan_pada' => $status === 'selesai'
                ? ($keluhan->diselesaikan_pada ?? now())
                : null,
        ]);

        $keluhan->load(['penghuni.user', 'kamar']);

        if ($status === 'selesai' && $previousStatus !== 'selesai') {
            try {
                $user = $keluhan->penghuni->user;
                $message = "Halo {$user->nama}, keluhan Anda di Vitana Residence sudah selesai ditangani.\n\n"
                    ."Kode keluhan: {$keluhan->kode_keluhan}\n"
                    ."Kamar: {$keluhan->kamar->nomor_kamar}\n"
                    ."Judul: {$keluhan->judul}\n\n"
                    ."Tanggapan Admin: {$keluhan->tanggapan_admin}\n\n"
                    .'Terima kasih sudah melaporkan kendala ini.';

                $notifications->sendBoth(
                    $user->no_whatsapp,
                    $user->email,
                    'keluhan_selesai',
                    $message
                );
            } catch (\Throwable $exception) {
                report($exception);
            }
        }

        return response()->json([
            'message' => $status === 'selesai'
                ? 'Keluhan ditandai selesai. Ringkasan tanggapan dikirim ke WhatsApp dan email penyewa.'
                : 'Keluhan berhasil diperbarui.',
            'data' => $keluhan->fresh()->load(['penghuni.user', 'kamar']),
        ]);
    }
}
