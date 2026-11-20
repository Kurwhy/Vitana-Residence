import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ImageOff, MessageSquareWarning, Save } from 'lucide-react'
import {
  Button,
  EmptyState,
  ErrorState,
  Field,
  LoadingState,
  PageHeader,
  Select,
  StatusBadge,
  Textarea,
  buttonStyles,
} from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { useAdminKeluhanDetail } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ApiError } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import { KATEGORI_KELUHAN } from '../../lib/status'
import { formatTanggalWaktu } from '../../lib/utils'

export default function KeluhanDetailPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { push } = useToast()
  const { data: detailData, isLoading, isError, refetch } = useAdminKeluhanDetail(id)
  const data = detailData?.data
  const updateMutation = useMutation({
    mutationFn: (payload) => endpoints.admin.keluhan.update(id, payload),
  })

  const [status, setStatus] = useState(data?.status || 'menunggu')
  const [tanggapan, setTanggapan] = useState(data?.tanggapan_admin || '')
  const [error, setError] = useState('')

  useEffect(() => {
    setStatus(data?.status || 'menunggu')
    setTanggapan(data?.tanggapan_admin || '')
  }, [data?.id])

  usePageMeta({
    title: 'Detail Keluhan',
    description: 'Tindak lanjut keluhan fasilitas penghuni.',
    noindex: true,
  })

  if (isLoading) {
    return (
      <>
        <PageHeader eyebrow="Layanan penghuni" title="Detail Keluhan" />
        <div className="mt-5">
          <LoadingState label="Memuat detail keluhan" />
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <h1 className="sr-only">Keluhan tidak ditemukan</h1>
        <ErrorState onRetry={refetch} />
      </>
    )
  }

  if (!data) {
    return (
      <>
        <h1 className="sr-only">Keluhan tidak ditemukan</h1>
        <EmptyState
          icon={MessageSquareWarning}
          title="Keluhan tidak ditemukan"
          description="Data keluhan yang Anda buka tidak tersedia. Kembali ke daftar keluhan untuk memilih laporan lain."
          action={
            <Link to="/admin/keluhan" className={buttonStyles({ variant: 'primary' })}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Kembali ke daftar keluhan
            </Link>
          }
        />
      </>
    )
  }

  const tenantUser = data.penghuni?.user
  const room = data.kamar

  const handleSave = async (event) => {
    event.preventDefault()
    setError('')
    if (status === 'selesai' && tanggapan.trim().length < 10) {
      setError('Tanggapan minimal 10 karakter saat status diubah menjadi selesai.')
      document.getElementById('tanggapan_admin')?.focus()
      return
    }
    try {
      const response = await updateMutation.mutateAsync({
        status,
        tanggapan_admin: tanggapan,
      })
      push(response.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    } catch (error) {
      setError(error instanceof ApiError ? error.message : 'Keluhan gagal diperbarui.')
    }
  }

  return (
    <>
      <PageHeader eyebrow="Layanan penghuni" title="Detail Keluhan" description={`Kode keluhan ${data.kode_keluhan}`}>
        <StatusBadge status={data.status} />
        <Link to="/admin/keluhan" className={buttonStyles({ variant: 'secondary' })}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali
        </Link>
      </PageHeader>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <section className="rounded-card border border-line bg-white p-5">
            <h2 className="text-h2 text-ink">Rincian laporan</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-small font-medium text-muted">Penghuni</dt>
                <dd className="mt-1 text-small font-semibold text-ink">
                  {tenantUser?.nama || 'Penghuni'}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Kamar</dt>
                <dd className="mt-1 text-small font-semibold tabular text-ink">
                  {room?.nomor_kamar || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Kategori</dt>
                <dd className="mt-1 text-small font-semibold text-ink">
                  {KATEGORI_KELUHAN[data.kategori]}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Tanggal laporan</dt>
                <dd className="mt-1 text-small font-semibold text-ink">
                  {formatTanggalWaktu(data.created_at)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-small font-medium text-muted">Judul keluhan</dt>
                <dd className="mt-1 text-small font-semibold text-ink">{data.judul}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-small font-medium text-muted">Deskripsi</dt>
                <dd className="mt-1 max-w-prose whitespace-pre-line text-small leading-relaxed text-ink">
                  {data.deskripsi}
                </dd>
              </div>
              {data.diselesaikan_pada ? (
                <div className="sm:col-span-2">
                  <dt className="text-small font-medium text-muted">Diselesaikan pada</dt>
                  <dd className="mt-1 text-small font-semibold text-ink">
                    {formatTanggalWaktu(data.diselesaikan_pada)}
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="rounded-card border border-line bg-white p-5">
            <h2 className="text-h2 text-ink">Foto bukti</h2>
            {data.foto_bukti_url ? (
              <div className="mt-4 overflow-hidden rounded-card border border-line">
                <img
                  src={data.foto_bukti_url}
                  alt={`Foto bukti keluhan ${data.judul}`}
                  width="1200"
                  height="800"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-3 rounded-btn border border-dashed border-line-strong bg-ivory px-4 py-5">
                <ImageOff className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
                <p className="text-small text-muted">
                  Penyewa tidak melampirkan foto bukti pada laporan ini.
                </p>
              </div>
            )}
          </section>
        </div>

        <div>
          <form
            className="rounded-card border border-line bg-white p-5 xl:sticky xl:top-24"
            onSubmit={handleSave}
            noValidate
          >
            <h2 className="text-h2 text-ink">Tindak lanjut</h2>
            <p className="mt-1 text-small leading-relaxed text-muted">
              Perbarui status penanganan dan tuliskan tanggapan untuk penyewa.
            </p>

            {error ? (
              <p
                role="alert"
                className="mt-3 rounded-btn border border-red-200 bg-red-50 px-3 py-2 text-small font-medium text-danger"
              >
                {error}
              </p>
            ) : null}

            <div className="mt-4 space-y-4">
              <Field label="Status keluhan" htmlFor="status" required>
                <Select
                  id="status"
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value)
                    setError('')
                  }}
                >
                  <option value="menunggu">Menunggu</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                </Select>
              </Field>

              <Field
                label="Tanggapan Admin"
                htmlFor="tanggapan_admin"
                hint="Minimal 10 karakter saat status diubah menjadi selesai agar ringkasan dapat dikirim ke penyewa."
              >
                <Textarea
                  id="tanggapan_admin"
                  value={tanggapan}
                  onChange={(event) => {
                    setTanggapan(event.target.value)
                    setError('')
                  }}
                  placeholder="Contoh: Teknisi sudah memeriksa water heater dan mengganti komponen yang bermasalah."
                />
              </Field>

              {status === 'selesai' ? (
                <p className="rounded-btn bg-brand-50 px-3 py-2 text-small leading-relaxed text-brand-800">
                  Saat disimpan, keluhan akan ditandai selesai dan ringkasan tanggapan dikirim ke
                  WhatsApp serta email penyewa.
                </p>
              ) : null}

              <Button type="submit" className="w-full" loading={updateMutation.isPending}>
                <Save className="h-4 w-4" aria-hidden="true" />
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
