import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Check, FileCheck2, XCircle } from 'lucide-react'
import { IdentityPreview } from '../../components/IdentityPreview'
import {
  Button,
  EmptyState,
  ErrorState,
  Field,
  LoadingState,
  Modal,
  PageHeader,
  StatusBadge,
  Textarea,
  buttonStyles,
} from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { qk, useAdminPengajuanDetail } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ApiError } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import { JENIS_PENGHUNI } from '../../lib/status'
import { formatRupiah, formatTanggal, formatTanggalWaktu } from '../../lib/utils'

export default function PengajuanDetailPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { push } = useToast()
  const { data: detailData, isLoading, isError, refetch } = useAdminPengajuanDetail(id)
  const data = detailData?.data
  const room = data?.kamar
  const admin = data?.verifier

  const identityQuery = useQuery({
    queryKey: qk.adminIdentitas(id),
    queryFn: () => endpoints.admin.pengajuan.identitas(id),
    enabled: Boolean(data),
  })
  const [identityUrl, setIdentityUrl] = useState(null)

  useEffect(() => {
    if (!identityQuery.data) return undefined
    const url = URL.createObjectURL(identityQuery.data)
    setIdentityUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [identityQuery.data])

  const approveMutation = useMutation({ mutationFn: () => endpoints.admin.pengajuan.setujui(data.id) })
  const rejectMutation = useMutation({
    mutationFn: (note) => endpoints.admin.pengajuan.tolak(data.id, { catatan_admin: note }),
  })

  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [approveError, setApproveError] = useState('')
  const [rejectNote, setRejectNote] = useState('')
  const [rejectError, setRejectError] = useState('')

  usePageMeta({
    title: 'Detail Pengajuan Sewa',
    description: 'Verifikasi data dan dokumen pengajuan sewa.',
    noindex: true,
  })

  if (isLoading) {
    return (
      <>
        <PageHeader eyebrow="Verifikasi penyewa" title="Detail Pengajuan" />
        <div className="mt-5">
          <LoadingState label="Memuat detail pengajuan" />
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <h1 className="sr-only">Pengajuan tidak ditemukan</h1>
        <ErrorState onRetry={refetch} />
      </>
    )
  }

  if (!data) {
    return (
      <>
        <h1 className="sr-only">Pengajuan tidak ditemukan</h1>
        <EmptyState
          icon={FileCheck2}
          title="Pengajuan tidak ditemukan"
          description="Data pengajuan yang Anda buka tidak tersedia. Kembali ke daftar pengajuan untuk memilih data lain."
          action={
            <Link to="/admin/pengajuan" className={buttonStyles({ variant: 'primary' })}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Kembali ke daftar pengajuan
            </Link>
          }
        />
      </>
    )
  }

  const pending = data.status === 'menunggu_verifikasi'
  const roomAvailable = room?.status === 'tersedia'

  const handleApprove = async () => {
    setApproveError('')
    try {
      const response = await approveMutation.mutateAsync()
      setApproveOpen(false)
      push(response.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['publik'] })
    } catch (error) {
      setApproveError(error instanceof ApiError ? error.message : 'Pengajuan gagal disetujui.')
    }
  }

  const handleReject = async () => {
    setRejectError('')
    if (rejectNote.trim().length < 10) {
      setRejectError('Catatan penolakan minimal 10 karakter.')
      document.getElementById('catatan_penolakan')?.focus()
      return
    }
    try {
      const response = await rejectMutation.mutateAsync(rejectNote)
      setRejectOpen(false)
      push(response.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    } catch (error) {
      setRejectError(error instanceof ApiError ? error.message : 'Pengajuan gagal ditolak.')
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Verifikasi penyewa"
        title="Detail Pengajuan"
        description={`Kode pengajuan ${data.kode_pengajuan}`}
      >
        <StatusBadge status={data.status} />
        <Link to="/admin/pengajuan" className={buttonStyles({ variant: 'secondary' })}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali
        </Link>
      </PageHeader>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <section className="rounded-card border border-line bg-white p-5">
            <h2 className="text-h2 text-ink">Data calon penyewa</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-small font-medium text-muted">Nama lengkap</dt>
                <dd className="mt-1 text-small font-semibold text-ink">{data.nama_lengkap}</dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Status penghuni</dt>
                <dd className="mt-1 text-small font-semibold text-ink">
                  {JENIS_PENGHUNI[data.status_penghuni]}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Email</dt>
                <dd className="mt-1 break-all text-small font-semibold text-ink">{data.email}</dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Nomor WhatsApp</dt>
                <dd className="mt-1 text-small font-semibold tabular text-ink">
                  {data.no_whatsapp}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-small font-medium text-muted">Kampus atau instansi</dt>
                <dd className="mt-1 text-small font-semibold text-ink">{data.nama_instansi}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-card border border-line bg-white p-5">
            <h2 className="text-h2 text-ink">Kontak darurat</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-small font-medium text-muted">Nama kontak</dt>
                <dd className="mt-1 text-small font-semibold text-ink">
                  {data.nama_kontak_darurat}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Nomor telepon</dt>
                <dd className="mt-1 text-small font-semibold tabular text-ink">
                  {data.no_kontak_darurat}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-card border border-line bg-white p-5">
            <h2 className="text-h2 text-ink">Rencana hunian</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-small font-medium text-muted">Kamar</dt>
                <dd className="mt-1 text-small font-semibold text-ink">
                  {room ? `${room.nomor_kamar}, ${room.nama_tipe}` : 'Kamar tidak ditemukan'}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Harga bulanan</dt>
                <dd className="mt-1 text-small font-semibold tabular text-ink">
                  {room ? formatRupiah(room.harga_bulanan) : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Tanggal mulai masuk</dt>
                <dd className="mt-1 text-small font-semibold text-ink">
                  {formatTanggal(data.tanggal_mulai_masuk)}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Tanggal pengajuan</dt>
                <dd className="mt-1 text-small font-semibold text-ink">
                  {formatTanggalWaktu(data.created_at)}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="space-y-5">
          <IdentityPreview
            pengajuan={data}
            imageUrl={identityUrl}
            loading={identityQuery.isLoading}
            error={identityQuery.isError}
          />

          {pending ? (
            <section className="rounded-card border border-line bg-white p-5">
              <h2 className="text-h2 text-ink">Verifikasi pengajuan</h2>
              {!roomAvailable ? (
                <p
                  role="alert"
                  className="mt-3 flex items-start gap-2 rounded-btn border border-amber-200 bg-amber-50 px-3 py-2 text-small leading-relaxed text-amber-800"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  Kamar ini sudah tidak berstatus tersedia. Pengajuan tidak dapat disetujui sebelum
                  kamar kembali tersedia.
                </p>
              ) : (
                <p className="mt-2 text-small leading-relaxed text-muted">
                  Setelah disetujui, sistem membuat akun penyewa, mengubah status kamar, menerbitkan
                  tagihan pertama, dan menolak pengajuan lain pada kamar yang sama.
                </p>
              )}
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  onClick={() => {
                    setApproveOpen(true)
                    setApproveError('')
                  }}
                  disabled={!roomAvailable}
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Setujui Pengajuan
                </Button>
                <Button
                  variant="subtle-danger"
                  onClick={() => {
                    setRejectOpen(true)
                    setRejectNote('')
                    setRejectError('')
                  }}
                >
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                  Tolak Pengajuan
                </Button>
              </div>
            </section>
          ) : (
            <section className="rounded-card border border-line bg-white p-5">
              <h2 className="text-h2 text-ink">Hasil verifikasi</h2>
              <div className="mt-3 flex items-center gap-2">
                <StatusBadge status={data.status} />
                {data.diverifikasi_pada ? (
                  <span className="text-small text-muted">
                    {formatTanggalWaktu(data.diverifikasi_pada)}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-small leading-relaxed text-muted">
                Diverifikasi oleh {admin?.nama || 'Admin'}.
              </p>
              <div className="mt-3 rounded-btn border border-line bg-ivory p-3">
                <p className="text-small font-semibold text-muted">Catatan Admin</p>
                <p className="mt-1 text-small leading-relaxed text-ink">
                  {data.catatan_admin || 'Tidak ada catatan.'}
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      <Modal
        open={approveOpen}
        onClose={() => {
          if (!approveMutation.isPending) setApproveOpen(false)
        }}
        title="Setujui pengajuan sewa"
        description={`Pengajuan ${data.kode_pengajuan} untuk kamar ${room?.nomor_kamar || '-'} akan disetujui.`}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setApproveOpen(false)}
              disabled={approveMutation.isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleApprove}
              loading={approveMutation.isPending}
              disabled={!roomAvailable}
            >
              Setujui Pengajuan
            </Button>
          </>
        }
      >
        {approveError ? (
          <p
            role="alert"
            className="mb-3 rounded-btn border border-red-200 bg-red-50 px-3 py-2 text-small font-medium text-danger"
          >
            {approveError}
          </p>
        ) : null}
        <p className="text-small leading-relaxed text-muted">
          Tindakan ini akan menjalankan proses berikut dalam satu transaksi:
        </p>
        <ul className="mt-3 space-y-2 text-small text-ink">
          {[
            'Membuat akun penyewa aktif dengan kata sandi awal.',
            `Mengubah status kamar ${room?.nomor_kamar || '-'} menjadi terisi.`,
            'Mencatat data hunian aktif dan tanggal siklus tagihan bulanan.',
            'Menerbitkan tagihan bulan pertama sesuai harga kamar.',
            'Menolak pengajuan lain yang masih menunggu pada kamar yang sama.',
            'Mengirim kredensial dan rincian tagihan melalui WhatsApp dan email.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </Modal>

      <Modal
        open={rejectOpen}
        onClose={() => {
          if (!rejectMutation.isPending) setRejectOpen(false)
        }}
        title="Tolak pengajuan sewa"
        description={`Pengajuan ${data.kode_pengajuan} akan ditolak dan alasannya dikirim ke WhatsApp serta email calon penyewa.`}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setRejectOpen(false)}
              disabled={rejectMutation.isPending}
            >
              Batal
            </Button>
            <Button variant="danger" onClick={handleReject} loading={rejectMutation.isPending}>
              Tolak Pengajuan
            </Button>
          </>
        }
      >
        {rejectError ? (
          <p
            role="alert"
            className="mb-3 rounded-btn border border-red-200 bg-red-50 px-3 py-2 text-small font-medium text-danger"
          >
            {rejectError}
          </p>
        ) : null}
        <Field
          label="Catatan penolakan"
          htmlFor="catatan_penolakan"
          required
          hint={`Minimal 10 karakter. ${rejectNote.trim().length} karakter saat ini.`}
        >
          <Textarea
            id="catatan_penolakan"
            value={rejectNote}
            onChange={(event) => {
              setRejectNote(event.target.value)
              setRejectError('')
            }}
            placeholder="Contoh: Foto KTM tidak terbaca jelas. Silakan ajukan kembali dengan foto yang lebih terang."
          />
        </Field>
      </Modal>
    </>
  )
}
