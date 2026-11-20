<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Keluhan extends Model
{
    protected $table = 'keluhan';

    protected $fillable = [
        'kode_keluhan',
        'penghuni_id',
        'kamar_id',
        'kategori',
        'judul',
        'deskripsi',
        'foto_bukti',
        'status',
        'tanggapan_admin',
        'diselesaikan_pada',
    ];

    protected $appends = ['foto_bukti_url'];

    protected function casts(): array
    {
        return [
            'diselesaikan_pada' => 'datetime',
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

    public function getFotoBuktiUrlAttribute(): ?string
    {
        return $this->foto_bukti ? Storage::disk('public')->url($this->foto_bukti) : null;
    }
}
