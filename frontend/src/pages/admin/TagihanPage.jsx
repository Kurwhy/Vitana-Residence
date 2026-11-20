import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ReceiptText, Send } from 'lucide-react'
import {
  Button,
  EmptyState,
  ErrorState,
  FilterTabs,
  PageHeader,
  Pagination,
  StatusBadge,
  TableSkeleton,
} from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { useAdminTagihan } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { METODE_PEMBAYARAN, STATUS_TAGIHAN_FILTER } from '../../lib/status'
import { ApiError } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import { formatPeriode, formatRupiah, formatTanggal } from '../../lib/utils'

const PAGE_SIZE = 15

export default function TagihanPage() {
  const { push } = useToast()
  const [status, setStatus] = useState('semua')
  const [page, setPage] = useState(1)
  const [sendingId, setSendingId] = useState(null)
  const { data, isLoading, isError, refetch } = useAdminTagihan(page, status)
  const reminderMutation = useMutation({
    mutationFn: (id) => endpoints.admin.tagihan.remind(id),
  })

  const daftar = data?.data || []
  const total = data?.total || 0

  usePageMeta({
    title: 'Kelola Tagihan',
    description: 'Pantau tagihan bulanan dan transaksi Midtrans penghuni.',
    noindex: true,
  })

  const changeFilter = (value) => {
    setStatus(value)
    setPage(1)
  }

  const handleReminder = async (item) => {
    setSendingId(item.id)
    try {
      const response = await reminderMutation.mutateAsync(item.id)
      push(response.message, 'success')
    } catch (error) {
      push(error instanceof ApiError ? error.message : 'Pengingat gagal dikirim.', 'error')
    } finally {
      setSendingId(null)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Keuangan"
        title="Kelola Tagihan"
        description="Pantau tagihan bulanan, status pembayaran Midtrans, dan kirim pengingat jatuh tempo."
      />

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          options={STATUS_TAGIHAN_FILTER}
          value={status}
          onChange={changeFilter}
          label="Filter status tagihan"
        />
        <p className="text-small text-muted">
          <span className="font-semibold tabular text-ink">{total}</span> tagihan ditampilkan
        </p>
      </div>

      <div className="mt-3">
        {isLoading ? (
          <TableSkeleton columns={9} rows={6} />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : daftar.length > 0 ? (
          <div className="table-shell">
            <table className="table-base min-w-[1180px]">
              <thead className="table-head">
                <tr>
                  <th className="th-cell" scope="col">Kode tagihan</th>
                  <th className="th-cell" scope="col">Penghuni</th>
                  <th className="th-cell" scope="col">Kamar</th>
                  <th className="th-cell" scope="col">Periode</th>
                  <th className="th-cell" scope="col">Nominal</th>
                  <th className="th-cell" scope="col">Jatuh tempo</th>
                  <th className="th-cell" scope="col">Status</th>
                  <th className="th-cell" scope="col">Transaksi Midtrans</th>
                  <th className="th-cell text-right" scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftar.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="td-cell whitespace-nowrap font-semibold tabular">
                      {item.kode_tagihan}
                    </td>
                    <td className="td-cell whitespace-nowrap">{item.penghuni?.user?.nama || 'Penghuni'}</td>
                    <td className="td-cell tabular">{item.kamar?.nomor_kamar || '-'}</td>
                    <td className="td-cell whitespace-nowrap">{formatPeriode(item.periode_bulan)}</td>
                    <td className="td-cell whitespace-nowrap font-semibold tabular">
                      {formatRupiah(item.nominal)}
                    </td>
                    <td className="td-cell whitespace-nowrap">{formatTanggal(item.tanggal_jatuh_tempo)}</td>
                    <td className="td-cell">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="td-cell">
                      {item.metode_pembayaran ? (
                        <>
                          <p className="text-small font-medium text-ink">
                            {METODE_PEMBAYARAN[item.metode_pembayaran] || item.metode_pembayaran}
                          </p>
                          {item.midtrans_order_id ? (
                            <p className="mt-0.5 max-w-[190px] truncate text-small tabular text-muted">
                              {item.midtrans_order_id}
                            </p>
                          ) : null}
                        </>
                      ) : item.midtrans_order_id ? (
                        <>
                          <p className="text-small font-medium text-ink">Menunggu pembayaran</p>
                          <p className="mt-0.5 max-w-[190px] truncate text-small tabular text-muted">
                            {item.midtrans_order_id}
                          </p>
                        </>
                      ) : (
                        <span className="text-small text-muted">Belum ada transaksi</span>
                      )}
                    </td>
                    <td className="td-cell text-right">
                      {item.status !== 'lunas' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleReminder(item)}
                          loading={sendingId === item.id}
                          disabled={sendingId !== null && sendingId !== item.id}
                        >
                          <Send className="h-4 w-4" aria-hidden="true" />
                          Kirim Pengingat
                        </Button>
                      ) : (
                        <span className="text-small text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={page}
              totalItems={total}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        ) : (
          <EmptyState
            icon={ReceiptText}
            title="Tidak ada tagihan pada filter ini"
            description="Belum ada tagihan dengan status tersebut. Tampilkan semua tagihan untuk melihat riwayat lengkap."
            action={
              <Button variant="secondary" onClick={() => changeFilter('semua')}>
                Tampilkan semua tagihan
              </Button>
            }
          />
        )}
      </div>
    </>
  )
}
