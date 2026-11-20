<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengajuan_sewa', function (Blueprint $table) {
            $table->id();
            $table->string('kode_pengajuan', 25)->unique();
            $table->foreignId('kamar_id')->constrained('kamar');
            $table->string('nama_lengkap', 100);
            $table->string('email', 150);
            $table->string('no_whatsapp', 20);
            $table->enum('status_penghuni', ['mahasiswi', 'karyawati']);
            $table->string('nama_instansi', 120);
            $table->string('nama_kontak_darurat', 100);
            $table->string('no_kontak_darurat', 20);
            $table->date('tanggal_mulai_masuk');
            $table->string('foto_identitas');
            $table->text('catatan_penyewa')->nullable();
            $table->enum('status', ['menunggu_verifikasi', 'disetujui', 'ditolak'])->default('menunggu_verifikasi');
            $table->text('catatan_admin')->nullable();
            $table->foreignId('diverifikasi_oleh')->nullable()->constrained('users');
            $table->dateTime('diverifikasi_pada')->nullable();
            $table->timestamps();
            $table->index('status', 'idx_pengajuan_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuan_sewa');
    }
};
