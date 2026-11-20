<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Kamar extends Model
{
    protected $table = 'kamar';

    protected $fillable = [
        'nomor_kamar',
        'nama_tipe',
        'lantai',
        'luas_kamar',
        'harga_bulanan',
        'deskripsi',
        'fasilitas_kamar',
        'foto_utama',
        'galeri_foto',
        'status',
    ];

    protected $appends = ['foto_utama_url', 'galeri_foto_urls'];

    protected function casts(): array
    {
        return [
            'lantai' => 'integer',
            'harga_bulanan' => 'decimal:2',
            'fasilitas_kamar' => 'array',
            'galeri_foto' => 'array',
        ];
    }

    public function penghuni()
    {
        return $this->hasMany(Penghuni::class);
    }

    public function penghuniAktif()
    {
        return $this->hasOne(Penghuni::class)->where('status', 'aktif');
    }

    public function tagihan()
    {
        return $this->hasMany(Tagihan::class);
    }

    public function getFotoUtamaUrlAttribute(): ?string
    {
        return $this->foto_utama ? Storage::disk('public')->url($this->foto_utama) : null;
    }

    public function getGaleriFotoUrlsAttribute(): array
    {
        return collect($this->galeri_foto ?? [])
            ->filter()
            ->map(fn (string $path) => Storage::disk('public')->url($path))
            ->values()
            ->all();
    }
}
