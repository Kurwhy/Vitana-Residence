import { Link } from 'react-router-dom'
import { BedDouble, Images } from 'lucide-react'
import { formatRupiah } from '../lib/utils'
import { StatusBadge } from './ui'

export function RoomPhotoFallback({ label = 'Foto kamar belum diunggah' }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-brand-50 px-4 text-center text-brand-700">
      <BedDouble className="h-7 w-7" aria-hidden="true" />
      <span className="text-small font-medium leading-relaxed">{label}</span>
    </div>
  )
}

export function RoomCard({ kamar }) {
  const photoCount = kamar.galeri_foto_urls?.length || 0

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-colors duration-200 hover:border-brand-300">
      <Link
        to={`/kamar/${kamar.id}`}
        className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
          {kamar.foto_utama_url ? (
            <img
              src={kamar.foto_utama_url}
              alt={`Foto kamar ${kamar.nomor_kamar} tipe ${kamar.nama_tipe}`}
              width="800"
              height="600"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <RoomPhotoFallback />
          )}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            <StatusBadge status={kamar.status} />
            {photoCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-ink/60 px-2 py-1 text-small font-medium text-white">
                <Images className="h-3.5 w-3.5" aria-hidden="true" />
                {photoCount} foto
              </span>
            ) : null}
          </div>
          <span className="absolute bottom-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-small font-semibold tabular text-ink">
            Kamar {kamar.nomor_kamar}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div>
            <h3 className="text-h3 text-ink">{kamar.nama_tipe}</h3>
            <p className="mt-1 text-small text-muted">
              Lantai <span className="tabular">{kamar.lantai}</span> · {kamar.luas_kamar}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {kamar.fasilitas_kamar.slice(0, 2).map((fasilitas) => (
              <span
                key={fasilitas}
                className="rounded-md border border-line bg-ivory px-2 py-0.5 text-small font-medium text-muted"
              >
                {fasilitas}
              </span>
            ))}
            {kamar.fasilitas_kamar.length > 2 ? (
              <span className="rounded-md border border-line bg-ivory px-2 py-0.5 text-small font-medium text-muted">
                +{kamar.fasilitas_kamar.length - 2}
              </span>
            ) : null}
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
            <div>
              <p className="text-small text-muted">Sewa bulanan</p>
              <p className="mt-0.5 text-[24px] font-bold tracking-tight tabular text-ink">
                {formatRupiah(kamar.harga_bulanan)}
              </p>
            </div>
            <span className="pb-1 text-small font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 group-hover:text-brand-900">
              Lihat kamar
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
