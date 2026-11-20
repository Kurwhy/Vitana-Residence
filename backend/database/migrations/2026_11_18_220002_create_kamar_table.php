<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kamar', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_kamar', 20)->unique();
            $table->string('nama_tipe', 100);
            $table->unsignedTinyInteger('lantai')->default(1);
            $table->string('luas_kamar', 30);
            $table->decimal('harga_bulanan', 12, 2);
            $table->text('deskripsi')->nullable();
            $table->json('fasilitas_kamar');
            $table->string('foto_utama')->nullable();
            $table->json('galeri_foto')->nullable();
            $table->enum('status', ['tersedia', 'terisi', 'perawatan'])->default('tersedia');
            $table->timestamps();
            $table->index('status', 'idx_kamar_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kamar');
    }
};
