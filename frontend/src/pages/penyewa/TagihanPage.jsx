import { CalendarDays, CreditCard, ReceiptText } from 'lucide-react'
import { PaymentModal } from '../../components/PaymentModal'
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  StatusBadge,
} from '../../components/ui'
import { usePenyewaProfile, usePenyewaTagihan } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { usePaymentFlow } from '../../hooks/usePaymentFlow'
import { METODE_PEMBAYARAN } from '../../lib/status'
import { formatPeriode, formatRupiah, formatTanggal, formatTanggalWaktu } from '../../lib/utils'

export default function TagihanPage() {
  const profileQuery = usePenyewaProfile()
  const billsQuery = usePenyewaTagihan()
  const {
    startPayment,
    startingId,
    mockOpen,
    mockBill,
    closeMockPayment,
    confirmMockPayment,
    processingMock,
  } = usePaymentFlow()

  usePageMeta({
    title: 'Tagihan dan Riwayat Pembayaran',
    description: 'Daftar tagihan bulanan dan riwayat pembayaran penyewa.',
    noindex: true,
  })

  if (profileQuery.isLoading || billsQuery.isLoading) {
    return (
      <>
        <PageHeader eyebrow="Pembayaran" title="Tagihan dan Riwayat Pembayaran" />
        <div className="mt-5">
          <LoadingState label="Memuat tagihan" />
        </div>
      </>
    )
  }

  if (profileQuery.isError || billsQuery.isError) {
    return (
      <>
        <PageHeader eyebrow="Pembayaran" title="Tagihan dan Riwayat Pembayaran" />
        <div className="mt-5">
          <ErrorState
            onRetry={() => {
              profileQuery.refetch()
              billsQuery.refetch()
            }}
          />
        </div>
      </>
    )
  }

  const current = profileQuery.data?.data?.penghuni
  const bills = billsQuery.data?.data || []

  if (!current) {
    return (
      <>
        <h1 className="sr-only">Data penghuni tidak ditemukan</h1>
        <EmptyState
          icon={ReceiptText}
          title="Data penghuni tidak ditemukan"
          description="Akun Anda belum terhubung dengan data penghuni aktif. Hubungi Admin Vitana Residence."
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Pembayaran"
        title="Tagihan dan Riwayat Pembayaran"
        description="Bayar tagihan bulanan melalui Midtrans Snap dan lihat rincian pembayaran yang sudah lunas."
      />

      <p className="mt-4 flex items-start gap-2 rounded-card border border-brand-100 bg-brand-50 px-4 py-3 text-small leading-relaxed text-brand-800">
        <CreditCard className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Pembayaran dapat dilakukan melalui QRIS, Virtual Account Bank, atau E-Wallet. Status tagihan
        berubah menjadi lunas setelah pembayaran berhasil diproses.
      </p>

      {bills.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {bills.map((item) => {
            const lunas = item.status === 'lunas'
            return (
              <li key={item.id} className="rounded-card border border-line bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-small font-medium text-muted">Kode tagihan</p>
                    <p className="mt-1 text-small font-bold tabular text-ink">{item.kode_tagihan}</p>
                    <p className="mt-1 text-small text-muted">
                      Periode {formatPeriode(item.periode_bulan)}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4">
                  <div>
                    <p className="text-small font-medium text-muted">Nominal tagihan</p>
                    <p className="mt-1 text-[24px] font-bold leading-none tabular text-ink">
                      {formatRupiah(item.nominal)}
                    </p>
                  </div>
                  <p className="flex items-center gap-2 text-small text-muted">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    Jatuh tempo {formatTanggal(item.tanggal_jatuh_tempo)}
                  </p>
                </div>

                {lunas ? (
                  <div className="mt-4 rounded-btn border border-green-200 bg-green-50 px-3 py-2.5">
                    <p className="text-small font-semibold text-green-800">Pembayaran lunas</p>
                    <p className="mt-1 text-small leading-relaxed text-green-800">
                      Dibayar {formatTanggalWaktu(item.dibayar_pada)} melalui{' '}
                      {METODE_PEMBAYARAN[item.metode_pembayaran] || item.metode_pembayaran || 'Midtrans'}.
                    </p>
                    {item.midtrans_order_id ? (
                      <p className="mt-1 break-all text-small tabular text-green-800">
                        Order ID {item.midtrans_order_id}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-small text-muted">
                      {item.status === 'terlambat'
                        ? 'Tagihan ini sudah melewati jatuh tempo.'
                        : 'Selesaikan pembayaran sebelum tanggal jatuh tempo.'}
                    </p>
                    <Button onClick={() => startPayment(item)} loading={startingId === item.id}>Bayar Sekarang</Button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <EmptyState
          className="mt-5"
          icon={ReceiptText}
          title="Belum ada tagihan"
          description="Tagihan bulan pertama akan diterbitkan setelah pengajuan sewa disetujui oleh Admin."
        />
      )}

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
