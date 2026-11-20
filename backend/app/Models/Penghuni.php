<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penghuni extends Model
{
    protected $table = 'penghuni';

    protected $fillable = [
        'user_id',
        'kamar_id',
        'pengajuan_id',
        'status_penghuni',
        'nama_instansi',
        'nama_kontak_darurat',
        'no_kontak_darurat',
        'foto_identitas',
        'tanggal_masuk',
        'tanggal_keluar',
        'tanggal_siklus_bulanan',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_masuk' => 'date',
            'tanggal_keluar' => 'date',
            'tanggal_siklus_bulanan' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kamar()
    {
        return $this->belongsTo(Kamar::class);
    }

    public function pengajuan()
    {
        return $this->belongsTo(PengajuanSewa::class);
    }

    public function tagihan()
    {
        return $this->hasMany(Tagihan::class);
    }

    public function keluhan()
    {
        return $this->hasMany(Keluhan::class);
    }
}
