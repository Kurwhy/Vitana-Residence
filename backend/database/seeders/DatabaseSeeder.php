<?php

namespace Database\Seeders;

use App\Models\Kamar;
use App\Models\Keluhan;
use App\Models\LogNotifikasi;
use App\Models\PengajuanSewa;
use App\Models\Penghuni;
use App\Models\ProfilKos;
use App\Models\Tagihan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Model::unguard();

        $this->storePublicAssets();
        $this->makeIdentityImage(
            'Nabila Putri Maharani',
            'Mahasiswi',
            'Universitas Gadjah Mada',
            'ktp-nabila-maharani.jpg',
            '3404 **** **** 0101'
        );
        $this->makeIdentityImage(
            'Clarissa Oktaviani',
            'Karyawati',
            'PT Amerta Digital',
            'ktm-clarissa-oktaviani.jpg',
            '3404 **** **** 0202'
        );
        $this->makeIdentityImage(
            'Salsabila Kirana Putri',
            'Karyawati',
            'CV Naraya Studio',
            'ktp-salsabila-kirana.jpg',
            '3404 **** **** 0303'
        );
        $this->makeIdentityImage(
            'Dinda Ayu Lestari',
            'Mahasiswi',
            'Universitas Gadjah Mada',
            'ktm-dinda-ayu.jpg',
            '3404 **** **** 0404'
        );
        $this->makeIdentityImage(
            'Aulia Rahmawati',
            'Mahasiswi',
            'Universitas Gadjah Mada',
            'ktm-aulia-rahmawati.jpg',
            '3404 **** **** 0505'
        );
        $this->makeIdentityImage(
            'Nadia Safira',
            'Mahasiswi',
            'Universitas Gadjah Mada',
            'ktm-nadia-safira.jpg',
            '3404 **** **** 0606'
        );
        $this->makeIdentityImage(
            'Maya Wulandari',
            'Mahasiswi',
            'Universitas Negeri Yogyakarta',
            'ktm-maya-wulandari.jpg',
            '3404 **** **** 0707'
        );

        User::create([
            'nama' => 'Ratna Kusuma',
            'email' => 'ratna@vitanaresidence.id',
            'no_whatsapp' => '089674284422',
            'password' => 'admin123',
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'nama' => 'Nabila Putri Maharani',
            'email' => 'nabila.maharani@student.ac.id',
            'no_whatsapp' => '085743219870',
            'password' => 'penyewa123',
            'role' => 'penyewa',
            'is_active' => true,
        ]);

        User::create([
            'nama' => 'Clarissa Oktaviani',
            'email' => 'clarissa.oktaviani@gmail.com',
            'no_whatsapp' => '081398765432',
            'password' => 'penyewa123',
            'role' => 'penyewa',
            'is_active' => true,
        ]);

        User::create([
            'nama' => 'Salsabila Kirana Putri',
            'email' => 'salsabila.kirana@gmail.com',
            'no_whatsapp' => '081234509876',
            'password' => 'penyewa123',
            'role' => 'penyewa',
            'is_active' => true,
        ]);

        User::create([
            'nama' => 'Maya Wulandari',
            'email' => 'maya.wulandari@student.uny.ac.id',
            'no_whatsapp' => '081255667788',
            'password' => 'penyewa123',
            'role' => 'penyewa',
            'is_active' => false,
        ]);

        ProfilKos::create([
            'nama_kos' => 'Vitana Residence',
            'tagline' => 'Kos Putri Nyaman, Aman, dan Tenang Dekat Kampus',
            'deskripsi' => 'Vitana Residence menyediakan hunian kos putri dengan lingkungan bersih, keamanan 24 jam, dan akses cepat ke kawasan kampus di Yogyakarta. Dirancang untuk mendukung kenyamanan belajar mahasiswi maupun istirahat karyawati.',
            'alamat' => 'Jl. Kaliurang Km 5,2, Gg. Pandega Marta No. 14, Depok, Sleman, Yogyakarta',
            'link_maps' => 'https://maps.google.com/?q=Jl.+Kaliurang+Km+5%2C2+Gg.+Pandega+Marta+No.+14+Depok+Sleman+Yogyakarta',
            'no_whatsapp_admin' => '089674284422',
            'email_admin' => 'admin@vitanaresidence.id',
            'fasilitas_umum' => [
                'WiFi Fiber 100 Mbps',
                'Dapur Bersama dan Kulkas',
                'Ruang Tamu dan Area Belajar',
                'Parkir Motor Berkanopi',
                'CCTV 24 Jam',
                'Area Jemur Tertutup',
            ],
            'tata_tertib' => [
                'Khusus penghuni putri, jam bertamu hingga pukul 21.00 WIB di area ruang tamu.',
                'Dilarang membawa tamu masuk ke area kamar.',
                'Menjaga kebersihan dapur dan fasilitas bersama.',
            ],
            'foto_utama' => 'profil/hero-vitana.jpg',
        ]);

        $kamar = [
            [
                'nomor_kamar' => 'A-01',
                'nama_tipe' => 'Standard Single',
                'lantai' => 1,
                'luas_kamar' => '3 x 3 m',
                'harga_bulanan' => 1150000,
                'deskripsi' => 'Kamar single di lantai 1 dengan sirkulasi udara yang baik. Cocok untuk mahasiswi yang membutuhkan ruang belajar yang tenang dan dekat dengan area bersama.',
                'fasilitas_kamar' => ['Kasur Single', 'Lemari Pakaian', 'Meja Belajar', 'Kipas Angin', 'Kamar Mandi Dalam'],
                'foto_utama' => 'kamar/kamar-a01.jpg',
                'galeri_foto' => ['kamar/kamar-a01.jpg', 'kamar/kamar-baru-5.jpg', 'kamar/kamar-baru-6.jpg'],
                'status' => 'terisi',
            ],
            [
                'nomor_kamar' => 'A-02',
                'nama_tipe' => 'Standard Single',
                'lantai' => 1,
                'luas_kamar' => '3 x 3 m',
                'harga_bulanan' => 1150000,
                'deskripsi' => 'Kamar single dengan jendela lebar dan pencahayaan alami. Berada dekat ruang tamu sehingga mudah dijangkau saat menerima tamu di area bersama.',
                'fasilitas_kamar' => ['Kasur Single', 'Lemari Pakaian', 'Meja Belajar', 'Kipas Angin', 'Kamar Mandi Dalam'],
                'foto_utama' => 'kamar/kamar-baru-5.jpg',
                'galeri_foto' => ['kamar/kamar-baru-5.jpg', 'kamar/kamar-a01.jpg', 'kamar/kamar-baru-3.jpg'],
                'status' => 'tersedia',
            ],
            [
                'nomor_kamar' => 'A-03',
                'nama_tipe' => 'Standard Single',
                'lantai' => 1,
                'luas_kamar' => '3 x 3 m',
                'harga_bulanan' => 1150000,
                'deskripsi' => 'Kamar single di sisi belakang lantai 1, lebih tenang dan jauh dari jalan utama. Dilengkapi meja belajar dan kamar mandi dalam.',
                'fasilitas_kamar' => ['Kasur Single', 'Lemari Pakaian', 'Meja Belajar', 'Kipas Angin', 'Kamar Mandi Dalam'],
                'foto_utama' => 'kamar/kamar-a03.jpg',
                'galeri_foto' => ['kamar/kamar-a03.jpg', 'kamar/kamar-baru-6.jpg', 'kamar/kamar-baru-4.jpg'],
                'status' => 'terisi',
            ],
            [
                'nomor_kamar' => 'B-01',
                'nama_tipe' => 'Deluxe AC',
                'lantai' => 2,
                'luas_kamar' => '3,5 x 4 m',
                'harga_bulanan' => 1550000,
                'deskripsi' => 'Kamar deluxe ber-AC dengan ruang gerak lebih luas. Cocok untuk karyawati yang membutuhkan kenyamanan tambahan setelah hari kerja.',
                'fasilitas_kamar' => ['Kasur Queen', 'AC', 'Water Heater', 'Lemari 2 Pintu', 'Meja Belajar', 'Kamar Mandi Dalam'],
                'foto_utama' => 'kamar/kamar-baru-4.jpg',
                'galeri_foto' => ['kamar/kamar-baru-4.jpg', 'kamar/kamar-baru-3.jpg', 'kamar/kamar-a03.jpg'],
                'status' => 'terisi',
            ],
            [
                'nomor_kamar' => 'B-02',
                'nama_tipe' => 'Deluxe AC',
                'lantai' => 2,
                'luas_kamar' => '3,5 x 4 m',
                'harga_bulanan' => 1550000,
                'deskripsi' => 'Kamar deluxe ber-AC di lantai 2 dengan lemari dua pintu dan water heater. Berada dekat area jemur tertutup dan tangga utama.',
                'fasilitas_kamar' => ['Kasur Queen', 'AC', 'Water Heater', 'Lemari 2 Pintu', 'Meja Belajar', 'Kamar Mandi Dalam'],
                'foto_utama' => 'kamar/kamar-baru-3.jpg',
                'galeri_foto' => ['kamar/kamar-baru-3.jpg', 'kamar/kamar-baru-4.jpg', 'kamar/kamar-a02.jpg'],
                'status' => 'tersedia',
            ],
            [
                'nomor_kamar' => 'B-03',
                'nama_tipe' => 'Deluxe AC Balkon',
                'lantai' => 2,
                'luas_kamar' => '4 x 4 m',
                'harga_bulanan' => 1750000,
                'deskripsi' => 'Kamar paling luas di lantai 2 dengan balkon pribadi menghadap area perumahan. Pilihan nyaman untuk istirahat dan bekerja dari kamar.',
                'fasilitas_kamar' => ['Kasur Queen', 'AC', 'Water Heater', 'Balkon Pribadi', 'Lemari 2 Pintu', 'Meja Belajar', 'Kamar Mandi Dalam'],
                'foto_utama' => 'kamar/kamar-a02.jpg',
                'galeri_foto' => ['kamar/kamar-a02.jpg', 'kamar/kamar-a03.jpg', 'kamar/kamar-baru-5.jpg'],
                'status' => 'tersedia',
            ],
            [
                'nomor_kamar' => 'C-01',
                'nama_tipe' => 'Standard Single',
                'lantai' => 1,
                'luas_kamar' => '3 x 3 m',
                'harga_bulanan' => 1150000,
                'deskripsi' => 'Kamar sedang dalam perawatan kabel dan pengecatan ulang. Akan tersedia kembali setelah pemeriksaan selesai.',
                'fasilitas_kamar' => ['Kasur Single', 'Lemari Pakaian', 'Meja Belajar', 'Kamar Mandi Dalam'],
                'foto_utama' => 'kamar/kamar-baru-6.jpg',
                'galeri_foto' => ['kamar/kamar-baru-6.jpg', 'kamar/kamar-a01.jpg'],
                'status' => 'perawatan',
            ],
        ];

        foreach ($kamar as $item) {
            Kamar::create($item);
        }

        $pengajuan = [
            [
                'kode_pengajuan' => 'BKG-20261001-0001',
                'kamar_id' => 1,
                'nama_lengkap' => 'Nabila Putri Maharani',
                'email' => 'nabila.maharani@student.ac.id',
                'no_whatsapp' => '085743219870',
                'status_penghuni' => 'mahasiswi',
                'nama_instansi' => 'Universitas Gadjah Mada',
                'nama_kontak_darurat' => 'Ibu Endang Maharani',
                'no_kontak_darurat' => '081234001122',
                'tanggal_mulai_masuk' => '2026-10-01',
                'foto_identitas' => 'ktp/ktp-nabila-maharani.jpg',
                'status' => 'disetujui',
                'catatan_admin' => 'Dokumen identitas lengkap. Selamat bergabung di Vitana Residence.',
                'diverifikasi_oleh' => 1,
                'diverifikasi_pada' => '2026-09-28 10:15:00',
                'created_at' => '2026-09-27 09:20:00',
                'updated_at' => '2026-09-28 10:15:00',
            ],
            [
                'kode_pengajuan' => 'BKG-20261015-0001',
                'kamar_id' => 4,
                'nama_lengkap' => 'Clarissa Oktaviani',
                'email' => 'clarissa.oktaviani@gmail.com',
                'no_whatsapp' => '081398765432',
                'status_penghuni' => 'karyawati',
                'nama_instansi' => 'PT Amerta Digital',
                'nama_kontak_darurat' => 'Bapak Dedi Oktavianus',
                'no_kontak_darurat' => '081298760011',
                'tanggal_mulai_masuk' => '2026-10-20',
                'foto_identitas' => 'ktp/ktm-clarissa-oktaviani.jpg',
                'status' => 'disetujui',
                'catatan_admin' => 'Data pekerjaan dan kontak darurat sudah dikonfirmasi.',
                'diverifikasi_oleh' => 1,
                'diverifikasi_pada' => '2026-10-16 14:05:00',
                'created_at' => '2026-10-15 19:42:00',
                'updated_at' => '2026-10-16 14:05:00',
            ],
            [
                'kode_pengajuan' => 'BKG-20260918-0001',
                'kamar_id' => 3,
                'nama_lengkap' => 'Salsabila Kirana Putri',
                'email' => 'salsabila.kirana@gmail.com',
                'no_whatsapp' => '081234509876',
                'status_penghuni' => 'karyawati',
                'nama_instansi' => 'CV Naraya Studio',
                'nama_kontak_darurat' => 'Ibu Wulan Kirana',
                'no_kontak_darurat' => '081377889900',
                'tanggal_mulai_masuk' => '2026-09-22',
                'foto_identitas' => 'ktp/ktp-salsabila-kirana.jpg',
                'status' => 'disetujui',
                'catatan_admin' => 'Verifikasi selesai. Kredensial telah dikirim melalui WhatsApp dan email.',
                'diverifikasi_oleh' => 1,
                'diverifikasi_pada' => '2026-09-19 11:30:00',
                'created_at' => '2026-09-18 16:10:00',
                'updated_at' => '2026-09-19 11:30:00',
            ],
            [
                'kode_pengajuan' => 'BKG-20261110-0002',
                'kamar_id' => 6,
                'nama_lengkap' => 'Dinda Ayu Lestari',
                'email' => 'dinda.ayu@mail.ugm.ac.id',
                'no_whatsapp' => '081390112233',
                'status_penghuni' => 'mahasiswi',
                'nama_instansi' => 'Universitas Gadjah Mada',
                'nama_kontak_darurat' => 'Ibu Retno Lestari',
                'no_kontak_darurat' => '081226677889',
                'tanggal_mulai_masuk' => '2026-12-05',
                'foto_identitas' => 'ktp/ktm-dinda-ayu.jpg',
                'status' => 'ditolak',
                'catatan_admin' => 'Foto KTM yang diunggah tidak terbaca jelas. Silakan ajukan kembali dengan foto yang lebih terang.',
                'diverifikasi_oleh' => 1,
                'diverifikasi_pada' => '2026-11-11 08:45:00',
                'created_at' => '2026-11-10 20:18:00',
                'updated_at' => '2026-11-11 08:45:00',
            ],
            [
                'kode_pengajuan' => 'BKG-20261118-0001',
                'kamar_id' => 5,
                'nama_lengkap' => 'Aulia Rahmawati',
                'email' => 'aulia.rahmawati@mail.ugm.ac.id',
                'no_whatsapp' => '082134567890',
                'status_penghuni' => 'mahasiswi',
                'nama_instansi' => 'Universitas Gadjah Mada',
                'nama_kontak_darurat' => 'Bapak Hendra Wijaya',
                'no_kontak_darurat' => '081226543210',
                'tanggal_mulai_masuk' => '2026-12-01',
                'foto_identitas' => 'ktp/ktm-aulia-rahmawati.jpg',
                'status' => 'menunggu_verifikasi',
                'created_at' => '2026-11-18 09:12:00',
                'updated_at' => '2026-11-18 09:12:00',
            ],
            [
                'kode_pengajuan' => 'BKG-20261117-0003',
                'kamar_id' => 2,
                'nama_lengkap' => 'Nadia Safira',
                'email' => 'nadia.safira@mail.ugm.ac.id',
                'no_whatsapp' => '081395554433',
                'status_penghuni' => 'mahasiswi',
                'nama_instansi' => 'Universitas Gadjah Mada',
                'nama_kontak_darurat' => 'Bapak Fajar Safira',
                'no_kontak_darurat' => '081211223344',
                'tanggal_mulai_masuk' => '2026-12-01',
                'foto_identitas' => 'ktp/ktm-nadia-safira.jpg',
                'status' => 'menunggu_verifikasi',
                'created_at' => '2026-11-17 13:40:00',
                'updated_at' => '2026-11-17 13:40:00',
            ],
        ];

        foreach ($pengajuan as $item) {
            PengajuanSewa::create($item);
        }

        $penghuni = [
            [
                'user_id' => 2,
                'kamar_id' => 1,
                'pengajuan_id' => 1,
                'status_penghuni' => 'mahasiswi',
                'nama_instansi' => 'Universitas Gadjah Mada',
                'nama_kontak_darurat' => 'Ibu Endang Maharani',
                'no_kontak_darurat' => '081234001122',
                'foto_identitas' => 'ktp/ktp-nabila-maharani.jpg',
                'tanggal_masuk' => '2026-10-01',
                'tanggal_keluar' => null,
                'tanggal_siklus_bulanan' => 1,
                'status' => 'aktif',
                'created_at' => '2026-10-01 08:00:00',
                'updated_at' => '2026-10-01 08:00:00',
            ],
            [
                'user_id' => 3,
                'kamar_id' => 4,
                'pengajuan_id' => 2,
                'status_penghuni' => 'karyawati',
                'nama_instansi' => 'PT Amerta Digital',
                'nama_kontak_darurat' => 'Bapak Dedi Oktavianus',
                'no_kontak_darurat' => '081298760011',
                'foto_identitas' => 'ktp/ktm-clarissa-oktaviani.jpg',
                'tanggal_masuk' => '2026-10-20',
                'tanggal_keluar' => null,
                'tanggal_siklus_bulanan' => 20,
                'status' => 'aktif',
                'created_at' => '2026-10-20 08:00:00',
                'updated_at' => '2026-10-20 08:00:00',
            ],
            [
                'user_id' => 4,
                'kamar_id' => 3,
                'pengajuan_id' => 3,
                'status_penghuni' => 'karyawati',
                'nama_instansi' => 'CV Naraya Studio',
                'nama_kontak_darurat' => 'Ibu Wulan Kirana',
                'no_kontak_darurat' => '081377889900',
                'foto_identitas' => 'ktp/ktp-salsabila-kirana.jpg',
                'tanggal_masuk' => '2026-09-22',
                'tanggal_keluar' => null,
                'tanggal_siklus_bulanan' => 22,
                'status' => 'aktif',
                'created_at' => '2026-09-22 08:00:00',
                'updated_at' => '2026-09-22 08:00:00',
            ],
            [
                'user_id' => 5,
                'kamar_id' => 7,
                'pengajuan_id' => null,
                'status_penghuni' => 'mahasiswi',
                'nama_instansi' => 'Universitas Negeri Yogyakarta',
                'nama_kontak_darurat' => 'Ibu Prita Wulandari',
                'no_kontak_darurat' => '081255667788',
                'foto_identitas' => 'ktp/ktm-maya-wulandari.jpg',
                'tanggal_masuk' => '2026-02-10',
                'tanggal_keluar' => '2026-08-31',
                'tanggal_siklus_bulanan' => 10,
                'status' => 'selesai',
                'created_at' => '2026-02-10 08:00:00',
                'updated_at' => '2026-08-31 12:00:00',
            ],
        ];

        foreach ($penghuni as $item) {
            Penghuni::create($item);
        }

        $tagihan = [
            [
                'kode_tagihan' => 'INV-202611-0001',
                'penghuni_id' => 1,
                'kamar_id' => 1,
                'periode_bulan' => '2026-11',
                'nominal' => 1150000,
                'tanggal_jatuh_tempo' => '2026-11-10',
                'status' => 'lunas',
                'midtrans_order_id' => 'INV-202611-0001-1762590720',
                'midtrans_snap_token' => 'demo-snap-token-1',
                'metode_pembayaran' => 'qris',
                'dibayar_pada' => '2026-11-08 14:32:00',
                'created_at' => '2026-11-03 00:30:00',
                'updated_at' => '2026-11-08 14:32:00',
            ],
            [
                'kode_tagihan' => 'INV-202611-0002',
                'penghuni_id' => 2,
                'kamar_id' => 4,
                'periode_bulan' => '2026-11',
                'nominal' => 1550000,
                'tanggal_jatuh_tempo' => '2026-11-20',
                'status' => 'belum_bayar',
                'created_at' => '2026-11-13 00:30:00',
                'updated_at' => '2026-11-13 00:30:00',
            ],
            [
                'kode_tagihan' => 'INV-202611-0003',
                'penghuni_id' => 3,
                'kamar_id' => 3,
                'periode_bulan' => '2026-11',
                'nominal' => 1150000,
                'tanggal_jatuh_tempo' => '2026-11-22',
                'status' => 'menunggu_pembayaran',
                'midtrans_order_id' => 'INV-202611-0003-1763370000',
                'midtrans_snap_token' => 'demo-snap-token-2',
                'created_at' => '2026-11-15 00:30:00',
                'updated_at' => '2026-11-17 09:00:00',
            ],
            [
                'kode_tagihan' => 'INV-202610-0001',
                'penghuni_id' => 1,
                'kamar_id' => 1,
                'periode_bulan' => '2026-10',
                'nominal' => 1150000,
                'tanggal_jatuh_tempo' => '2026-10-10',
                'status' => 'lunas',
                'midtrans_order_id' => 'INV-202610-0001-1759824000',
                'midtrans_snap_token' => 'demo-snap-token-3',
                'metode_pembayaran' => 'bank_transfer',
                'dibayar_pada' => '2026-10-07 09:15:00',
                'created_at' => '2026-10-03 00:30:00',
                'updated_at' => '2026-10-07 09:15:00',
            ],
            [
                'kode_tagihan' => 'INV-202610-0002',
                'penghuni_id' => 2,
                'kamar_id' => 4,
                'periode_bulan' => '2026-10',
                'nominal' => 1550000,
                'tanggal_jatuh_tempo' => '2026-10-20',
                'status' => 'lunas',
                'midtrans_order_id' => 'INV-202610-0002-1759824001',
                'midtrans_snap_token' => 'demo-snap-token-4',
                'metode_pembayaran' => 'qris',
                'dibayar_pada' => '2026-10-19 20:05:00',
                'created_at' => '2026-10-13 00:30:00',
                'updated_at' => '2026-10-19 20:05:00',
            ],
            [
                'kode_tagihan' => 'INV-202610-0003',
                'penghuni_id' => 3,
                'kamar_id' => 3,
                'periode_bulan' => '2026-10',
                'nominal' => 1150000,
                'tanggal_jatuh_tempo' => '2026-10-22',
                'status' => 'terlambat',
                'created_at' => '2026-10-15 00:30:00',
                'updated_at' => '2026-10-23 00:30:00',
            ],
            [
                'kode_tagihan' => 'INV-202609-0001',
                'penghuni_id' => 1,
                'kamar_id' => 1,
                'periode_bulan' => '2026-09',
                'nominal' => 1150000,
                'tanggal_jatuh_tempo' => '2026-09-10',
                'status' => 'lunas',
                'midtrans_order_id' => 'INV-202609-0001-1757030400',
                'midtrans_snap_token' => 'demo-snap-token-5',
                'metode_pembayaran' => 'qris',
                'dibayar_pada' => '2026-09-09 08:40:00',
                'created_at' => '2026-09-03 00:30:00',
                'updated_at' => '2026-09-09 08:40:00',
            ],
            [
                'kode_tagihan' => 'INV-202609-0002',
                'penghuni_id' => 2,
                'kamar_id' => 4,
                'periode_bulan' => '2026-09',
                'nominal' => 1550000,
                'tanggal_jatuh_tempo' => '2026-09-20',
                'status' => 'lunas',
                'midtrans_order_id' => 'INV-202609-0002-1757030401',
                'midtrans_snap_token' => 'demo-snap-token-6',
                'metode_pembayaran' => 'bank_transfer',
                'dibayar_pada' => '2026-09-18 17:22:00',
                'created_at' => '2026-09-13 00:30:00',
                'updated_at' => '2026-09-18 17:22:00',
            ],
            [
                'kode_tagihan' => 'INV-202609-0003',
                'penghuni_id' => 3,
                'kamar_id' => 3,
                'periode_bulan' => '2026-09',
                'nominal' => 1150000,
                'tanggal_jatuh_tempo' => '2026-09-22',
                'status' => 'lunas',
                'midtrans_order_id' => 'INV-202609-0003-1757030402',
                'midtrans_snap_token' => 'demo-snap-token-7',
                'metode_pembayaran' => 'qris',
                'dibayar_pada' => '2026-09-20 11:05:00',
                'created_at' => '2026-09-15 00:30:00',
                'updated_at' => '2026-09-20 11:05:00',
            ],
        ];

        foreach ($tagihan as $item) {
            Tagihan::create($item);
        }

        $keluhan = [
            [
                'kode_keluhan' => 'KLP-20261115-0001',
                'penghuni_id' => 2,
                'kamar_id' => 4,
                'kategori' => 'listrik_air',
                'judul' => 'Air water heater kurang panas di pagi hari',
                'deskripsi' => 'Air dari water heater kamar mandi hanya hangat saat digunakan pagi hari. Sudah dicoba menunggu beberapa menit, tetapi suhu tidak berubah.',
                'foto_bukti' => 'keluhan/bukti-air.jpg',
                'status' => 'diproses',
                'tanggapan_admin' => 'Laporan sudah diteruskan ke teknisi. Pemeriksaan dijadwalkan pada 19 November 2026 pagi.',
                'created_at' => '2026-11-15 07:45:00',
                'updated_at' => '2026-11-15 09:00:00',
            ],
            [
                'kode_keluhan' => 'KLP-20261117-0002',
                'penghuni_id' => 3,
                'kamar_id' => 3,
                'kategori' => 'internet_wifi',
                'judul' => 'WiFi terputus di lantai 1 sejak pagi',
                'deskripsi' => 'WiFi tidak muncul di daftar jaringan sejak pukul 06.00. Perangkat lain di kamar juga tidak dapat terhubung.',
                'foto_bukti' => 'keluhan/bukti-wifi.jpg',
                'status' => 'menunggu',
                'created_at' => '2026-11-17 08:20:00',
                'updated_at' => '2026-11-17 08:20:00',
            ],
            [
                'kode_keluhan' => 'KLP-20261110-0003',
                'penghuni_id' => 1,
                'kamar_id' => 1,
                'kategori' => 'perabot_kamar',
                'judul' => 'Engsel lemari pakaian longgar',
                'deskripsi' => 'Pintu lemari pakaian bagian kanan tidak menutup rapat karena engsel atas terasa longgar.',
                'status' => 'selesai',
                'tanggapan_admin' => 'Engsel sudah diganti dan pintu lemari sudah diuji menutup rapat. Terima kasih atas laporannya.',
                'diselesaikan_pada' => '2026-11-12 15:40:00',
                'created_at' => '2026-11-10 18:05:00',
                'updated_at' => '2026-11-12 15:40:00',
            ],
            [
                'kode_keluhan' => 'KLP-20261112-0004',
                'penghuni_id' => 2,
                'kamar_id' => 4,
                'kategori' => 'kebersihan_keamanan',
                'judul' => 'Lampu koridor lantai 2 mati',
                'deskripsi' => 'Lampu koridor di dekat kamar B-01 dan B-02 mati sejak semalam sehingga koridor gelap saat malam.',
                'status' => 'selesai',
                'tanggapan_admin' => 'Lampu koridor sudah diganti pada 13 November 2026 sore.',
                'diselesaikan_pada' => '2026-11-13 11:10:00',
                'created_at' => '2026-11-12 21:30:00',
                'updated_at' => '2026-11-13 11:10:00',
            ],
            [
                'kode_keluhan' => 'KLP-20261118-0005',
                'penghuni_id' => 3,
                'kamar_id' => 3,
                'kategori' => 'listrik_air',
                'judul' => 'Stop kontak dekat meja belajar tidak berfungsi',
                'deskripsi' => 'Stop kontak di dekat meja belajar tidak mengalirkan listrik saat charger dicolok. Stop kontak lain di kamar masih normal.',
                'status' => 'menunggu',
                'created_at' => '2026-11-18 06:50:00',
                'updated_at' => '2026-11-18 06:50:00',
            ],
        ];

        foreach ($keluhan as $item) {
            Keluhan::create($item);
        }

        LogNotifikasi::create([
            'tagihan_id' => 1,
            'tujuan' => '085743219870',
            'kanal' => 'whatsapp',
            'jenis_pesan' => 'reminder_h3',
            'isi_ringkas' => 'Pengingat tagihan INV-202611-0001 jatuh tempo 10 November 2026.',
            'status' => 'terkirim',
            'respons_api' => 'MOCK_MODE',
            'created_at' => '2026-11-07 08:00:00',
            'updated_at' => '2026-11-07 08:00:00',
        ]);

        LogNotifikasi::create([
            'tagihan_id' => 1,
            'tujuan' => 'nabila.maharani@student.ac.id',
            'kanal' => 'email',
            'jenis_pesan' => 'reminder_h3',
            'isi_ringkas' => 'Pengingat tagihan INV-202611-0001 jatuh tempo 10 November 2026.',
            'status' => 'terkirim',
            'respons_api' => 'MOCK_MODE',
            'created_at' => '2026-11-07 08:00:05',
            'updated_at' => '2026-11-07 08:00:05',
        ]);

        Model::reguard();
    }

    private function storePublicAssets(): void
    {
        $assets = [
            'hero-vitana.jpg' => 'profil/hero-vitana.jpg',
            'kamar-a01.jpg' => 'kamar/kamar-a01.jpg',
            'kamar-a02.jpg' => 'kamar/kamar-a02.jpg',
            'kamar-a03.jpg' => 'kamar/kamar-a03.jpg',
            'kamar-baru-3.jpg' => 'kamar/kamar-baru-3.jpg',
            'kamar-baru-4.jpg' => 'kamar/kamar-baru-4.jpg',
            'kamar-baru-5.jpg' => 'kamar/kamar-baru-5.jpg',
            'kamar-baru-6.jpg' => 'kamar/kamar-baru-6.jpg',
            'bukti-air.jpg' => 'keluhan/bukti-air.jpg',
            'bukti-wifi.jpg' => 'keluhan/bukti-wifi.jpg',
        ];

        foreach ($assets as $source => $destination) {
            $path = base_path('../frontend/public/images/'.$source);
            if (File::exists($path)) {
                Storage::disk('public')->put($destination, File::get($path));
            }
        }
    }

    private function makeIdentityImage(
        string $name,
        string $status,
        string $instansi,
        string $filename,
        string $nik
    ): void {
        $width = 1000;
        $height = 620;
        $image = imagecreatetruecolor($width, $height);

        $background = imagecolorallocate($image, 235, 232, 220);
        $white = imagecolorallocate($image, 255, 255, 255);
        $ink = imagecolorallocate($image, 24, 34, 31);
        $muted = imagecolorallocate($image, 90, 102, 98);
        $brand = imagecolorallocate($image, 27, 94, 75);

        imagefilledrectangle($image, 0, 0, $width, $height, $background);
        imagefilledrectangle($image, 28, 28, $width - 28, $height - 28, $white);
        imagefilledrectangle($image, 28, 28, $width - 28, 108, $brand);

        $regular = '/System/Library/Fonts/Supplemental/Arial.ttf';
        $bold = '/System/Library/Fonts/Supplemental/Arial Bold.ttf';

        imagettftext($image, 20, 0, 55, 78, $white, $bold, 'KARTU IDENTITAS PENYEWA');
        imagettftext($image, 13, 0, 55, 145, $muted, $regular, 'DATA CONTOH UNTUK DEMO VITANA RESIDENCE');

        $rows = [
            ['Nama', $name],
            ['Status', $status],
            ['Instansi', $instansi],
            ['NIK', $nik],
            ['Keterangan', 'Dokumen ini bukan dokumen resmi'],
        ];

        $y = 210;
        foreach ($rows as $row) {
            imagettftext($image, 14, 0, 55, $y, $muted, $bold, strtoupper($row[0]));
            imagettftext($image, 22, 0, 250, $y, $ink, $regular, $row[1]);
            imageline($image, 55, $y + 18, $width - 55, $y + 18, imagecolorallocate($image, 229, 231, 226));
            $y += 70;
        }

        imagettftext($image, 12, 0, 55, $height - 55, $muted, $regular, 'Dokumen disimpan pada penyimpanan privat dan hanya dapat diakses Admin.');

        ob_start();
        imagejpeg($image, null, 90);
        $data = ob_get_clean();
        imagedestroy($image);

        Storage::disk('local')->put('ktp/'.$filename, $data);
    }
}
