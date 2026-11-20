import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle2, FileSearch, Search, XCircle } from 'lucide-react'
import {
  Button,
  EmptyState,
  Field,
  Input,
  StatusBadge,
} from '../../components/ui'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ApiError } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import { JENIS_PENGHUNI } from '../../lib/status'
import { formatTanggal, normalizeWhatsApp } from '../../lib/utils'

const kodePattern = /^BKG-\d{8}-\d{4}$/

export default function CekPengajuanPage() {
  const mutation = useMutation({ mutationFn: endpoints.publik.cekPengajuan })
  const [kode, setKode] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [formError, setFormError] = useState('')

  usePageMeta({
    title: 'Cek Status Pengajuan',
    description:
      'Periksa status pengajuan sewa kamar Vitana Residence menggunakan kode pengajuan dan nomor WhatsApp pendaftar.',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    const kodeBersih = kode.trim().toUpperCase()
    if (!kodeBersih) nextErrors.kode_pengajuan = 'Kode pengajuan wajib diisi.'
    else if (!kodePattern.test(kodeBersih))
      nextErrors.kode_pengajuan = 'Format kode pengajuan harus BKG-YYYYMMDD-0001.'

    const waBersih = normalizeWhatsApp(whatsapp)
    if (!waBersih) nextErrors.no_whatsapp = 'Nomor WhatsApp wajib diisi.'
    else if (waBersih.length < 10 || waBersih.length > 15)
      nextErrors.no_whatsapp = 'Nomor WhatsApp harus 10 sampai 15 digit angka.'

    setErrors(nextErrors)
    setNotFound(false)
    if (Object.keys(nextErrors).length > 0) {
      const first = Object.keys(nextErrors)[0]
      document.getElementById(first)?.focus()
      return
    }

    setFormError('')
    setNotFound(false)
    try {
      const response = await mutation.mutateAsync({
        kode_pengajuan: kodeBersih,
        no_whatsapp: waBersih,
      })
      setResult(response.data)
    } catch (error) {
      setResult(null)
      if (error instanceof ApiError) {
        if (error.status === 404) {
          setNotFound(true)
          return
        }
        if (error.errors) {
          const mapped = Object.fromEntries(
            Object.entries(error.errors).map(([key, messages]) => [key, messages?.[0]]),
          )
          setErrors(mapped)
          const first = Object.keys(mapped)[0]
          if (first) document.getElementById(first)?.focus()
        }
        setFormError(error.message)
        return
      }
      setFormError('Pencarian gagal diproses. Periksa koneksi lalu coba lagi.')
    }
  }

  return (
    <section className="container-page py-10 sm:py-14">
      <div className="max-w-prose">
        <p className="text-small font-semibold text-brand-700">Status pengajuan</p>
        <h1 className="mt-2 text-[32px] font-bold leading-tight tracking-tight text-ink sm:text-public-h1">
          Cek status pengajuan sewa
        </h1>
        <p className="mt-3 text-body leading-relaxed text-muted">
          Masukkan kode pengajuan dan nomor WhatsApp yang digunakan saat mendaftar untuk melihat
          status verifikasi dari Admin Vitana Residence.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-8">
        <div className="rounded-card border border-line bg-white p-5 sm:p-6">
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {formError ? (
              <p
                role="alert"
                className="rounded-btn border border-red-200 bg-red-50 px-3 py-2 text-small font-medium text-danger"
              >
                {formError}
              </p>
            ) : null}
            <Field
              label="Kode pengajuan"
              htmlFor="kode_pengajuan"
              required
              hint="Format: BKG-YYYYMMDD-0001."
              error={errors.kode_pengajuan}
            >
              <Input
                id="kode_pengajuan"
                value={kode}
                onChange={(event) => setKode(event.target.value)}
                placeholder="BKG-20261118-0001"
                autoCapitalize="characters"
                error={errors.kode_pengajuan}
                className="tabular"
              />
            </Field>
            <Field
              label="Nomor WhatsApp"
              htmlFor="no_whatsapp"
              required
              hint="Gunakan nomor yang sama dengan saat mengajukan sewa."
              error={errors.no_whatsapp}
            >
              <Input
                id="no_whatsapp"
                type="tel"
                inputMode="numeric"
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
                placeholder="082134567890"
                error={errors.no_whatsapp}
              />
            </Field>
            <Button type="submit" className="w-full" loading={mutation.isPending}>
              <Search className="h-4 w-4" aria-hidden="true" />
              Cari pengajuan
            </Button>
          </form>

          <div className="mt-5 border-t border-line pt-4">
            <p className="text-small font-semibold text-muted">Data contoh untuk mencoba</p>
            <p className="mt-1 text-small leading-relaxed text-muted">
              Kode <span className="font-semibold tabular text-ink">BKG-20261118-0001</span> dengan
              nomor WhatsApp <span className="font-semibold tabular text-ink">082134567890</span>.
            </p>
          </div>
        </div>

        <div className="min-w-0">
          {result ? (
            <div className="rounded-card border border-line bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
                <div>
                  <p className="text-small font-medium text-muted">Kode pengajuan</p>
                  <p className="mt-1 text-small font-bold tabular text-ink">
                    {result.kode_pengajuan}
                  </p>
                </div>
                <StatusBadge status={result.status} />
              </div>

              <h2 className="mt-4 text-h2 text-ink">Pengajuan {result.nama_lengkap}</h2>
              <p className="mt-1 text-small text-muted">
                Diajukan pada {formatTanggal(result.created_at)} untuk kamar{' '}
                {result.kamar?.nomor_kamar || '-'}.
              </p>

              {result.status === 'menunggu_verifikasi' ? (
                <p className="mt-4 flex items-start gap-2 rounded-btn border border-amber-200 bg-amber-50 px-3 py-2 text-small leading-relaxed text-amber-800">
                  <FileSearch className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  Pengajuan sedang diperiksa Admin. Hasil verifikasi akan dikirim melalui WhatsApp
                  dan email yang terdaftar.
                </p>
              ) : null}
              {result.status === 'disetujui' ? (
                <p className="mt-4 flex items-start gap-2 rounded-btn border border-green-200 bg-green-50 px-3 py-2 text-small leading-relaxed text-green-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  Pengajuan disetujui. Akun penyewa dan rincian tagihan pertama dikirim melalui
                  WhatsApp dan email.
                </p>
              ) : null}
              {result.status === 'ditolak' ? (
                <p className="mt-4 flex items-start gap-2 rounded-btn border border-red-200 bg-red-50 px-3 py-2 text-small leading-relaxed text-red-800">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  Pengajuan belum dapat disetujui. Silakan membaca catatan Admin di bawah.
                </p>
              ) : null}

              <dl className="mt-5 grid gap-x-6 gap-y-4 border-t border-line pt-4 sm:grid-cols-2">
                <div>
                  <dt className="text-small font-medium text-muted">Kamar</dt>
                  <dd className="mt-1 text-small font-semibold text-ink">
                    {result.kamar
                      ? `${result.kamar.nomor_kamar}, ${result.kamar.nama_tipe}`
                      : 'Data kamar tidak tersedia'}
                  </dd>
                </div>
                <div>
                  <dt className="text-small font-medium text-muted">Tanggal mulai masuk</dt>
                  <dd className="mt-1 text-small font-semibold text-ink">
                    {formatTanggal(result.tanggal_mulai_masuk)}
                  </dd>
                </div>
                <div>
                  <dt className="text-small font-medium text-muted">Status penghuni</dt>
                  <dd className="mt-1 text-small font-semibold text-ink">
                    {JENIS_PENGHUNI[result.status_penghuni]}
                  </dd>
                </div>
                <div>
                  <dt className="text-small font-medium text-muted">Kampus atau instansi</dt>
                  <dd className="mt-1 text-small font-semibold text-ink">{result.nama_instansi}</dd>
                </div>
                <div>
                  <dt className="text-small font-medium text-muted">Kontak darurat</dt>
                  <dd className="mt-1 text-small font-semibold text-ink">
                    {result.nama_kontak_darurat}
                    <span className="ml-1 font-medium tabular text-muted">
                      ({result.no_kontak_darurat})
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-small font-medium text-muted">Email</dt>
                  <dd className="mt-1 break-all text-small font-semibold text-ink">
                    {result.email}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 rounded-btn border border-line bg-ivory p-4">
                <p className="text-small font-semibold text-muted">Catatan Admin</p>
                <p className="mt-1 text-small leading-relaxed text-ink">
                  {result.catatan_admin || 'Belum ada catatan dari Admin.'}
                </p>
                {result.diverifikasi_pada ? (
                  <p className="mt-2 text-small text-muted">
                    Diverifikasi pada {formatTanggal(result.diverifikasi_pada)}
                  </p>
                ) : null}
              </div>
            </div>
          ) : notFound ? (
            <EmptyState
              icon={FileSearch}
              title="Pengajuan tidak ditemukan"
              description="Kombinasi kode pengajuan dan nomor WhatsApp tidak cocok. Periksa kembali keduanya, lalu coba lagi."
            />
          ) : (
            <div className="rounded-card border border-dashed border-line-strong bg-white p-6">
              <EmptyState
                className="border-0 bg-transparent p-0"
                icon={FileSearch}
                title="Hasil pencarian akan tampil di sini"
                description="Setelah formulir dikirim, Anda akan melihat status pengajuan, rincian kamar, dan catatan Admin."
              />
              <p className="mt-6 border-t border-line pt-4 text-small leading-relaxed text-muted">
                Pengajuan yang sudah disetujui tetap dapat diperiksa. Halaman ini hanya menampilkan
                data pengajuan, bukan kredensial akun penyewa.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
