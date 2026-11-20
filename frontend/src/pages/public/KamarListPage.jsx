import { useMemo, useState } from 'react'
import { BedDouble } from 'lucide-react'
import { RoomCard } from '../../components/RoomCard'
import { Button, EmptyState, ErrorState, FilterTabs, SectionLabel, Skeleton } from '../../components/ui'
import { usePublicKamar } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { KAMAR_STATUS_FILTER } from '../../lib/status'

export default function KamarListPage() {
  const { data, isLoading, isError, refetch } = usePublicKamar()
  const [status, setStatus] = useState('semua')
  const kamar = data?.data || []

  usePageMeta({
    title: 'Katalog Kamar',
    description:
      'Lihat daftar kamar Vitana Residence beserta foto, tipe, lantai, fasilitas, harga bulanan, dan status ketersediaan terbaru.',
  })

  const jumlahTersedia = kamar.filter((item) => item.status === 'tersedia').length

  const daftar = useMemo(() => {
    if (status === 'semua') return kamar
    return kamar.filter((item) => item.status === status)
  }, [kamar, status])

  if (isError) {
    return (
      <section className="container-page py-10 sm:py-14">
        <ErrorState
          title="Katalog kamar belum dapat dimuat"
          description="Data kamar tidak dapat diambil dari server. Periksa koneksi lalu coba lagi."
          onRetry={refetch}
        />
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="container-page py-10 sm:py-14">
        <SectionLabel>Katalog kamar</SectionLabel>
        <h1 className="mt-4 max-w-[18ch] text-[32px] font-bold leading-[1.1] tracking-tight text-ink sm:text-public-h1">
          Pilih kamar sesuai kebutuhan Anda
        </h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-card border border-line bg-white">
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-7 w-1/3" />
              </div>
            </div>
          ))}
        </div>
        <span className="sr-only" role="status">Memuat katalog kamar</span>
      </section>
    )
  }

  return (
    <section className="container-page py-10 sm:py-14">
      <div className="border-b border-line pb-8">
        <SectionLabel>Katalog kamar</SectionLabel>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="max-w-[18ch] text-[32px] font-bold leading-[1.1] tracking-tight text-ink sm:text-public-h1">
              Pilih kamar sesuai kebutuhan Anda
            </h1>
            <p className="mt-4 max-w-prose text-body leading-relaxed text-muted">
              Seluruh kamar ditampilkan beserta status ketersediaan terbaru. Kamar yang sudah
              terisi atau sedang dirawat tetap dapat dilihat untuk memberikan gambaran unit yang
              tersedia.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-card border border-line bg-brand-50/60 px-5 py-4">
            <p className="text-[32px] font-bold leading-none tabular text-brand-900">
              {jumlahTersedia}
            </p>
            <div>
              <p className="text-small font-semibold text-ink">Kamar tersedia</p>
              <p className="text-small text-muted">dari {kamar.length} kamar</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs
          options={KAMAR_STATUS_FILTER}
          value={status}
          onChange={setStatus}
          label="Filter status kamar"
        />
        <p className="text-small text-muted">
          <span className="font-semibold tabular text-ink">{daftar.length}</span> kamar ditampilkan
        </p>
      </div>

      {daftar.length > 0 ? (
        <section className="mt-6" aria-labelledby="daftar-kamar">
          <h2 id="daftar-kamar" className="sr-only">
            Daftar kamar
          </h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {daftar.map((item) => (
              <RoomCard key={item.id} kamar={item} />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          className="mt-6"
          icon={BedDouble}
          title="Tidak ada kamar pada filter ini"
          description="Belum ada kamar dengan status tersebut. Tampilkan semua kamar untuk melihat pilihan lain."
          action={
            <Button variant="secondary" onClick={() => setStatus('semua')}>
              Tampilkan semua kamar
            </Button>
          }
        />
      )}
    </section>
  )
}
