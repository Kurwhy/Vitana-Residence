import { Link } from 'react-router-dom'
import {
  BedDouble,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  MessageSquareWarning,
  Wallet,
} from 'lucide-react'
import { ErrorState, LoadingState, PageHeader, StatusBadge } from '../../components/ui'
import { useAdminDashboard } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { formatPeriode, formatRupiah, formatTanggal } from '../../lib/utils'

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useAdminDashboard()

  usePageMeta({
    title: 'Dashboard Admin',
    description: 'Ringkasan operasional Vitana Residence.',
    noindex: true,
  })

  if (isLoading) {
    return (
      <>
        <PageHeader
          eyebrow="Ringkasan operasional"
          title="Dashboard Admin"
          description="Ringkasan okupansi kamar, pengajuan, pendapatan, tagihan, dan keluhan yang perlu ditangani."
        />
        <div className="mt-6">
          <LoadingState label="Memuat ringkasan operasional" />
        </div>
      </>
    )
  }

  if (isError || !data?.data) {
    return (
      <>
        <PageHeader eyebrow="Ringkasan operasional" title="Dashboard Admin" />
        <div className="mt-6">
          <ErrorState onRetry={refetch} />
        </div>
      </>
    )
  }

  const dashboard = data.data
  const totalKamar = dashboard.kamar.total
  const tersedia = dashboard.kamar.tersedia
  const terisi = dashboard.kamar.terisi
  const perawatan = dashboard.kamar.perawatan
  const kamarTersedia = dashboard.kamar_tersedia || []
  const kamarPerawatan = dashboard.kamar_perawatan || []
  const pengajuanBaru = dashboard.pengajuan_menunggu
  const periodeBerjalan = dashboard.periode_berjalan
  const pendapatan = dashboard.pendapatan_lunas_bulan_ini
  const lunasBulanIniCount = dashboard.jumlah_tagihan_lunas_bulan_ini
  const tagihanPerhatian = dashboard.tagihan_perhatian || []
  const keluhanAktif = dashboard.keluhan_aktif || []

  const barSegments = [
    { label: 'Tersedia', value: tersedia, className: 'bg-success' },
    { label: 'Terisi', value: terisi, className: 'bg-brand-600' },
    { label: 'Perawatan', value: perawatan, className: 'bg-warning' },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Ringkasan operasional"
        title="Dashboard Admin"
        description="Ringkasan okupansi kamar, pengajuan, pendapatan, tagihan, dan keluhan yang perlu ditangani."
      />

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <section className="rounded-card border border-line bg-white p-5 sm:p-6" aria-labelledby="okupansi-kamar">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-brand-50 text-brand-700">
                <BedDouble className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 id="okupansi-kamar" className="text-h2 text-ink">
                  Okupansi kamar
                </h2>
                <p className="mt-1 text-small text-muted">
                  Status seluruh unit kamar saat ini.
                </p>
              </div>
            </div>
            <Link
              to="/admin/kamar"
              className="inline-flex min-h-[44px] items-center text-small font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-900"
            >
              Kelola kamar
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-2">
            <p className="text-[34px] font-bold leading-none tabular text-ink">
              {terisi}
              <span className="ml-1 text-small font-medium text-muted">kamar terisi</span>
            </p>
            <p className="pb-0.5 text-small text-muted">
              dari <span className="font-semibold tabular text-ink">{totalKamar}</span> unit kamar
            </p>
          </div>

          <div className="mt-5 flex h-2.5 overflow-hidden rounded-full bg-brand-100" aria-hidden="true">
            {barSegments.map((segment) => (
              <span
                key={segment.label}
                className={segment.className}
                style={{ width: `${totalKamar ? (segment.value / totalKamar) * 100 : 0}%` }}
              />
            ))}
          </div>

          <dl className="mt-5 grid grid-cols-3 gap-3">
            {barSegments.map((segment) => (
              <div key={segment.label}>
                <dt className="flex items-center gap-1.5 text-small font-medium text-muted">
                  <span className={`h-2 w-2 rounded-full ${segment.className}`} aria-hidden="true" />
                  {segment.label}
                </dt>
                <dd className="mt-1 text-h3 font-bold tabular text-ink">{segment.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 border-t border-line pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-small font-semibold text-muted">Kamar siap diajukan</p>
              <Link
                to="/kamar"
                className="inline-flex min-h-[44px] items-center text-small font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-900"
              >
                Lihat katalog publik
              </Link>
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {kamarTersedia.length > 0 ? (
                kamarTersedia.map((item) => (
                  <Link
                    key={item.id}
                    to={`/kamar/${item.id}`}
                    className="inline-flex min-h-[44px] items-center rounded-btn border border-line-strong bg-white px-3 text-small font-semibold tabular text-ink transition-colors hover:border-brand-300 hover:bg-brand-50"
                  >
                    Kamar {item.nomor_kamar}
                  </Link>
                ))
              ) : (
                <p className="py-2 text-small text-muted">Belum ada kamar tersedia saat ini.</p>
              )}
            </div>
            {kamarPerawatan.length > 0 ? (
              <p className="mt-2 text-small text-muted">
                Dalam perawatan:{' '}
                {kamarPerawatan.map((item) => `Kamar ${item.nomor_kamar}`).join(', ')}
              </p>
            ) : null}
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <section className="rounded-card border border-brand-700 bg-brand-800 p-5 text-white sm:p-6" aria-labelledby="pendapatan-bulan">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="pendapatan-bulan" className="text-h2 font-semibold text-brand-100">
                  Pendapatan lunas bulan berjalan
                </h2>
                <p className="mt-1 text-small text-brand-200">{formatPeriode(periodeBerjalan)}</p>
              </div>
              <Wallet className="h-5 w-5 text-brand-200" aria-hidden="true" />
            </div>
            <p className="mt-4 text-[30px] font-bold leading-none tabular text-white">
              {formatRupiah(pendapatan)}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-brand-700 pt-3">
              <p className="text-small text-brand-200">
                <span className="font-semibold tabular text-white">{lunasBulanIniCount}</span>{' '}
                tagihan lunas
              </p>
              <Link
                to="/admin/tagihan"
                className="inline-flex min-h-[44px] items-center text-small font-semibold text-white underline decoration-brand-400 underline-offset-4 hover:text-brand-100"
              >
                Lihat tagihan
              </Link>
            </div>
          </section>

          <section className="rounded-card border border-line bg-white p-5 sm:p-6" aria-labelledby="pengajuan-baru">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="pengajuan-baru" className="text-h2 font-semibold text-ink">
                  Pengajuan baru
                </h2>
                <p className="mt-2 text-[30px] font-bold leading-none tabular text-ink">
                  {pengajuanBaru}
                </p>
                <p className="mt-1 text-small text-muted">menunggu verifikasi Admin</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-btn bg-brand-50 text-brand-700">
                <ClipboardList className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <Link
              to="/admin/pengajuan"
              className="mt-3 inline-flex min-h-[44px] items-center text-small font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-900"
            >
              Buka daftar pengajuan
            </Link>
          </section>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
        <section className="min-w-0 rounded-card border border-line bg-white" aria-labelledby="tagihan-perhatian">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 id="tagihan-perhatian" className="text-h2 text-ink">
                Tagihan perlu perhatian
              </h2>
              <p className="mt-0.5 text-small text-muted">
                Tagihan terdekat yang belum lunas.
              </p>
            </div>
            <Link
              to="/admin/tagihan"
              className="inline-flex min-h-[44px] items-center text-small font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-900"
            >
              Semua tagihan
            </Link>
          </div>
          {tagihanPerhatian.length > 0 ? (
            <ul className="divide-y divide-line px-5">
              {tagihanPerhatian.map((item) => {
                return (
                  <li key={item.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <div className="min-w-0">
                      <p className="text-small font-semibold tabular text-ink">{item.kode_tagihan}</p>
                      <p className="mt-0.5 truncate text-small text-muted">
                        {item.penghuni?.user?.nama || 'Penghuni'} · Kamar {item.kamar?.nomor_kamar || '-'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:gap-3">
                      <div className="text-left sm:text-right">
                        <p className="text-small font-semibold tabular text-ink">
                          {formatRupiah(item.nominal)}
                        </p>
                        <p className="text-small text-muted">
                          Jatuh tempo {formatTanggal(item.tanggal_jatuh_tempo)}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="px-5 py-8 text-center">
              <CheckCircle2 className="mx-auto h-6 w-6 text-success" aria-hidden="true" />
              <p className="mt-2 text-small font-semibold text-ink">Tidak ada tagihan tertunggak</p>
              <p className="mt-1 text-small text-muted">Semua tagihan pada periode aktif sudah lunas.</p>
            </div>
          )}
        </section>

        <section className="min-w-0 rounded-card border border-line bg-white" aria-labelledby="keluhan-aktif">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 id="keluhan-aktif" className="text-h2 text-ink">
                Keluhan belum selesai
              </h2>
              <p className="mt-0.5 text-small text-muted">Laporan terbaru berstatus menunggu atau diproses.</p>
            </div>
            <Link
              to="/admin/keluhan"
              className="inline-flex min-h-[44px] items-center text-small font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-900"
            >
              Semua keluhan
            </Link>
          </div>
          {keluhanAktif.length > 0 ? (
            <ul className="divide-y divide-line">
              {keluhanAktif.map((item) => {
                return (
                  <li key={item.id}>
                    <Link
                      to={`/admin/keluhan/${item.id}`}
                      className="flex min-h-[64px] items-center gap-3 px-5 py-3 transition-colors hover:bg-ivory"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-brand-50 text-brand-700">
                        <MessageSquareWarning className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-small font-semibold text-ink">
                          {item.judul}
                        </span>
                        <span className="mt-0.5 block truncate text-small text-muted">
                          {item.penghuni?.user?.nama || 'Penghuni'} · Kamar {item.kamar?.nomor_kamar || '-'}
                        </span>
                      </span>
                      <StatusBadge status={item.status} />
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="px-5 py-8 text-center">
              <CheckCircle2 className="mx-auto h-6 w-6 text-success" aria-hidden="true" />
              <p className="mt-2 text-small font-semibold text-ink">Tidak ada keluhan aktif</p>
              <p className="mt-1 text-small text-muted">Semua keluhan sudah ditindaklanjuti.</p>
            </div>
          )}
        </section>
      </div>

    </>
  )
}
