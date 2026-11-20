<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TolakPengajuanRequest;
use App\Models\Kamar;
use App\Models\PengajuanSewa;
use App\Models\Penghuni;
use App\Models\User;
use App\Services\BillingService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PengajuanController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');

        $pengajuan = PengajuanSewa::with('kamar')
            ->when(
                $status && $status !== 'semua',
                fn ($query) => $query->where('status', $status)
            )
            ->latest()
            ->paginate(15);

        return response()->json($pengajuan);
    }

    public function show(PengajuanSewa $pengajuan)
    {
        $pengajuan->load(['kamar', 'verifier']);

        return response()->json(['data' => $pengajuan]);
    }

    public function identitas(PengajuanSewa $pengajuan)
    {
        $path = Storage::disk('local')->path($pengajuan->foto_identitas);

        if (! is_file($path)) {
            return response()->json(['message' => 'File identitas tidak ditemukan.'], 404);
        }

        return response()->file($path, [
            'Content-Type' => mime_content_type($path) ?: 'application/octet-stream',
            'Content-Disposition' => 'inline; filename="'.basename($path).'"',
        ]);
    }

    public function setujui(Request $request, PengajuanSewa $pengajuan, BillingService $billing, NotificationService $notifications)
    {
        $result = DB::transaction(function () use ($pengajuan, $request, $billing) {
            $pengajuan = PengajuanSewa::lockForUpdate()->findOrFail($pengajuan->id);

            if ($pengajuan->status !== 'menunggu_verifikasi') {
                return ['error' => 'Pengajuan ini sudah diverifikasi sebelumnya.'];
            }

            $kamar = Kamar::lockForUpdate()->findOrFail($pengajuan->kamar_id);

            if ($kamar->status !== 'tersedia') {
                return ['error' => 'Kamar sudah tidak tersedia untuk pengajuan ini.'];
            }

            if (User::where('email', $pengajuan->email)->exists()) {
                return ['error' => 'Email pengajuan sudah terdaftar sebagai akun. Periksa data pengajuan.'];
            }

            $password = Str::password(8, true, true, false, false);

            $user = User::create([
                'nama' => $pengajuan->nama_lengkap,
                'email' => $pengajuan->email,
                'no_whatsapp' => $pengajuan->no_whatsapp,
                'password' => $password,
                'role' => 'penyewa',
                'is_active' => true,
            ]);

            $kamar->update(['status' => 'terisi']);

            $penghuni = Penghuni::create([
                'user_id' => $user->id,
                'kamar_id' => $kamar->id,
                'pengajuan_id' => $pengajuan->id,
                'status_penghuni' => $pengajuan->status_penghuni,
                'nama_instansi' => $pengajuan->nama_instansi,
                'nama_kontak_darurat' => $pengajuan->nama_kontak_darurat,
                'no_kontak_darurat' => $pengajuan->no_kontak_darurat,
                'foto_identitas' => $pengajuan->foto_identitas,
                'tanggal_masuk' => $pengajuan->tanggal_mulai_masuk,
                'tanggal_siklus_bulanan' => min((int) $pengajuan->tanggal_mulai_masuk->format('d'), 28),
                'status' => 'aktif',
            ]);

            $tagihan = $billing->createFirstBill($penghuni, $kamar);

            $pengajuan->update([
                'status' => 'disetujui',
                'catatan_admin' => 'Pengajuan disetujui. Kredensial akun dikirim melalui WhatsApp dan email.',
                'diverifikasi_oleh' => $request->user()->id,
                'diverifikasi_pada' => now(),
            ]);

            PengajuanSewa::where('kamar_id', $kamar->id)
                ->where('id', '!=', $pengajuan->id)
                ->where('status', 'menunggu_verifikasi')
                ->update([
                    'status' => 'ditolak',
                    'catatan_admin' => 'Kamar telah terisi oleh penyewa lain yang disetujui lebih dahulu. Silakan memilih kamar lain yang masih tersedia.',
                    'diverifikasi_oleh' => $request->user()->id,
                    'diverifikasi_pada' => now(),
                ]);

            return [
                'pengajuan' => $pengajuan,
                'user' => $user,
                'penghuni' => $penghuni,
                'tagihan' => $tagihan,
                'password' => $password,
            ];
        });

        if (isset($result['error'])) {
            return response()->json(['message' => $result['error']], 422);
        }

        $pengajuan = $result['pengajuan']->fresh()->load('kamar');
        $tagihan = $result['tagihan'];

        try {
            $message = "Halo {$result['user']->nama}, pengajuan sewa Anda di Vitana Residence telah disetujui.\n\n"
                ."Akun penyewa sudah aktif.\n"
                ."Email: {$result['user']->email}\n"
                ."Kata sandi awal: {$result['password']}\n\n"
                ."Kamar: {$pengajuan->kamar->nomor_kamar} ({$pengajuan->kamar->nama_tipe})\n"
                ."Tanggal mulai masuk: {$pengajuan->tanggal_mulai_masuk->format('d-m-Y')}\n\n"
                ."Tagihan pertama: {$tagihan->kode_tagihan}\n"
                ."Nominal: Rp ".number_format((float) $tagihan->nominal, 0, ',', '.')."\n"
                ."Jatuh tempo: {$tagihan->tanggal_jatuh_tempo->format('d-m-Y')}\n\n"
                .'Silakan masuk ke portal penyewa dan segera ubah kata sandi Anda.';

            $notifications->sendBoth(
                $result['user']->no_whatsapp,
                $result['user']->email,
                'tagihan_pertama',
                $message,
                $tagihan,
                'Kredensial akun penyewa dan rincian tagihan pertama telah dikirim.'
            );
        } catch (\Throwable $exception) {
            report($exception);
        }

        return response()->json([
            'message' => 'Pengajuan disetujui. Akun penyewa dibuat dan kredensial dikirim melalui WhatsApp dan email.',
            'data' => $pengajuan,
        ]);
    }

    public function tolak(TolakPengajuanRequest $request, PengajuanSewa $pengajuan, NotificationService $notifications)
    {
        if ($pengajuan->status !== 'menunggu_verifikasi') {
            return response()->json(['message' => 'Pengajuan ini sudah diverifikasi sebelumnya.'], 422);
        }

        $pengajuan->update([
            'status' => 'ditolak',
            'catatan_admin' => $request->validated('catatan_admin'),
            'diverifikasi_oleh' => $request->user()->id,
            'diverifikasi_pada' => now(),
        ]);

        try {
            $message = "Halo {$pengajuan->nama_lengkap}, pengajuan sewa Anda di Vitana Residence belum dapat disetujui.\n\n"
                ."Kode pengajuan: {$pengajuan->kode_pengajuan}\n"
                ."Alasan: {$pengajuan->catatan_admin}\n\n"
                .'Silakan menghubungi Admin jika membutuhkan penjelasan lebih lanjut.';

            $notifications->sendBoth(
                $pengajuan->no_whatsapp,
                $pengajuan->email,
                'pengajuan_ditolak',
                $message
            );
        } catch (\Throwable $exception) {
            report($exception);
        }

        return response()->json([
            'message' => 'Pengajuan ditolak. Alasan penolakan sudah dikirim ke WhatsApp dan email calon penyewa.',
            'data' => $pengajuan->fresh(),
        ]);
    }
}
