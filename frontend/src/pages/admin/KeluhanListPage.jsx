import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquareWarning } from 'lucide-react'
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
import { useAdminKeluhan } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { KATEGORI_KELUHAN, STATUS_KELUHAN_FILTER } from '../../lib/status'
import { formatTanggal } from '../../lib/utils'

const PAGE_SIZE = 15

export default function KeluhanListPage() {
  const [status, setStatus] = useState('semua')
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useAdminKeluhan(page, status)

  const daftar = data?.data || []
  const total = data?.total || 0

  usePageMeta({
    title: 'Kelola Keluhan',
    description: 'Tindak lanjuti keluhan fasilitas penghuni.',
    noindex: true,
  })

  const perubahanFilter = (value) => {
    setStatus(value)
    setPage(1)
  }

  return (
    <>
      <PageHeader
        eyebrow="Layanan penghuni"
        title="Kelola Keluhan"
        description="Pantau laporan fasilitas kamar dan perbarui status penanganannya."
      />

      <div className="mt-5">
        <FilterTabs
          options={STATUS_KELUHAN_FILTER}
          value={status}
          onChange={perubahanFilter}
          label="Filter status keluhan"
        />
      </div>

      <div className="mt-3">
        {isLoading ? (
          <TableSkeleton columns={8} rows={6} />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : daftar.length > 0 ? (
          <div className="table-shell">
            <table className="table-base min-w-[1050px]">
              <thead className="table-head">
                <tr>
                  <th className="th-cell" scope="col">Kode</th>
                  <th className="th-cell" scope="col">Penghuni</th>
                  <th className="th-cell" scope="col">Kamar</th>
                  <th className="th-cell" scope="col">Kategori</th>
                  <th className="th-cell" scope="col">Judul keluhan</th>
                  <th className="th-cell" scope="col">Tanggal</th>
                  <th className="th-cell" scope="col">Status</th>
                  <th className="th-cell text-right" scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftar.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="td-cell whitespace-nowrap font-semibold tabular">
                      {item.kode_keluhan}
                    </td>
                    <td className="td-cell whitespace-nowrap">{item.penghuni?.user?.nama || 'Penghuni'}</td>
                    <td className="td-cell tabular">{item.kamar?.nomor_kamar || '-'}</td>
                    <td className="td-cell whitespace-nowrap">{KATEGORI_KELUHAN[item.kategori]}</td>
                    <td className="td-cell">
                      <p className="max-w-[280px] truncate font-medium text-ink">{item.judul}</p>
                    </td>
                    <td className="td-cell whitespace-nowrap">
                      {formatTanggal(item.created_at, { short: true })}
                    </td>
                    <td className="td-cell">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="td-cell text-right">
                      <Link
                        to={`/admin/keluhan/${item.id}`}
                        className={buttonStyles({ variant: 'secondary', size: 'sm' })}
                      >
                        Tindak Lanjut
                      </Link>
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
            icon={MessageSquareWarning}
            title="Tidak ada keluhan pada filter ini"
            description="Belum ada laporan dengan status tersebut. Tampilkan semua keluhan untuk melihat riwayat lengkap."
            action={
              <Button variant="secondary" onClick={() => perubahanFilter('semua')}>
                Tampilkan semua keluhan
              </Button>
            }
          />
        )}
      </div>
    </>
  )
}
