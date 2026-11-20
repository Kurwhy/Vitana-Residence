<?php

namespace App\Http\Controllers\Api\V1\Penyewa;

use App\Http\Controllers\Controller;
use App\Models\Penghuni;
use Carbon\Carbon;
use Illuminate\Http\Request;

abstract class PenyewaController extends Controller
{
    protected function currentPenghuni(Request $request): Penghuni
    {
        $penghuni = $request->user()
            ->penghuni()
            ->with(['user', 'kamar'])
            ->where('status', 'aktif')
            ->first();

        if (! $penghuni) {
            abort(404, 'Data penghuni aktif tidak ditemukan.');
        }

        return $penghuni;
    }

    protected function nextDueDate(int $cycle): string
    {
        $day = min(max($cycle, 1), 28);
        $today = now()->startOfDay();
        $candidate = Carbon::create($today->year, $today->month, $day)->startOfDay();

        if ($candidate->lessThan($today)) {
            $candidate->addMonthNoOverflow();
        }

        return $candidate->toDateString();
    }
}
