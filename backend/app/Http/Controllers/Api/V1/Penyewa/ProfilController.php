<?php

namespace App\Http\Controllers\Api\V1\Penyewa;

use Illuminate\Http\Request;

class ProfilController extends PenyewaController
{
    public function __invoke(Request $request)
    {
        $penghuni = $this->currentPenghuni($request);

        return response()->json([
            'data' => [
                'user' => $request->user(),
                'penghuni' => $penghuni,
                'kamar' => $penghuni->kamar,
            ],
        ]);
    }
}
