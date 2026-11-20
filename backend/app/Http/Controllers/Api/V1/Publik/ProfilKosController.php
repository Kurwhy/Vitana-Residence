<?php

namespace App\Http\Controllers\Api\V1\Publik;

use App\Http\Controllers\Controller;
use App\Models\ProfilKos;

class ProfilKosController extends Controller
{
    public function show()
    {
        $profil = ProfilKos::first();

        if (! $profil) {
            return response()->json(['message' => 'Profil kos belum tersedia.'], 404);
        }

        return response()->json(['data' => $profil]);
    }
}
