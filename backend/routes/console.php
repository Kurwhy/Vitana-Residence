<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use Illuminate\Support\Facades\Schedule;

Schedule::command('billing:generate')->dailyAt('00:30')->timezone('Asia/Jakarta');
Schedule::command('billing:remind')->dailyAt('08:00')->timezone('Asia/Jakarta');
