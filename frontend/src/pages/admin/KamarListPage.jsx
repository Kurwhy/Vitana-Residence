import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { BedDouble, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  Button,
  EmptyState,
  ErrorState,
  Modal,
  PageHeader,
  Pagination,
  StatusBadge,
  TableSkeleton,
  buttonStyles,
} from '../../components/ui'
import { useAdminKamar } from '../../hooks/api'
import { useToast } from '../../context/ToastContext'
import { usePageMeta } from '../../hooks/usePageMeta'
import { endpoints } from '../../lib/endpoints'
import { formatRupiah } from '../../lib/utils'

const PAGE_SIZE = 15

export default function KamarListPage() {
  const queryClient = useQueryClient()
  const { push } = useToast()
  const [page, setPage] = useState(1)
  const [confirmRoom, setConfirmRoom] = useState(null)
  const [confirmError, setConfirmError] = useState('')
  const { data, isLoading, isError, refetch } = useAdminKamar(page)
  const deleteMutation = useMutation({ mutationFn: endpoints.admin.kamar.remove })

  const kamar = data?.data || []
  const total = data?.total || 0

  usePageMeta({
    title: 'Kelola Kamar',
    description: 'Kelola unit kamar Vitana Residence.',
    noindex: true,
  })

  const handleDelete = async () => {
    if (!confirmRoom) return
    setConfirmError('')
    try {
      await deleteMutation.mutateAsync(confirmRoom.id)
      push(`Kamar ${confirmRoom.nomor_kamar} berhasil dihapus.`, 'success')
      if (kamar.length === 1 && page > 1) setPage(page - 1)
      setConfirmRoom(null)
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['publik', 'kamar'] })
    } catch (error) {
      setConfirmError(error.message)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Inventaris kamar"
        title="Kelola Kamar"
        description="Daftar seluruh unit kamar beserta tipe, lantai, harga bulanan, dan status hunian."
      >
        <Link to="/admin/kamar/baru" className={buttonStyles({ variant: 'primary' })}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah Kamar
        </Link>
      </PageHeader>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-small text-muted">
          <span className="font-semibold tabular text-ink">{total}</span> unit kamar terdaftar
        </p>
      </div>

      <div className="mt-3">
        {isLoading ? (
          <TableSkeleton columns={7} rows={6} />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : kamar.length > 0 ? (
          <div className="table-shell">
            <table className="table-base">
              <thead className="table-head">
                <tr>
                  <th className="th-cell" scope="col">Nomor</th>
                  <th className="th-cell" scope="col">Tipe</th>
                  <th className="th-cell" scope="col">Lantai</th>
                  <th className="th-cell" scope="col">Luas</th>
                  <th className="th-cell" scope="col">Harga bulanan</th>
                  <th className="th-cell" scope="col">Status</th>
                  <th className="th-cell text-right" scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kamar.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="td-cell font-semibold tabular">{item.nomor_kamar}</td>
                    <td className="td-cell">{item.nama_tipe}</td>
                    <td className="td-cell tabular">{item.lantai}</td>
                    <td className="td-cell whitespace-nowrap">{item.luas_kamar}</td>
                    <td className="td-cell font-semibold tabular">
                      {formatRupiah(item.harga_bulanan)}
                    </td>
                    <td className="td-cell">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="td-cell">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/kamar/${item.id}/edit`}
                          className={buttonStyles({ variant: 'secondary', size: 'sm' })}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          Ubah
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-danger hover:bg-red-50"
                          onClick={() => {
                            setConfirmRoom(item)
                            setConfirmError('')
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Hapus
                        </Button>
                      </div>
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
            icon={BedDouble}
            title="Belum ada kamar terdaftar"
            description="Tambahkan unit kamar pertama agar dapat tampil pada katalog publik."
            action={
              <Link to="/admin/kamar/baru" className={buttonStyles({ variant: 'primary' })}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Tambah Kamar
              </Link>
            }
          />
        )}
      </div>

      <Modal
        open={Boolean(confirmRoom)}
        onClose={() => {
          setConfirmRoom(null)
          setConfirmError('')
        }}
        title="Hapus kamar"
        description={
          confirmRoom
            ? `Kamar ${confirmRoom.nomor_kamar} akan dihapus dari daftar unit. Tindakan ini tidak dapat dibatalkan.`
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmRoom(null)
                setConfirmError('')
              }}
            >
              Batal
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteMutation.isPending}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Hapus Kamar
            </Button>
          </>
        }
      >
        {confirmError ? (
          <p
            role="alert"
            className="rounded-btn border border-red-200 bg-red-50 px-3 py-2 text-small font-medium text-danger"
          >
            {confirmError}
          </p>
        ) : (
          <p className="text-small leading-relaxed text-muted">
            Kamar yang memiliki riwayat penghuni atau tagihan tidak dapat dihapus. Untuk kamar yang
            sedang ditempati, proses checkout perlu diselesaikan terlebih dahulu.
          </p>
        )}
      </Modal>
    </>
  )
}
