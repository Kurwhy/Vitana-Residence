<?php

namespace App\Http\Controllers\Api\V1\Publik;

use App\Http\Controllers\Controller;
use App\Models\Kamar;
use Illuminate\Http\Request;

class KamarController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->validate([
            'status' => ['nullable', 'in:tersedia,terisi,perawatan'],
        ]);

        $kamar = Kamar::query()
            ->when($request->filled('status'), fn ($query) => $query->where('status', $status['status']))
            ->orderBy('nomor_kamar')
            ->get();

        return response()->json(['data' => $kamar]);
    }

    public function show(Kamar $kamar)
    {
        return response()->json(['data' => $kamar]);
    }
}
