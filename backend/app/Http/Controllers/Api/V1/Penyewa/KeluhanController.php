<?php

namespace App\Http\Controllers\Api\V1\Penyewa;

use App\Http\Requests\StoreKeluhanRequest;
use App\Models\Keluhan;
use App\Support\KodeGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KeluhanController extends PenyewaController
{
    public function index(Request $request)
    {
        $penghuni = $this->currentPenghuni($request);

        $keluhan = $penghuni->keluhan()
            ->with('kamar')
            ->latest()
            ->get();

        return response()->json(['data' => $keluhan]);
    }

    public function store(StoreKeluhanRequest $request)
    {
        $penghuni = $this->currentPenghuni($request);
        $data = $request->validated();

        $foto = $request->hasFile('foto_bukti')
            ? $request->file('foto_bukti')->store('keluhan', 'public')
            : null;

        $keluhan = DB::transaction(function () use ($penghuni, $data, $foto) {
            return Keluhan::create([
                'kode_keluhan' => KodeGenerator::daily('KLP', 'keluhan', 'kode_keluhan'),
                'penghuni_id' => $penghuni->id,
                'kamar_id' => $penghuni->kamar_id,
                'kategori' => $data['kategori'],
                'judul' => $data['judul'],
                'deskripsi' => $data['deskripsi'],
                'foto_bukti' => $foto,
                'status' => 'menunggu',
            ]);
        });

        return response()->json([
            'message' => 'Keluhan berhasil dikirim.',
            'data' => $keluhan->load('kamar'),
        ], 201);
    }
}
