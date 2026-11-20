<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penghuni', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users');
            $table->foreignId('kamar_id')->constrained('kamar');
            $table->foreignId('pengajuan_id')->nullable()->unique()->constrained('pengajuan_sewa');
            $table->enum('status_penghuni', ['mahasiswi', 'karyawati']);
            $table->string('nama_instansi', 120);
            $table->string('nama_kontak_darurat', 100);
            $table->string('no_kontak_darurat', 20);
            $table->string('foto_identitas');
            $table->date('tanggal_masuk');
            $table->date('tanggal_keluar')->nullable();
            $table->unsignedTinyInteger('tanggal_siklus_bulanan');
            $table->enum('status', ['aktif', 'selesai'])->default('aktif');
            $table->timestamps();
            $table->index('status', 'idx_penghuni_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penghuni');
    }
};
