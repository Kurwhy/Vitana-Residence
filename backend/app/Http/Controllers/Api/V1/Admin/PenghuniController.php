<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Penghuni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PenghuniController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'aktif');
        if (! in_array($status, ['aktif', 'selesai'], true)) {
            $status = 'aktif';
        }

        $penghuni = Penghuni::with(['user', 'kamar'])
            ->where('status', $status)
            ->orderByDesc('tanggal_masuk')
            ->paginate(15);

        return response()->json($penghuni);
    }

    public function checkout(Penghuni $penghuni)
    {
        if ($penghuni->status !== 'aktif') {
            return response()->json(['message' => 'Data penghuni aktif tidak ditemukan.'], 422);
        }

        $tunggakan = $penghuni->tagihan()
            ->where('status', '!=', 'lunas')
            ->orderBy('tanggal_jatuh_tempo')
            ->get();

        if ($tunggakan->isNotEmpty()) {
            return response()->json([
                'message' => 'Penghuni masih memiliki tagihan yang belum lunas. Selesaikan tagihan terlebih dahulu.',
                'tunggakan' => $tunggakan,
            ], 422);
        }

        DB::transaction(function () use ($penghuni) {
            $penghuni->load('user', 'kamar');

            $penghuni->update([
                'status' => 'selesai',
                'tanggal_keluar' => now()->toDateString(),
            ]);

            $penghuni->user->update(['is_active' => false]);
            $penghuni->user->tokens()->delete();
            $penghuni->kamar->update(['status' => 'tersedia']);
        });

        return response()->json([
            'message' => 'Penghuni telah diproses keluar. Kamar kembali tersedia.',
        ]);
    }
}
