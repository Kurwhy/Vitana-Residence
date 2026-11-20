<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('keluhan', function (Blueprint $table) {
            $table->id();
            $table->string('kode_keluhan', 25)->unique();
            $table->foreignId('penghuni_id')->constrained('penghuni');
            $table->foreignId('kamar_id')->constrained('kamar');
            $table->enum('kategori', ['listrik_air', 'internet_wifi', 'perabot_kamar', 'kebersihan_keamanan', 'lainnya']);
            $table->string('judul', 150);
            $table->text('deskripsi');
            $table->string('foto_bukti')->nullable();
            $table->enum('status', ['menunggu', 'diproses', 'selesai'])->default('menunggu');
            $table->text('tanggapan_admin')->nullable();
            $table->dateTime('diselesaikan_pada')->nullable();
            $table->timestamps();
            $table->index('status', 'idx_keluhan_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('keluhan');
    }
};
