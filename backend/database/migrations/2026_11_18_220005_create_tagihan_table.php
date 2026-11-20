<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tagihan', function (Blueprint $table) {
            $table->id();
            $table->string('kode_tagihan', 25)->unique();
            $table->foreignId('penghuni_id')->constrained('penghuni');
            $table->foreignId('kamar_id')->constrained('kamar');
            $table->string('periode_bulan', 7);
            $table->decimal('nominal', 12, 2);
            $table->date('tanggal_jatuh_tempo');
            $table->enum('status', ['belum_bayar', 'menunggu_pembayaran', 'lunas', 'terlambat'])->default('belum_bayar');
            $table->string('midtrans_order_id', 60)->nullable()->unique();
            $table->string('midtrans_snap_token')->nullable();
            $table->string('metode_pembayaran', 50)->nullable();
            $table->dateTime('dibayar_pada')->nullable();
            $table->timestamps();
            $table->unique(['penghuni_id', 'periode_bulan'], 'uq_tagihan_penghuni_periode');
            $table->index(['status', 'tanggal_jatuh_tempo'], 'idx_tagihan_status_tempo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tagihan');
    }
};
