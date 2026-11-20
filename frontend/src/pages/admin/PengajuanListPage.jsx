import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileCheck2 } from 'lucide-react'
import {
  Button,
  EmptyState,
  ErrorState,
  FilterTabs,
  PageHeader,
  Pagination,
  StatusBadge,
  TableSkeleton,
  buttonStyles,
} from '../../components/ui'
import { useAdminDashboard, useAdminPengajuan } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { STATUS_PENGAJUAN_FILTER } from '../../lib/status'
import { formatTanggal } from '../../lib/utils'

const PAGE_SIZE = 15

export default function PengajuanListPage() {
  const [status, setStatus] = useState('semua')
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useAdminPengajuan(page, status)
  const { data: dashboardData } = useAdminDashboard()
  const menunggu = dashboardData?.data?.pengajuan_menunggu || 0

  usePageMeta({
    title: 'Daftar Pengajuan Sewa',
    description: 'Verifikasi pengajuan sewa calon penghuni.',
    noindex: true,
  })

  const daftar = data?.data || []
  const total = data?.total || 0

  const changeFilter = (value) => {
    setStatus(value)
    setPage(1)
  }

  return (
    <>
      <PageHeader
        eyebrow="Verifikasi penyewa"
        title="Pengajuan Sewa"
        description="Tinjau data calon penyewa, dokumen identitas, dan status verifikasi setiap pengajuan."
      />

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          options={STATUS_PENGAJUAN_FILTER}
          value={status}
          onChange={changeFilter}
          label="Filter status pengajuan"
        />
        <p className="text-small text-muted">
          <span className="font-semibold tabular text-ink">{menunggu}</span> pengajuan menunggu
          verifikasi
        </p>
      </div>

      <div className="mt-3">
        {isLoading ? (
          <TableSkeleton columns={7} rows={6} />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : daftar.length > 0 ? (
          <div className="table-shell">
            <table className="table-base min-w-[920px]">
              <thead className="table-head">
                <tr>
                  <th className="th-cell" scope="col">Kode</th>
                  <th className="th-cell" scope="col">Calon penyewa</th>
                  <th className="th-cell" scope="col">Kamar</th>
                  <th className="th-cell" scope="col">Tanggal masuk</th>
                  <th className="th-cell" scope="col">Diajukan</th>
                  <th className="th-cell" scope="col">Status</th>
                  <th className="th-cell text-right" scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftar.map((item) => {
                  return (
                    <tr key={item.id} className="table-row">
                      <td className="td-cell whitespace-nowrap font-semibold tabular">
                        {item.kode_pengajuan}
                      </td>
                      <td className="td-cell">
                        <p className="font-semibold text-ink">{item.nama_lengkap}</p>
                        <p className="mt-0.5 text-small text-muted">{item.nama_instansi}</p>
                      </td>
                      <td className="td-cell tabular">{item.kamar?.nomor_kamar || '-'}</td>
                      <td className="td-cell whitespace-nowrap">
                        {formatTanggal(item.tanggal_mulai_masuk)}
                      </td>
                      <td className="td-cell whitespace-nowrap">
                        {formatTanggal(item.created_at, { short: true })}
                      </td>
                      <td className="td-cell">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="td-cell text-right">
                        <Link
                          to={`/admin/pengajuan/${item.id}`}
                          className={buttonStyles({ variant: 'secondary', size: 'sm' })}
                        >
                          Lihat detail
                        </Link>
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
            icon={FileCheck2}
            title="Tidak ada pengajuan pada filter ini"
            description="Belum ada pengajuan dengan status tersebut. Tampilkan semua pengajuan untuk melihat riwayat lengkap."
            action={
              <Button variant="secondary" onClick={() => changeFilter('semua')}>
                Tampilkan semua pengajuan
              </Button>
            }
          />
        )}
      </div>
    </>
  )
}
