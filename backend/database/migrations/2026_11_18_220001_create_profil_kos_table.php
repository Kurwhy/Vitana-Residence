<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profil_kos', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kos', 100);
            $table->string('tagline', 200);
            $table->text('deskripsi');
            $table->text('alamat');
            $table->string('link_maps')->nullable();
            $table->string('no_whatsapp_admin', 20);
            $table->string('email_admin', 150);
            $table->json('fasilitas_umum');
            $table->json('tata_tertib');
            $table->string('foto_utama')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profil_kos');
    }
};
