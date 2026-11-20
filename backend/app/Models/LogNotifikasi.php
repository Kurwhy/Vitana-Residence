<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogNotifikasi extends Model
{
    protected $table = 'log_notifikasi';

    protected $fillable = [
        'tagihan_id',
        'tujuan',
        'kanal',
        'jenis_pesan',
        'isi_ringkas',
        'status',
        'respons_api',
    ];

    public function tagihan()
    {
        return $this->belongsTo(Tagihan::class);
    }
}
