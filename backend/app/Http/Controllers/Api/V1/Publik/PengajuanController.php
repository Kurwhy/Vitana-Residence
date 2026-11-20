<?php

namespace App\Http\Controllers\Api\V1\Publik;

use App\Http\Controllers\Controller;
use App\Http\Requests\CekPengajuanRequest;
use App\Http\Requests\StorePengajuanRequest;
use App\Models\Kamar;
use App\Models\PengajuanSewa;
use App\Models\ProfilKos;
use App\Models\User;
use App\Services\NotificationService;
use App\Support\KodeGenerator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PengajuanController extends Controller
{
    public function store(StorePengajuanRequest $request, NotificationService $notifications)
    {
        $data = $request->validated();

        $activeEmail = User::where('email', $data['email'])
            ->where('is_active', true)
            ->exists();

        if ($activeEmail) {
            throw ValidationException::withMessages([
                'email' => 'Email ini sudah digunakan oleh akun aktif. Gunakan email lain.',
            ]);
        }

        $pengajuan = DB::transaction(function () use ($request, $data) {
            $kamar = Kamar::lockForUpdate()->findOrFail($data['kamar_id']);

            if ($kamar->status !== 'tersedia') {
                throw ValidationException::withMessages([
                    'kamar_id' => 'Kamar ini sudah tidak tersedia untuk pengajuan baru.',
                ]);
            }

            $foto = $request->file('foto_identitas')->store('ktp', 'local');

            return PengajuanSewa::create([
                'kode_pengajuan' => KodeGenerator::daily('BKG', 'pengajuan_sewa', 'kode_pengajuan'),
                'kamar_id' => $kamar->id,
                'nama_lengkap' => $data['nama_lengkap'],
                'email' => $data['email'],
                'no_whatsapp' => $data['no_whatsapp'],
                'status_penghuni' => $data['status_penghuni'],
                'nama_instansi' => $data['nama_instansi'],
                'nama_kontak_darurat' => $data['nama_kontak_darurat'],
                'no_kontak_darurat' => $data['no_kontak_darurat'],
                'tanggal_mulai_masuk' => $data['tanggal_mulai_masuk'],
                'foto_identitas' => $foto,
                'catatan_penyewa' => $data['catatan_penyewa'] ?? null,
                'status' => 'menunggu_verifikasi',
            ]);
        });

        $pengajuan->load('kamar');
        $profil = ProfilKos::first();

        try {
            $message = "Halo {$pengajuan->nama_lengkap}, pengajuan sewa Anda di Vitana Residence sudah kami terima.\n\n"
                ."Kode pengajuan: {$pengajuan->kode_pengajuan}\n"
                ."Kamar: {$pengajuan->kamar->nomor_kamar} ({$pengajuan->kamar->nama_tipe})\n"
                ."Tanggal mulai masuk: {$pengajuan->tanggal_mulai_masuk->format('d-m-Y')}\n\n"
                ."Status saat ini menunggu verifikasi Admin. Cek status melalui halaman Cek Pengajuan.";

            $notifications->sendBoth(
                $pengajuan->no_whatsapp,
                $pengajuan->email,
                'pengajuan_diterima',
                $message
            );

            if ($profil) {
                $adminMessage = "Pengajuan sewa baru masuk di Vitana Residence.\n\n"
                    ."Kode: {$pengajuan->kode_pengajuan}\n"
                    ."Nama: {$pengajuan->nama_lengkap}\n"
                    ."Kamar: {$pengajuan->kamar->nomor_kamar}\n"
                    ."WhatsApp: {$pengajuan->no_whatsapp}\n\n"
                    .'Buka panel Admin untuk melakukan verifikasi.';

                $notifications->sendBoth(
                    $profil->no_whatsapp_admin,
                    $profil->email_admin,
                    'pengajuan_diterima',
                    $adminMessage
                );
            }
        } catch (\Throwable $exception) {
            report($exception);
        }

        return response()->json([
            'message' => 'Pengajuan berhasil dikirim.',
            'data' => $pengajuan,
        ], 201);
    }

    public function check(CekPengajuanRequest $request)
    {
        $data = $request->validated();

        $pengajuan = PengajuanSewa::with('kamar')
            ->where('kode_pengajuan', strtoupper($data['kode_pengajuan']))
            ->where('no_whatsapp', $data['no_whatsapp'])
            ->first();

        if (! $pengajuan) {
            return response()->json([
                'message' => 'Kombinasi kode pengajuan dan nomor WhatsApp tidak ditemukan.',
            ], 404);
        }

        return response()->json(['data' => $pengajuan]);
    }
}
