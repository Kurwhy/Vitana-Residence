<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfilKosRequest;
use App\Models\ProfilKos;

class ProfilKosController extends Controller
{
    public function show()
    {
        $profil = ProfilKos::firstOrFail();

        return response()->json(['data' => $profil]);
    }

    public function update(ProfilKosRequest $request)
    {
        $profil = ProfilKos::firstOrFail();
        $profil->update($request->validated());

        return response()->json([
            'message' => 'Profil kos berhasil diperbarui.',
            'data' => $profil->fresh(),
        ]);
    }
}
