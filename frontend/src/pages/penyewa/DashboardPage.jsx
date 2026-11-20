import { Link } from 'react-router-dom'
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MessageSquareWarning,
  ReceiptText,
} from 'lucide-react'
import { PaymentModal } from '../../components/PaymentModal'
import { RoomPhotoFallback } from '../../components/RoomCard'
import {
  Button,
  ErrorState,
  LoadingState,
  PageHeader,
  StatusBadge,
  buttonStyles,
} from '../../components/ui'
import { usePenyewaDashboard } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { usePaymentFlow } from '../../hooks/usePaymentFlow'
import { formatPeriode, formatRupiah, formatTanggal, formatTanggalWaktu } from '../../lib/utils'

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = usePenyewaDashboard()
  const {
    startPayment,
    startLoading,
    mockOpen,
    mockBill,
    closeMockPayment,
    confirmMockPayment,
    processingMock,
  } = usePaymentFlow()

  usePageMeta({
    title: 'Beranda Penyewa',
    description: 'Ringkasan hunian, tagihan, dan keluhan penyewa Vitana Residence.',
    noindex: true,
  })

  if (isLoading) {
    return (
      <>
        <PageHeader eyebrow="Hunian saya" title="Beranda Penyewa" />
        <div className="mt-5">
          <LoadingState label="Memuat ringkasan hunian" />
        </div>
      </>
    )
  }

  if (isError || !data?.data) {
    return (
      <>
        <PageHeader eyebrow="Hunian saya" title="Beranda Penyewa" />
        <div className="mt-5">
          <ErrorState
            title="Data hunian belum dapat dimuat"
            description="Data kamar dan tagihan belum dapat diambil dari server. Periksa koneksi lalu coba lagi."
            onRetry={refetch}
          />
        </div>
      </>
    )
  }

  const dashboard = data.data
  const current = dashboard.penghuni
  const room = dashboard.kamar
  const activeBill = dashboard.tagihan_aktif
  const complaints = dashboard.keluhan_terakhir || []
  const dueDate = dashboard.tanggal_jatuh_tempo_berikutnya
  const userName = current.user?.nama || 'Penyewa'

  if (!current || !room) {
    return (
      <>
        <h1 className="sr-only">Data hunian tidak ditemukan</h1>
        <ErrorState
          title="Data hunian tidak ditemukan"
          description="Akun Anda belum terhubung dengan data kamar aktif. Hubungi Admin Vitana Residence untuk pemeriksaan lebih lanjut."
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Hunian saya"
        title="Beranda Penyewa"
        description={`Selamat datang, ${userName}. Berikut ringkasan hunian dan tagihan Anda.`}
      />

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-card border border-line bg-white p-5 sm:p-6" aria-labelledby="kamar-saya">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="kamar-saya" className="text-h2 text-ink">Kamar yang ditempati</h2>
              <p className="mt-1 text-small text-muted">Kamar {room.nomor_kamar}, {room.nama_tipe}</p>
            </div>
            <StatusBadge status={current.status} />
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <div className="w-full overflow-hidden rounded-card border border-line bg-brand-50 sm:w-40 sm:shrink-0">
              {room.foto_utama_url ? (
                <img
                  src={room.foto_utama_url}
                  alt={`Foto kamar ${room.nomor_kamar}`}
                  width="320"
                  height="240"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover sm:aspect-square"
                />
              ) : (
                <div className="aspect-[4/3] sm:aspect-square">
                  <RoomPhotoFallback />
                </div>
              )}
            </div>
            <dl className="grid flex-1 gap-x-5 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-small font-medium text-muted">Tanggal mulai menghuni</dt>
                <dd className="mt-1 text-small font-semibold text-ink">
                  {formatTanggal(dashboard.tanggal_masuk)}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Siklus tagihan</dt>
                <dd className="mt-1 text-small font-semibold tabular text-ink">
                  Tanggal {current.tanggal_siklus_bulanan} setiap bulan
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Jatuh tempo berikutnya</dt>
                <dd className="mt-1 text-small font-semibold tabular text-ink">
                  {dueDate ? formatTanggal(dueDate) : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Harga sewa bulanan</dt>
                <dd className="mt-1 text-small font-semibold tabular text-ink">
                  {formatRupiah(room.harga_bulanan)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-small font-medium text-muted">Instansi</dt>
                <dd className="mt-1 text-small font-semibold text-ink">{current.nama_instansi}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
            <Link to="/penyewa/tagihan" className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
              <ReceiptText className="h-4 w-4" aria-hidden="true" />
              Riwayat tagihan
            </Link>
            <Link to="/penyewa/profil" className={buttonStyles({ variant: 'ghost', size: 'sm' })}>
              Lihat profil akun
            </Link>
          </div>
        </section>

        <section
          className={`overflow-hidden rounded-card border ${
            activeBill ? 'border-brand-800 bg-brand-900 text-white' : 'border-line bg-white'
          }`}
          aria-labelledby="tagihan-aktif"
        >
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="tagihan-aktif"
                  className={`text-h2 ${activeBill ? 'text-white' : 'text-ink'}`}
                >
                  Tagihan aktif
                </h2>
                <p className={`mt-1 text-small ${activeBill ? 'text-brand-200' : 'text-muted'}`}>
                  Tagihan yang perlu diselesaikan.
                </p>
              </div>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-btn ${
                  activeBill ? 'bg-white/10 text-brand-100' : 'bg-brand-50 text-brand-700'
                }`}
              >
                <CreditCard className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>

            {activeBill ? (
              <div className="mt-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-small font-medium text-brand-200">
                      {activeBill.kode_tagihan}
                    </p>
                    <p className="mt-2 text-[32px] font-bold leading-none tabular text-white">
                      {formatRupiah(activeBill.nominal)}
                    </p>
                    <p className="mt-2 text-small text-brand-200">
                      Periode {formatPeriode(activeBill.periode_bulan)}
                    </p>
                  </div>
                  <StatusBadge status={activeBill.status} />
                </div>
                <p className="mt-5 flex items-center gap-2 rounded-btn bg-white/10 px-3 py-2 text-small text-brand-50">
                  <CalendarDays className="h-4 w-4 shrink-0 text-brand-200" aria-hidden="true" />
                  Jatuh tempo {formatTanggal(activeBill.tanggal_jatuh_tempo)}
                </p>
                <Button
                  variant="inverse"
                  className="mt-3 w-full"
                  onClick={() => startPayment(activeBill)}
                  loading={startLoading}
                >
                  Bayar Sekarang
                </Button>
                <Link
                  to="/penyewa/tagihan"
                  className="mt-2 flex min-h-[44px] items-center justify-center text-small font-semibold text-brand-100 underline decoration-brand-400 underline-offset-4 hover:text-white"
                >
                  Lihat semua tagihan
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <CheckCircle2 className="h-8 w-8 text-success" aria-hidden="true" />
                <p className="mt-2 text-h3 text-ink">Tidak ada tagihan aktif</p>
                <p className="mt-1 text-small leading-relaxed text-muted">
                  Tagihan berikutnya diterbitkan H-7 sebelum tanggal jatuh tempo siklus bulanan Anda.
                </p>
                {dueDate ? (
                  <p className="mt-3 flex items-center gap-2 rounded-btn bg-brand-50 px-3 py-2 text-small text-ink">
                    <CalendarDays className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                    Jatuh tempo berikutnya {formatTanggal(dueDate)}
                  </p>
                ) : null}
                <Link
                  to="/penyewa/tagihan"
                  className={buttonStyles({ variant: 'secondary', className: 'mt-3 w-full' })}
                >
                  Lihat riwayat pembayaran
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-card border border-line bg-white" aria-labelledby="keluhan-terakhir">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 id="keluhan-terakhir" className="text-h2 text-ink">Keluhan terakhir</h2>
            <p className="mt-1 text-small text-muted">Maksimal tiga laporan terakhir yang Anda ajukan.</p>
          </div>
          <Link
            to="/penyewa/keluhan"
            className="inline-flex min-h-[44px] items-center text-small font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-900"
          >
            Kelola keluhan
          </Link>
        </div>

        {complaints.length > 0 ? (
          <ul className="divide-y divide-line">
            {complaints.slice(0, 3).map((item) => (
              <li key={item.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-small font-medium tabular text-muted">{item.kode_keluhan}</p>
                  <p className="mt-1 text-small font-semibold text-ink">{item.judul}</p>
                  <p className="mt-1 text-small text-muted">
                    Diajukan {formatTanggalWaktu(item.created_at)}
                  </p>
                  {item.tanggapan_admin ? (
                    <p className="mt-2 max-w-prose text-small leading-relaxed text-muted">
                      Tanggapan Admin: {item.tanggapan_admin}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <StatusBadge status={item.status} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-8 text-center">
            <MessageSquareWarning className="mx-auto h-6 w-6 text-muted" aria-hidden="true" />
            <p className="mt-2 text-small font-semibold text-ink">Belum ada keluhan</p>
            <p className="mt-1 text-small text-muted">
              Sampaikan kendala fasilitas kamar melalui halaman Keluhan Saya.
            </p>
            <Link
              to="/penyewa/keluhan"
              className={buttonStyles({ variant: 'secondary', className: 'mt-3' })}
            >
              Ajukan keluhan
            </Link>
          </div>
        )}
      </section>

      <PaymentModal
        open={mockOpen}
        onClose={closeMockPayment}
        tagihan={mockBill}
        onConfirm={confirmMockPayment}
        processing={processingMock}
      />
    </>
  )
}
