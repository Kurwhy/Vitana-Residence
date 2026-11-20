export const STATUS_BADGE = {
  tersedia: { label: 'Tersedia', classes: 'border-green-200 bg-green-50 text-green-700' },
  terisi: { label: 'Terisi', classes: 'border-brand-200 bg-brand-50 text-brand-700' },
  perawatan: { label: 'Perawatan', classes: 'border-amber-200 bg-amber-50 text-amber-700' },
  menunggu_verifikasi: {
    label: 'Menunggu Verifikasi',
    classes: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  disetujui: { label: 'Disetujui', classes: 'border-green-200 bg-green-50 text-green-700' },
  ditolak: { label: 'Ditolak', classes: 'border-red-200 bg-red-50 text-red-700' },
  belum_bayar: { label: 'Belum Bayar', classes: 'border-amber-200 bg-amber-50 text-amber-700' },
  menunggu_pembayaran: {
    label: 'Menunggu Pembayaran',
    classes: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  lunas: { label: 'Lunas', classes: 'border-green-200 bg-green-50 text-green-700' },
  terlambat: { label: 'Terlambat', classes: 'border-red-200 bg-red-50 text-red-700' },
  menunggu: { label: 'Menunggu', classes: 'border-amber-200 bg-amber-50 text-amber-700' },
  diproses: { label: 'Diproses', classes: 'border-brand-200 bg-brand-50 text-brand-700' },
  selesai: { label: 'Selesai', classes: 'border-green-200 bg-green-50 text-green-700' },
  aktif: { label: 'Aktif', classes: 'border-green-200 bg-green-50 text-green-700' },
}

export const KATEGORI_KELUHAN = {
  listrik_air: 'Listrik dan Air',
  internet_wifi: 'Internet dan WiFi',
  perabot_kamar: 'Perabot Kamar',
  kebersihan_keamanan: 'Kebersihan dan Keamanan',
  lainnya: 'Lainnya',
}

export const METODE_PEMBAYARAN = {
  qris: 'QRIS',
  bank_transfer: 'Virtual Account',
  gopay: 'E-Wallet',
  echannel: 'Mandiri Bill',
  credit_card: 'Kartu Kredit',
}

export const JENIS_PENGHUNI = {
  mahasiswi: 'Mahasiswi',
  karyawati: 'Karyawati',
}

export const STATUS_PENGAJUAN_FILTER = [
  { value: 'semua', label: 'Semua' },
  { value: 'menunggu_verifikasi', label: 'Menunggu Verifikasi' },
  { value: 'disetujui', label: 'Disetujui' },
  { value: 'ditolak', label: 'Ditolak' },
]

export const STATUS_TAGIHAN_FILTER = [
  { value: 'semua', label: 'Semua' },
  { value: 'belum_bayar', label: 'Belum Bayar' },
  { value: 'menunggu_pembayaran', label: 'Menunggu Pembayaran' },
  { value: 'lunas', label: 'Lunas' },
  { value: 'terlambat', label: 'Terlambat' },
]

export const STATUS_KELUHAN_FILTER = [
  { value: 'semua', label: 'Semua' },
  { value: 'menunggu', label: 'Menunggu' },
  { value: 'diproses', label: 'Diproses' },
  { value: 'selesai', label: 'Selesai' },
]

export const KAMAR_STATUS_FILTER = [
  { value: 'semua', label: 'Semua' },
  { value: 'tersedia', label: 'Tersedia' },
  { value: 'terisi', label: 'Terisi' },
]
