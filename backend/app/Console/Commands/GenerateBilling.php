<?php

namespace App\Console\Commands;

use App\Models\Penghuni;
use App\Models\Tagihan;
use App\Services\BillingService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class GenerateBilling extends Command
{
    protected $signature = 'billing:generate';

    protected $description = 'Terbitkan tagihan bulan berikutnya pada H-7 dan tandai tagihan terlambat';

    public function handle(BillingService $billing): int
    {
        $today = Carbon::today();
        $generated = 0;

        $tenants = Penghuni::with(['kamar'])
            ->where('status', 'aktif')
            ->get();

        foreach ($tenants as $penghuni) {
            $cycle = min(max($penghuni->tanggal_siklus_bulanan, 1), 28);
            $candidate = Carbon::create($today->year, $today->month, $cycle)->startOfDay();

            if ($candidate->lessThan($today)) {
                $candidate->addMonthNoOverflow();
            }

            if (! $today->equalTo($candidate->copy()->subDays(7))) {
                continue;
            }

            $periode = $candidate->format('Y-m');
            $alreadyExists = Tagihan::where('penghuni_id', $penghuni->id)
                ->where('periode_bulan', $periode)
                ->exists();

            if ($alreadyExists) {
                continue;
            }

            DB::transaction(function () use ($penghuni, $candidate, $periode, $billing) {
                $billing->createPeriodicBill($penghuni, $penghuni->kamar, $periode, $candidate);
            });

            $generated++;
        }

        $overdue = Tagihan::whereIn('status', ['belum_bayar', 'menunggu_pembayaran'])
            ->whereDate('tanggal_jatuh_tempo', '<', $today->toDateString())
            ->update(['status' => 'terlambat']);

        $this->info("Tagihan baru diterbitkan: {$generated}. Tagihan ditandai terlambat: {$overdue}.");

        return self::SUCCESS;
    }
}
