import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BedDouble,
  Check,
  CheckCircle2,
  FileCheck2,
  Layers3,
  LockKeyhole,
  MessageCircle,
  Ruler,
  ScrollText,
} from 'lucide-react'
import { RoomPhotoFallback } from '../../components/RoomCard'
import {
  Button,
  EmptyState,
  Field,
  ErrorState,
  FileUpload,
  Input,
  LoadingState,
  Select,
  StatusBadge,
  buttonStyles,
} from '../../components/ui'
import { usePublicKamarDetail, usePublicProfile } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ApiError } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import {
  addDays,
  formatRupiah,
  formatTanggal,
  normalizeWhatsApp,
  todayISO,
} from '../../lib/utils'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function KamarDetailPage() {
  const { id } = useParams()
  const roomQuery = usePublicKamarDetail(id)
  const profileQuery = usePublicProfile()
  const data = roomQuery.data?.data
  const profilKos = profileQuery.data?.data

  usePageMeta({
    title: data ? `Kamar ${data.nomor_kamar} ${data.nama_tipe}` : 'Detail Kamar',
    description: data
      ? `Detail Kamar ${data.nomor_kamar} tipe ${data.nama_tipe} di Vitana Residence. Harga ${formatRupiah(data.harga_bulanan)} per bulan.`
      : 'Detail kamar Vitana Residence.',
    image: data?.foto_utama_url,
  })

  if (roomQuery.isLoading || profileQuery.isLoading) {
    return (
      <section className="container-page py-8 sm:py-10">
        <LoadingState label="Memuat detail kamar" />
      </section>
    )
  }

  if (roomQuery.isError || profileQuery.isError) {
    return (
      <section className="container-page py-16">
        <ErrorState
          title="Detail kamar belum dapat dimuat"
          description="Data kamar atau profil kos tidak dapat diambil dari server. Periksa koneksi lalu coba lagi."
          onRetry={() => {
            roomQuery.refetch()
            profileQuery.refetch()
          }}
        />
      </section>
    )
  }

  if (!data) {
    return (
      <section className="container-page py-16">
        <h1 className="sr-only">Kamar tidak ditemukan</h1>
        <EmptyState
          icon={BedDouble}
          title="Kamar tidak ditemukan"
          description="Data kamar yang Anda cari tidak tersedia. Silakan kembali ke katalog untuk melihat pilihan kamar lain."
          action={
            <Link to="/kamar" className={buttonStyles({ variant: 'primary' })}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Kembali ke katalog
            </Link>
          }
        />
      </section>
    )
  }

  const waNumber = `62${normalizeWhatsApp(profilKos.no_whatsapp_admin).replace(/^0/, '')}`
  const gallery = data.galeri_foto_urls?.length
    ? data.galeri_foto_urls
    : data.foto_utama_url
      ? [data.foto_utama_url]
      : []

  return (
    <section className="container-page py-8 sm:py-10">
      <Link
        to="/kamar"
        className="inline-flex min-h-[44px] items-center gap-2 text-small font-semibold text-muted transition-colors hover:text-brand-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Semua kamar
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div className="min-w-0">
          <Gallery kamar={data} gallery={gallery} />

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={data.status} />
              <span className="text-small text-muted">Kamar {data.nomor_kamar}</span>
            </div>
            <h1 className="mt-2 text-[32px] font-bold leading-tight tracking-tight text-ink sm:text-public-h1">
              {data.nama_tipe}
            </h1>
            <p className="mt-2 max-w-prose text-body leading-relaxed text-muted">
              {data.deskripsi}
            </p>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-y border-line py-4">
              <div>
                <p className="text-small text-muted">Sewa bulanan</p>
                <p className="mt-1 text-[28px] font-bold tracking-tight tabular text-brand-800">
                  {formatRupiah(data.harga_bulanan)}
                </p>
              </div>
              <p className="text-small text-muted">Harga sewa paket bulanan</p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-3 divide-x divide-line rounded-card border border-line bg-white">
            <div className="p-4">
              <dt className="flex items-center gap-2 text-small font-medium text-muted">
                <Layers3 className="h-4 w-4 text-brand-600" aria-hidden="true" />
                Lantai
              </dt>
              <dd className="mt-1 text-small font-semibold tabular text-ink">{data.lantai}</dd>
            </div>
            <div className="p-4">
              <dt className="flex items-center gap-2 text-small font-medium text-muted">
                <Ruler className="h-4 w-4 text-brand-600" aria-hidden="true" />
                Luas
              </dt>
              <dd className="mt-1 text-small font-semibold text-ink">{data.luas_kamar}</dd>
            </div>
            <div className="p-4">
              <dt className="flex items-center gap-2 text-small font-medium text-muted">
                <BedDouble className="h-4 w-4 text-brand-600" aria-hidden="true" />
                Tipe
              </dt>
              <dd className="mt-1 text-small font-semibold text-ink">{data.nama_tipe}</dd>
            </div>
          </dl>

          <section className="mt-8 border-t border-line pt-6" aria-labelledby="fasilitas-kamar">
            <h2 id="fasilitas-kamar" className="text-h2 text-ink">
              Fasilitas kamar
            </h2>
            <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {data.fasilitas_kamar.map((fasilitas) => (
                <li key={fasilitas} className="flex items-start gap-2.5 py-1 text-small text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                  {fasilitas}
                </li>
              ))}
            </ul>
          </section>

          <section
            className="mt-8 rounded-card border border-brand-100 bg-brand-50 p-5"
            aria-labelledby="aturan-sewa"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-btn bg-white text-brand-700">
                <ScrollText className="h-4 w-4" aria-hidden="true" />
              </span>
              <h2 id="aturan-sewa" className="text-h2 text-ink">
                Aturan sewa
              </h2>
            </div>
            <p className="mt-3 max-w-prose text-small leading-relaxed text-muted">
              Seluruh penghuni mengikuti tata tertib kos putri yang berlaku di Vitana Residence.
            </p>
            <ul className="mt-4 space-y-3">
              {profilKos.tata_tertib.map((aturan) => (
                <li key={aturan} className="flex items-start gap-2.5 text-small leading-relaxed text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                  {aturan}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="min-w-0 self-start lg:sticky lg:top-24">
          {data.status === 'tersedia' ? (
            <BookingForm kamar={data} />
          ) : (
            <AvailabilityNotice kamar={data} waNumber={waNumber} />
          )}
        </aside>
      </div>
    </section>
  )
}

function Gallery({ kamar, gallery }) {
  const [active, setActive] = useState(0)
  const activeImage = gallery[active]

  return (
    <div>
      <div className="relative overflow-hidden rounded-card border border-line bg-brand-50">
        {activeImage ? (
          <img
            src={activeImage}
            alt={`Foto kamar ${kamar.nomor_kamar} tipe ${kamar.nama_tipe}`}
            width="1200"
            height="900"
            fetchpriority="high"
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="aspect-[4/3]">
            <RoomPhotoFallback />
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-md bg-white/95 px-2.5 py-1 text-small font-semibold tabular text-ink">
          Kamar {kamar.nomor_kamar}
        </span>
        {gallery.length > 0 ? (
          <span className="absolute right-4 top-4 rounded-md bg-ink/60 px-2.5 py-1 text-small font-medium tabular text-white">
            {active + 1} / {gallery.length}
          </span>
        ) : null}
      </div>
      {gallery.length > 1 ? (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {gallery.map((foto, index) => (
            <button
              key={`${foto}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Tampilkan foto ${index + 1} kamar ${kamar.nomor_kamar}`}
              aria-pressed={active === index}
              className={`overflow-hidden rounded-btn border-2 transition-colors ${
                active === index
                  ? 'border-brand-700 ring-2 ring-brand-200'
                  : 'border-transparent opacity-80 hover:border-brand-300 hover:opacity-100'
              }`}
            >
              <img
                src={foto}
                alt=""
                width="240"
                height="180"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function AvailabilityNotice({ kamar, waNumber }) {
  const perawatan = kamar.status === 'perawatan'
  return (
    <div className="rounded-card border border-line bg-white p-5">
      <StatusBadge status={kamar.status} />
      <h2 className="mt-3 text-h3 text-ink">
        {perawatan ? 'Kamar sedang dalam perawatan' : 'Kamar sedang ditempati'}
      </h2>
      <p className="mt-2 text-small leading-relaxed text-muted">
        {perawatan
          ? 'Kamar ini belum dapat diajukan sampai proses perawatan selesai. Silakan menghubungi Admin untuk menanyakan perkiraan ketersediaan.'
          : 'Kamar ini sedang ditempati. Anda tetap dapat melihat detailnya dan memilih kamar lain yang berstatus tersedia.'}
      </p>
      <div className="mt-5 flex flex-col gap-2">
        <Link to="/kamar" className={buttonStyles({ variant: 'primary' })}>
          Lihat kamar tersedia
        </Link>
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noreferrer"
          className={buttonStyles({ variant: 'secondary' })}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Tanya Admin
        </a>
      </div>
    </div>
  )
}

const initialForm = {
  nama_lengkap: '',
  email: '',
  no_whatsapp: '',
  status_penghuni: '',
  nama_instansi: '',
  nama_kontak_darurat: '',
  no_kontak_darurat: '',
  tanggal_mulai_masuk: '',
}

function BookingForm({ kamar }) {
  const queryClient = useQueryClient()
  const mutation = useMutation({ mutationFn: endpoints.publik.pengajuan })
  const [form, setForm] = useState({
    ...initialForm,
    tanggal_mulai_masuk: addDays(todayISO(), 7),
  })
  const [foto, setFoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [result, setResult] = useState(null)
  const previewRef = useRef(null)

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    },
    [],
  )

  const setValue = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setFormError('')
  }

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setFoto(null)
      setPreview(null)
      return
    }
    const allowed = ['image/jpeg', 'image/png']
    if (!allowed.includes(file.type)) {
      setFoto(null)
      setPreview(null)
      setErrors((current) => ({
        ...current,
        foto_identitas: 'Format foto harus JPG, JPEG, atau PNG.',
      }))
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setFoto(null)
      setPreview(null)
      setErrors((current) => ({
        ...current,
        foto_identitas: 'Ukuran foto maksimal 2 MB.',
      }))
      return
    }
    setErrors((current) => ({ ...current, foto_identitas: undefined }))
    setFoto(file)
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    const url = URL.createObjectURL(file)
    previewRef.current = url
    setPreview(url)
  }

  const validate = () => {
    const next = {}
    if (!form.nama_lengkap.trim()) next.nama_lengkap = 'Nama lengkap wajib diisi.'
    else if (form.nama_lengkap.trim().length > 100) next.nama_lengkap = 'Nama maksimal 100 karakter.'

    if (!form.email.trim()) next.email = 'Email wajib diisi.'
    else if (!emailPattern.test(form.email.trim())) next.email = 'Format email tidak valid.'

    if (!form.no_whatsapp.trim()) next.no_whatsapp = 'Nomor WhatsApp wajib diisi.'
    else if (!/^\d{10,15}$/.test(form.no_whatsapp.trim()))
      next.no_whatsapp = 'Nomor WhatsApp harus berupa 10 sampai 15 digit angka.'

    if (!form.status_penghuni) next.status_penghuni = 'Pilih status penghuni.'

    if (!form.nama_instansi.trim()) next.nama_instansi = 'Nama kampus atau instansi wajib diisi.'
    else if (form.nama_instansi.trim().length > 120)
      next.nama_instansi = 'Nama instansi maksimal 120 karakter.'

    if (!form.nama_kontak_darurat.trim())
      next.nama_kontak_darurat = 'Nama kontak darurat wajib diisi.'
    else if (form.nama_kontak_darurat.trim().length > 100)
      next.nama_kontak_darurat = 'Nama kontak darurat maksimal 100 karakter.'

    if (!form.no_kontak_darurat.trim())
      next.no_kontak_darurat = 'Nomor kontak darurat wajib diisi.'
    else if (!/^\d{10,15}$/.test(form.no_kontak_darurat.trim()))
      next.no_kontak_darurat = 'Nomor kontak darurat harus 10 sampai 15 digit angka.'

    if (!form.tanggal_mulai_masuk) next.tanggal_mulai_masuk = 'Tanggal mulai masuk wajib diisi.'
    else if (form.tanggal_mulai_masuk < todayISO())
      next.tanggal_mulai_masuk = 'Tanggal mulai masuk tidak boleh sebelum hari ini.'
    else if (form.tanggal_mulai_masuk > addDays(todayISO(), 30))
      next.tanggal_mulai_masuk = 'Tanggal mulai masuk maksimal 30 hari dari hari pengajuan.'

    if (!foto) next.foto_identitas = 'Foto KTP atau KTM wajib diunggah.'

    return next
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      const first = Object.keys(nextErrors)[0]
      document.getElementById(first)?.focus()
      return
    }
    const formData = new FormData()
    formData.append('kamar_id', String(kamar.id))
    Object.entries(form).forEach(([key, value]) => formData.append(key, value))
    formData.append('foto_identitas', foto)

    try {
      const response = await mutation.mutateAsync(formData)
      setResult(response.data)
      queryClient.invalidateQueries({ queryKey: ['admin', 'pengajuan'] })
    } catch (error) {
      if (error instanceof ApiError) {
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
      setFormError('Pengajuan gagal dikirim. Periksa koneksi lalu coba lagi.')
    }
  }

  if (result) {
    return (
      <div className="rounded-card border border-green-200 bg-white p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-success">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-3 text-h3 text-ink">Pengajuan berhasil dikirim</h2>
        <p className="mt-2 text-small leading-relaxed text-muted">
          Pengajuan sewa Anda sudah masuk ke Admin Vitana Residence. Konfirmasi dikirim ke
          WhatsApp dan email yang Anda daftarkan.
        </p>
        <dl className="mt-4 space-y-2 rounded-btn border border-line bg-ivory p-4 text-small">
          <div className="flex items-start justify-between gap-3">
            <dt className="text-muted">Kode pengajuan</dt>
            <dd className="text-right font-bold tabular text-ink">{result.kode_pengajuan}</dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-muted">Kamar</dt>
            <dd className="text-right font-semibold tabular text-ink">{kamar.nomor_kamar}</dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-muted">Tanggal masuk</dt>
            <dd className="text-right font-semibold text-ink">
              {formatTanggal(result.tanggal_mulai_masuk)}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-muted">Status</dt>
            <dd className="text-right">
              <StatusBadge status={result.status} />
            </dd>
          </div>
        </dl>
        <p className="mt-3 flex items-start gap-2 text-small leading-relaxed text-muted">
          <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
          Simpan kode pengajuan untuk memeriksa status verifikasi pada halaman Cek Pengajuan.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Link to="/cek-pengajuan" className={buttonStyles({ variant: 'primary' })}>
            Cek status pengajuan
          </Link>
          <Link to="/kamar" className={buttonStyles({ variant: 'secondary' })}>
            Lihat kamar lain
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-card border border-line bg-white">
      <div className="bg-brand-900 px-5 py-4 text-white">
        <p className="text-small font-semibold text-brand-200">Ajukan sewa kamar</p>
        <p className="mt-1 text-h3 font-bold text-white">
          Kamar {kamar.nomor_kamar}, {kamar.nama_tipe}
        </p>
        <p className="mt-2 text-[22px] font-bold leading-none tabular text-white">
          {formatRupiah(kamar.harga_bulanan)}
          <span className="ml-2 text-small font-medium text-brand-200">per bulan</span>
        </p>
      </div>

      <div className="p-5">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {formError ? (
          <p
            role="alert"
            className="rounded-btn border border-red-200 bg-red-50 px-3 py-2 text-small font-medium text-danger"
          >
            {formError}
          </p>
        ) : null}

        <fieldset className="space-y-4">
          <legend className="text-small font-semibold text-ink">Data calon penyewa</legend>
        <Field
          label="Nama lengkap"
          htmlFor="nama_lengkap"
          required
          error={errors.nama_lengkap}
        >
          <Input
            id="nama_lengkap"
            value={form.nama_lengkap}
            onChange={(event) => setValue('nama_lengkap', event.target.value)}
            maxLength={100}
            autoComplete="name"
            error={errors.nama_lengkap}
          />
        </Field>

        <Field label="Email" htmlFor="email" required error={errors.email}>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => setValue('email', event.target.value)}
            autoComplete="email"
            placeholder="nama@email.com"
            error={errors.email}
          />
        </Field>

        <Field
          label="Nomor WhatsApp"
          htmlFor="no_whatsapp"
          required
          hint="Gunakan angka, 10 sampai 15 digit."
          error={errors.no_whatsapp}
        >
          <Input
            id="no_whatsapp"
            type="tel"
            inputMode="numeric"
            value={form.no_whatsapp}
            onChange={(event) => setValue('no_whatsapp', event.target.value)}
            autoComplete="tel"
            error={errors.no_whatsapp}
          />
        </Field>

        <Field
          label="Status penghuni"
          htmlFor="status_penghuni"
          required
          error={errors.status_penghuni}
        >
          <Select
            id="status_penghuni"
            value={form.status_penghuni}
            onChange={(event) => setValue('status_penghuni', event.target.value)}
            error={errors.status_penghuni}
          >
            <option value="">Pilih status</option>
            <option value="mahasiswi">Mahasiswi</option>
            <option value="karyawati">Karyawati</option>
          </Select>
        </Field>

        <Field
          label="Nama kampus atau instansi"
          htmlFor="nama_instansi"
          required
          error={errors.nama_instansi}
        >
          <Input
            id="nama_instansi"
            value={form.nama_instansi}
            onChange={(event) => setValue('nama_instansi', event.target.value)}
            maxLength={120}
            error={errors.nama_instansi}
          />
        </Field>
        </fieldset>

        <fieldset className="space-y-4 border-t border-line pt-4">
          <legend className="text-small font-semibold text-ink">Kontak darurat</legend>
        <Field
          label="Nama kontak darurat"
          htmlFor="nama_kontak_darurat"
          required
          hint="Contoh: Bapak Hendra Wijaya atau Ibu Endang Maharani."
          error={errors.nama_kontak_darurat}
        >
          <Input
            id="nama_kontak_darurat"
            value={form.nama_kontak_darurat}
            onChange={(event) => setValue('nama_kontak_darurat', event.target.value)}
            maxLength={100}
            error={errors.nama_kontak_darurat}
          />
        </Field>

        <Field
          label="Nomor kontak darurat"
          htmlFor="no_kontak_darurat"
          required
          error={errors.no_kontak_darurat}
        >
          <Input
            id="no_kontak_darurat"
            type="tel"
            inputMode="numeric"
            value={form.no_kontak_darurat}
            onChange={(event) => setValue('no_kontak_darurat', event.target.value)}
            error={errors.no_kontak_darurat}
          />
        </Field>
        </fieldset>

        <fieldset className="space-y-4 border-t border-line pt-4">
          <legend className="text-small font-semibold text-ink">Rencana hunian</legend>
        <Field
          label="Rencana tanggal mulai masuk"
          htmlFor="tanggal_mulai_masuk"
          required
          hint="Paling cepat hari ini dan paling lambat 30 hari ke depan."
          error={errors.tanggal_mulai_masuk}
        >
          <Input
            id="tanggal_mulai_masuk"
            type="date"
            min={todayISO()}
            max={addDays(todayISO(), 30)}
            value={form.tanggal_mulai_masuk}
            onChange={(event) => setValue('tanggal_mulai_masuk', event.target.value)}
            error={errors.tanggal_mulai_masuk}
          />
        </Field>
        </fieldset>

        <fieldset className="space-y-4 border-t border-line pt-4">
          <legend className="text-small font-semibold text-ink">Dokumen identitas</legend>
        <Field
          label="Foto KTP atau KTM"
          htmlFor="foto_identitas"
          required
          hint="Foto akan disimpan pada penyimpanan privat dan hanya dapat dibuka Admin."
          error={errors.foto_identitas}
        >
          <FileUpload
            id="foto_identitas"
            onChange={handleFile}
            previewUrl={preview}
            error={errors.foto_identitas}
          />
        </Field>
        </fieldset>

        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Kirim pengajuan sewa
        </Button>
        <p className="flex items-start gap-2 text-small leading-relaxed text-muted">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
          Data pribadi dan foto identitas hanya digunakan untuk verifikasi pengajuan sewa.
        </p>
      </form>
      </div>
    </div>
  )
}
