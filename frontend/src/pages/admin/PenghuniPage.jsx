import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, DoorOpen, Users } from 'lucide-react'
import {
  Button,
  EmptyState,
  ErrorState,
  FilterTabs,
  Modal,
  PageHeader,
  Pagination,
  StatusBadge,
  TableSkeleton,
} from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { useAdminPenghuni } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ApiError } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import { JENIS_PENGHUNI } from '../../lib/status'
import { formatPeriode, formatRupiah, formatTanggal } from '../../lib/utils'

const PAGE_SIZE = 15
const filters = [
  { value: 'aktif', label: 'Aktif' },
  { value: 'selesai', label: 'Selesai' },
]

export default function PenghuniPage() {
  const queryClient = useQueryClient()
  const { push } = useToast()
  const [status, setStatus] = useState('aktif')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [checkoutError, setCheckoutError] = useState('')
  const [unpaidBills, setUnpaidBills] = useState([])
  const { data, isLoading, isError, refetch } = useAdminPenghuni(page, status)
  const checkoutMutation = useMutation({ mutationFn: () => endpoints.admin.penghuni.checkout(selected.id) })

  const daftar = data?.data || []
  const total = data?.total || 0

  usePageMeta({
    title: 'Daftar Penghuni',
    description: 'Kelola penghuni aktif dan riwayat penghuni Vitana Residence.',
    noindex: true,
  })

  const changeFilter = (value) => {
    setStatus(value)
    setPage(1)
  }

  const openCheckout = (item) => {
    setSelected(item)
    setCheckoutError('')
    setUnpaidBills([])
  }

  const handleCheckout = async () => {
    if (!selected) return
    setCheckoutError('')
    setUnpaidBills([])
    try {
      const response = await checkoutMutation.mutateAsync()
      push(response.message, 'success')
      setSelected(null)
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['publik'] })
    } catch (error) {
      if (error instanceof ApiError) {
        const tunggakan = error.payload?.tunggakan || []
        setUnpaidBills(tunggakan)
        setCheckoutError(tunggakan.length > 0 ? '' : error.message)
      } else {
        setCheckoutError('Penghuni gagal diproses keluar.')
      }
    }
  }

  const selectedUser = selected?.user || null
  const selectedRoom = selected?.kamar || null

  return (
    <>
      <PageHeader
        eyebrow="Data hunian"
        title="Daftar Penghuni"
        description="Pantau penghuni aktif, siklus tagihan bulanan, dan proses keluar dari kamar."
      />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs
          options={filters}
          value={status}
          onChange={changeFilter}
          label="Filter status penghuni"
        />
        <p className="text-small text-muted">
          <span className="font-semibold tabular text-ink">{total}</span> penghuni{' '}
          {status === 'aktif' ? 'aktif' : 'dengan status selesai'}
        </p>
      </div>

      <div className="mt-3">
        {isLoading ? (
          <TableSkeleton columns={8} rows={6} />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : daftar.length > 0 ? (
          <div className="table-shell">
            <table className="table-base min-w-[1000px]">
              <thead className="table-head">
                <tr>
                  <th className="th-cell" scope="col">Penghuni</th>
                  <th className="th-cell" scope="col">Kamar</th>
                  <th className="th-cell" scope="col">Status</th>
                  <th className="th-cell" scope="col">Instansi</th>
                  <th className="th-cell" scope="col">Tanggal masuk</th>
                  <th className="th-cell" scope="col">Siklus tagihan</th>
                  <th className="th-cell" scope="col">Status hunian</th>
                  <th className="th-cell text-right" scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftar.map((item) => {
                  const user = item.user
                  const room = item.kamar
                  return (
                    <tr key={item.id} className="table-row">
                      <td className="td-cell">
                        <p className="font-semibold text-ink">{user?.nama || '-'}</p>
                        <p className="mt-0.5 text-small text-muted">{user?.email || '-'}</p>
                      </td>
                      <td className="td-cell tabular">{room?.nomor_kamar || '-'}</td>
                      <td className="td-cell">{JENIS_PENGHUNI[item.status_penghuni]}</td>
                      <td className="td-cell">{item.nama_instansi}</td>
                      <td className="td-cell whitespace-nowrap">{formatTanggal(item.tanggal_masuk)}</td>
                      <td className="td-cell whitespace-nowrap tabular">
                        Tanggal {item.tanggal_siklus_bulanan}
                      </td>
                      <td className="td-cell">
                        <StatusBadge status={item.status} />
                        {item.tanggal_keluar ? (
                          <p className="mt-0.5 text-small text-muted">
                            Keluar {formatTanggal(item.tanggal_keluar)}
                          </p>
                        ) : null}
                      </td>
                      <td className="td-cell text-right">
                        {item.status === 'aktif' ? (
                          <Button variant="secondary" size="sm" onClick={() => openCheckout(item)}>
                            <DoorOpen className="h-4 w-4" aria-hidden="true" />
                            Proses Keluar
                          </Button>
                        ) : (
                          <span className="text-small text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
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
            icon={Users}
            title={
              status === 'aktif' ? 'Belum ada penghuni aktif' : 'Belum ada riwayat penghuni selesai'
            }
            description={
              status === 'aktif'
                ? 'Penghuni aktif akan muncul setelah pengajuan sewa disetujui oleh Admin.'
                : 'Penghuni yang telah diproses keluar akan tercatat pada bagian ini.'
            }
          />
        )}
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={() => {
          if (!checkoutMutation.isPending) setSelected(null)
        }}
        title="Proses keluar penghuni"
        description={
          selectedUser
            ? `${selectedUser.nama} akan diproses keluar dari kamar ${selectedRoom?.nomor_kamar || '-'}.`
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setSelected(null)}
              disabled={checkoutMutation.isPending}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={handleCheckout}
              loading={checkoutMutation.isPending}
              disabled={unpaidBills.length > 0}
            >
              Proses Keluar
            </Button>
          </>
        }
      >
        {checkoutError ? (
          <p
            role="alert"
            className="mb-3 rounded-btn border border-red-200 bg-red-50 px-3 py-2 text-small font-medium text-danger"
          >
            {checkoutError}
          </p>
        ) : null}

        {unpaidBills.length > 0 ? (
          <div>
            <p className="text-small font-semibold text-ink">
              Penghuni masih memiliki tagihan yang belum lunas
            </p>
            <p className="mt-1 text-small leading-relaxed text-muted">
              Selesaikan tagihan berikut terlebih dahulu sebelum memproses keluar.
            </p>
            <ul className="mt-3 divide-y divide-line rounded-btn border border-line">
              {unpaidBills.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
                  <div>
                    <p className="text-small font-semibold tabular text-ink">{item.kode_tagihan}</p>
                    <p className="text-small text-muted">
                      {formatPeriode(item.periode_bulan)} · {formatRupiah(item.nominal)}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <p className="text-small leading-relaxed text-muted">
              Seluruh tagihan sudah lunas. Proses keluar akan menjalankan tindakan berikut:
            </p>
            <ul className="mt-3 space-y-2 text-small text-ink">
              {[
                'Mengubah status penghuni menjadi selesai dan mengisi tanggal keluar.',
                'Menonaktifkan akun login penyewa.',
                'Mengembalikan status kamar menjadi tersedia pada katalog publik.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </>
  )
}
