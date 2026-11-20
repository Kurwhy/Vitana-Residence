<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengajuanSewa extends Model
{
    protected $table = 'pengajuan_sewa';

    protected $fillable = [
        'kode_pengajuan',
        'kamar_id',
        'nama_lengkap',
        'email',
        'no_whatsapp',
        'status_penghuni',
        'nama_instansi',
        'nama_kontak_darurat',
        'no_kontak_darurat',
        'tanggal_mulai_masuk',
        'foto_identitas',
        'catatan_penyewa',
        'status',
        'catatan_admin',
        'diverifikasi_oleh',
        'diverifikasi_pada',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_mulai_masuk' => 'date',
            'diverifikasi_pada' => 'datetime',
        ];
    }

    public function kamar()
    {
        return $this->belongsTo(Kamar::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'diverifikasi_oleh');
    }

    public function penghuni()
    {
        return $this->hasOne(Penghuni::class);
    }
}
