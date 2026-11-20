<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tagihan extends Model
{
    protected $table = 'tagihan';

    protected $fillable = [
        'kode_tagihan',
        'penghuni_id',
        'kamar_id',
        'periode_bulan',
        'nominal',
        'tanggal_jatuh_tempo',
        'status',
        'midtrans_order_id',
        'midtrans_snap_token',
        'metode_pembayaran',
        'dibayar_pada',
    ];

    protected function casts(): array
    {
        return [
            'nominal' => 'decimal:2',
            'tanggal_jatuh_tempo' => 'date',
            'dibayar_pada' => 'datetime',
        ];
    }

    public function penghuni()
    {
        return $this->belongsTo(Penghuni::class);
    }

    public function kamar()
    {
        return $this->belongsTo(Kamar::class);
    }

    public function logNotifikasi()
    {
        return $this->hasMany(LogNotifikasi::class);
    }
}
