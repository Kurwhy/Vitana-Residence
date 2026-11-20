import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, ClipboardList, Plus } from 'lucide-react'
import {
  Button,
  EmptyState,
  ErrorState,
  Field,
  FileUpload,
  Input,
  LoadingState,
  PageHeader,
  Select,
  StatusBadge,
  Textarea,
} from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { usePenyewaKeluhan, usePenyewaProfile } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ApiError } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import { canUseImage } from '../../lib/files'
import { KATEGORI_KELUHAN } from '../../lib/status'
import { formatTanggalWaktu } from '../../lib/utils'

const initialForm = {
  kategori: '',
  judul: '',
  deskripsi: '',
}

export default function KeluhanPage() {
  const queryClient = useQueryClient()
  const { push } = useToast()
  const profileQuery = usePenyewaProfile()
  const complaintsQuery = usePenyewaKeluhan()
  const mutation = useMutation({ mutationFn: endpoints.penyewa.keluhan.create })
  const [form, setForm] = useState(initialForm)
  const [foto, setFoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const previewRef = useRef(null)

  usePageMeta({
    title: 'Keluhan Saya',
    description: 'Ajukan dan pantau keluhan fasilitas kamar.',
    noindex: true,
  })

  if (profileQuery.isLoading || complaintsQuery.isLoading) {
    return (
      <>
        <PageHeader eyebrow="Layanan kamar" title="Keluhan Saya" />
        <div className="mt-5">
          <LoadingState label="Memuat keluhan" />
        </div>
      </>
    )
  }

  if (profileQuery.isError || complaintsQuery.isError) {
    return (
      <>
        <PageHeader eyebrow="Layanan kamar" title="Keluhan Saya" />
        <div className="mt-5">
          <ErrorState
            onRetry={() => {
              profileQuery.refetch()
              complaintsQuery.refetch()
            }}
          />
        </div>
      </>
    )
  }

  const current = profileQuery.data?.data?.penghuni
  const complaints = complaintsQuery.data?.data || []

  if (!current) {
    return (
      <>
        <h1 className="sr-only">Data penghuni tidak ditemukan</h1>
        <EmptyState
          icon={ClipboardList}
          title="Data penghuni tidak ditemukan"
          description="Akun Anda belum terhubung dengan data penghuni aktif. Hubungi Admin Vitana Residence."
        />
      </>
    )
  }

  const setValue = (name, value) => {
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }))
  }

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setFoto(null)
      setPreview(null)
      return
    }
    const problem = canUseImage(file)
    if (problem) {
      setFoto(null)
      setPreview(null)
      setErrors((currentErrors) => ({ ...currentErrors, foto_bukti: problem }))
      return
    }
    setErrors((currentErrors) => ({ ...currentErrors, foto_bukti: undefined }))
    setFoto(file)
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    const url = URL.createObjectURL(file)
    previewRef.current = url
    setPreview(url)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.kategori) nextErrors.kategori = 'Pilih kategori keluhan.'
    if (!form.judul.trim()) nextErrors.judul = 'Judul keluhan wajib diisi.'
    else if (form.judul.trim().length > 150)
      nextErrors.judul = 'Judul keluhan maksimal 150 karakter.'
    if (!form.deskripsi.trim()) nextErrors.deskripsi = 'Deskripsi masalah wajib diisi.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      const first = Object.keys(nextErrors)[0]
      document.getElementById(first)?.focus()
      return
    }

    const formData = new FormData()
    formData.append('kategori', form.kategori)
    formData.append('judul', form.judul)
    formData.append('deskripsi', form.deskripsi)
    if (foto) formData.append('foto_bukti', foto)

    try {
      const response = await mutation.mutateAsync(formData)
      push(response.message, 'success')
      setForm(initialForm)
      setFoto(null)
      setPreview(null)
      setErrors({})
      queryClient.invalidateQueries({ queryKey: ['penyewa'] })
      queryClient.invalidateQueries({ queryKey: ['admin'] })
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
        setErrors((currentErrors) => ({
          ...currentErrors,
          form: error.message,
        }))
      } else {
        setErrors((currentErrors) => ({
          ...currentErrors,
          form: 'Keluhan gagal dikirim. Periksa koneksi lalu coba lagi.',
        }))
      }
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Layanan kamar"
        title="Keluhan Saya"
        description="Sampaikan kendala fasilitas kamar dan pantau status penanganannya."
      />

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-h2 text-ink">Daftar keluhan</h2>
            <p className="text-small text-muted">
              <span className="font-semibold tabular text-ink">{complaints.length}</span> laporan
            </p>
          </div>

          {complaints.length > 0 ? (
            <ul className="space-y-3">
              {complaints.map((item) => (
                <li key={item.id} className="rounded-card border border-line bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-small font-medium tabular text-muted">{item.kode_keluhan}</p>
                      <h3 className="mt-1 text-h3 text-ink">{item.judul}</h3>
                      <p className="mt-1 text-small text-muted">
                        {KATEGORI_KELUHAN[item.kategori]} · Diajukan{' '}
                        {formatTanggalWaktu(item.created_at)}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <p className="mt-3 whitespace-pre-line text-small leading-relaxed text-muted">
                    {item.deskripsi}
                  </p>

                  {item.foto_bukti_url ? (
                    <div className="mt-3 overflow-hidden rounded-btn border border-line">
                      <img
                        src={item.foto_bukti_url}
                        alt={`Foto bukti keluhan ${item.judul}`}
                        width="800"
                        height="500"
                        loading="lazy"
                        className="aspect-[16/10] w-full object-cover"
                      />
                    </div>
                  ) : null}

                  {item.tanggapan_admin ? (
                    <div className="mt-3 rounded-btn border border-brand-100 bg-brand-50 px-3 py-2.5">
                      <p className="text-small font-semibold text-brand-800">Tanggapan Admin</p>
                      <p className="mt-1 text-small leading-relaxed text-brand-900">
                        {item.tanggapan_admin}
                      </p>
                      {item.diselesaikan_pada ? (
                        <p className="mt-1.5 flex items-center gap-1.5 text-small text-brand-800">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Diselesaikan {formatTanggalWaktu(item.diselesaikan_pada)}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="Belum ada keluhan"
              description="Laporan yang Anda ajukan akan muncul di sini beserta status dan tanggapan Admin."
            />
          )}
        </div>

        <div>
          <form
            className="rounded-card border border-line bg-white p-5 xl:sticky xl:top-24"
            onSubmit={handleSubmit}
            noValidate
          >
            <h2 className="text-h2 text-ink">Ajukan keluhan baru</h2>
            <p className="mt-1 text-small leading-relaxed text-muted">
              Jelaskan kendala fasilitas kamar secara rinci agar Admin dapat menindaklanjuti.
            </p>

            {errors.form ? (
              <p
                role="alert"
                className="mt-3 rounded-btn border border-red-200 bg-red-50 px-3 py-2 text-small font-medium text-danger"
              >
                {errors.form}
              </p>
            ) : null}

            <div className="mt-4 space-y-4">
              <Field label="Kategori" htmlFor="kategori" required error={errors.kategori}>
                <Select
                  id="kategori"
                  value={form.kategori}
                  onChange={(event) => setValue('kategori', event.target.value)}
                  error={errors.kategori}
                >
                  <option value="">Pilih kategori</option>
                  {Object.entries(KATEGORI_KELUHAN).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Judul keluhan" htmlFor="judul" required error={errors.judul}>
                <Input
                  id="judul"
                  value={form.judul}
                  onChange={(event) => setValue('judul', event.target.value)}
                  maxLength={150}
                  placeholder="Contoh: Air water heater kurang panas"
                  error={errors.judul}
                />
              </Field>

              <Field
                label="Deskripsi masalah"
                htmlFor="deskripsi"
                required
                error={errors.deskripsi}
              >
                <Textarea
                  id="deskripsi"
                  value={form.deskripsi}
                  onChange={(event) => setValue('deskripsi', event.target.value)}
                  rows={5}
                  placeholder="Jelaskan kapan masalah terjadi dan bagian kamar yang terdampak."
                  error={errors.deskripsi}
                />
              </Field>

              <Field
                label="Foto bukti"
                htmlFor="foto_bukti"
                hint="Opsional. JPG, JPEG, atau PNG maksimal 2 MB."
                error={errors.foto_bukti}
              >
                <FileUpload
                  id="foto_bukti"
                  onChange={handleFile}
                  previewUrl={preview}
                  error={errors.foto_bukti}
                />
              </Field>

              <Button type="submit" className="w-full" loading={mutation.isPending}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Kirim Keluhan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
