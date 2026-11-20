import { Link } from 'react-router-dom'
import { ArrowLeft, SearchX } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { buttonStyles } from '../components/ui'

export default function NotFoundPage() {
  usePageMeta({
    title: 'Halaman tidak ditemukan',
    description: 'Halaman yang Anda cari tidak tersedia di Vitana Residence.',
    noindex: true,
  })

  return (
    <section className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <SearchX className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-5 text-small font-semibold text-brand-700">Halaman tidak ditemukan</p>
        <h1 className="mt-2 text-[32px] font-bold leading-tight tracking-tight text-ink sm:text-public-h1">
          Alamat yang Anda buka tidak tersedia
        </h1>
        <p className="mx-auto mt-4 max-w-prose text-body leading-relaxed text-muted">
          Periksa kembali tautan yang Anda gunakan, atau kembali ke beranda untuk melihat katalog
          kamar dan informasi Vitana Residence.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          <Link to="/" className={buttonStyles({ variant: 'primary' })}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali ke beranda
          </Link>
          <Link to="/kamar" className={buttonStyles({ variant: 'secondary' })}>
            Lihat katalog kamar
          </Link>
        </div>
      </div>
    </section>
  )
}
