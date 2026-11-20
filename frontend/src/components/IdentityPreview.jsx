import { FileImage, LockKeyhole } from 'lucide-react'
import { JENIS_PENGHUNI } from '../lib/status'
import { Skeleton } from './ui'

export function IdentityPreview({ pengajuan, imageUrl, loading, error }) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-ivory px-4 py-3">
        <p className="text-small font-semibold text-ink">Pratinjau dokumen identitas</p>
        <span className="inline-flex items-center gap-1.5 text-small font-medium text-muted">
          <LockKeyhole className="h-4 w-4" aria-hidden="true" />
          Akses khusus Admin
        </span>
      </div>
      <div className="p-4">
        {loading ? (
          <Skeleton className="aspect-[8/5] w-full" />
        ) : imageUrl ? (
          <div className="overflow-hidden rounded-card border border-line bg-ivory">
            <img
              src={imageUrl}
              alt={`Pratinjau dokumen identitas ${pengajuan.nama_lengkap}`}
              width="1000"
              height="620"
              className="aspect-[8/5] w-full object-cover"
            />
          </div>
        ) : (
          <div className="rounded-card border border-line bg-[#FBFCFA] p-4">
            <div className="flex items-start justify-between gap-4 border-b border-line pb-3">
              <div>
                <p className="text-small font-bold uppercase tracking-[0.14em] text-muted">
                  Dokumen identitas
                </p>
                <p className="mt-1 text-small font-bold text-ink">KTP atau KTM</p>
              </div>
              <FileImage className="h-7 w-7 text-brand-600" aria-hidden="true" />
            </div>
            <p className="mt-3 text-small leading-relaxed text-muted">
              {error
                ? 'Foto identitas gagal dimuat. Periksa koneksi lalu coba lagi.'
                : 'File identitas tidak tersedia pada pratinjau ini.'}
            </p>
            <p className="mt-2 break-all text-small text-muted">{pengajuan.foto_identitas}</p>
          </div>
        )}

        <dl className="mt-4 grid gap-x-4 gap-y-2 text-small sm:grid-cols-2">
          <div>
            <dt className="text-small text-muted">Nama</dt>
            <dd className="font-semibold text-ink">{pengajuan.nama_lengkap}</dd>
          </div>
          <div>
            <dt className="text-small text-muted">Status</dt>
            <dd className="font-semibold text-ink">{JENIS_PENGHUNI[pengajuan.status_penghuni]}</dd>
          </div>
          <div>
            <dt className="text-small text-muted">Instansi</dt>
            <dd className="font-semibold text-ink">{pengajuan.nama_instansi}</dd>
          </div>
          <div>
            <dt className="text-small text-muted">File</dt>
            <dd className="break-words font-semibold text-ink">{pengajuan.foto_identitas}</dd>
          </div>
        </dl>
        <p className="mt-3 text-small leading-relaxed text-muted">
          Foto asli disimpan pada penyimpanan privat dan hanya dapat ditampilkan melalui endpoint
          terautentikasi khusus Admin.
        </p>
      </div>
    </div>
  )
}
