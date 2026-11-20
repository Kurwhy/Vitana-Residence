<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('log_notifikasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tagihan_id')->nullable()->constrained('tagihan')->nullOnDelete();
            $table->string('tujuan', 150);
            $table->enum('kanal', ['whatsapp', 'email']);
            $table->string('jenis_pesan', 50);
            $table->text('isi_ringkas');
            $table->enum('status', ['terkirim', 'gagal']);
            $table->text('respons_api')->nullable();
            $table->timestamps();
            $table->index(['tagihan_id', 'kanal', 'jenis_pesan'], 'idx_log_tagihan_jenis');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_notifikasi');
    }
};
