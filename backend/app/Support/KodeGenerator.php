<?php

namespace App\Support;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class KodeGenerator
{
    public static function daily(string $prefix, string $table, string $column, ?Carbon $date = null): string
    {
        $date = $date ?? now();
        $base = $prefix.'-'.$date->format('Ymd').'-';

        return self::next($table, $column, $base);
    }

    public static function monthly(string $prefix, string $table, string $column, string $periode): string
    {
        $base = $prefix.'-'.str_replace('-', '', $periode).'-';

        return self::next($table, $column, $base);
    }

    private static function next(string $table, string $column, string $base): string
    {
        $last = DB::table($table)
            ->where($column, 'like', $base.'%')
            ->orderByDesc($column)
            ->lockForUpdate()
            ->value($column);

        $number = $last ? ((int) substr($last, -4)) + 1 : 1;

        return $base.str_pad((string) $number, 4, '0', STR_PAD_LEFT);
    }
}
