<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ProfilKos extends Model
{
    protected $table = 'profil_kos';

    protected $fillable = [
        'nama_kos',
        'tagline',
        'deskripsi',
        'alamat',
        'link_maps',
        'no_whatsapp_admin',
        'email_admin',
        'fasilitas_umum',
        'tata_tertib',
        'foto_utama',
    ];

    protected $appends = ['foto_utama_url'];

    protected function casts(): array
    {
        return [
            'fasilitas_umum' => 'array',
            'tata_tertib' => 'array',
        ];
    }

    public function getFotoUtamaUrlAttribute(): ?string
    {
        return $this->foto_utama ? Storage::disk('public')->url($this->foto_utama) : null;
    }
}
