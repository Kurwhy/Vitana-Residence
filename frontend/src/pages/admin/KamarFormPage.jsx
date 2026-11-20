import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BedDouble, CircleDot, Images, ListChecks, Save, Trash2 } from 'lucide-react'
import {
  Button,
  EmptyState,
  ErrorState,
  Field,
  FileUpload,
  Input,
  ListField,
  LoadingState,
  PageHeader,
  Select,
  Textarea,
  buttonStyles,
} from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { useAdminKamarDetail } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ApiError } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import { canUseImage } from '../../lib/files'

function initialForm(existing) {
  return {
    nomor_kamar: existing?.nomor_kamar || '',
    nama_tipe: existing?.nama_tipe || '',
    lantai: existing ? String(existing.lantai) : '1',
    luas_kamar: existing?.luas_kamar || '',
    harga_bulanan: existing ? String(existing.harga_bulanan) : '',
    deskripsi: existing?.deskripsi || '',
    fasilitas_kamar:
      existing?.fasilitas_kamar?.length > 0 ? [...existing.fasilitas_kamar] : [''],
    status: existing?.status || 'tersedia',
  }
}

function initialGallery(existing) {
  const paths = existing?.galeri_foto || []
  const urls = existing?.galeri_foto_urls || []
  return paths.map((path, index) => ({ path, url: urls[index] || '' }))
}

export default function KamarFormPage() {
  const { id } = useParams()
  const editing = Boolean(id)
  const { data, isLoading, isError, refetch } = useAdminKamarDetail(id)
  const existing = data?.data

  usePageMeta({
    title: editing ? 'Ubah Data Kamar' : 'Tambah Kamar',
    description: 'Formulir data unit kamar Vitana Residence.',
    noindex: true,
  })

  if (editing && isLoading) {
    return (
      <>
        <PageHeader eyebrow="Inventaris kamar" title="Ubah Data Kamar" />
        <div className="mt-5">
          <LoadingState label="Memuat data kamar" />
        </div>
      </>
    )
  }

  if (editing && isError) {
    return (
      <>
        <PageHeader eyebrow="Inventaris kamar" title="Ubah Data Kamar" />
        <div className="mt-5">
          <ErrorState onRetry={refetch} />
        </div>
      </>
    )
  }

  if (editing && !existing) {
    return (
      <>
        <h1 className="sr-only">Kamar tidak ditemukan</h1>
        <EmptyState
          title="Kamar tidak ditemukan"
          description="Data kamar yang akan diubah tidak tersedia. Kembali ke daftar kamar untuk memilih unit lain."
          action={
            <Link to="/admin/kamar" className={buttonStyles({ variant: 'primary' })}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Kembali ke daftar kamar
            </Link>
          }
        />
      </>
    )
  }

  return <KamarForm key={id || 'new'} existing={editing ? existing : null} />
}

function KamarForm({ existing }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { push } = useToast()
  const editing = Boolean(existing)
  const occupied = existing?.status === 'terisi'

  const [form, setForm] = useState(() => initialForm(existing))
  const [mainFile, setMainFile] = useState(null)
  const [mainPreview, setMainPreview] = useState(existing?.foto_utama_url || null)
  const [removeMain, setRemoveMain] = useState(false)
  const [existingGallery, setExistingGallery] = useState(() => initialGallery(existing))
  const [newGallery, setNewGallery] = useState([])
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const previewUrls = useRef([])

  const createMutation = useMutation({ mutationFn: endpoints.admin.kamar.create })
  const updateMutation = useMutation({
    mutationFn: (formData) => endpoints.admin.kamar.update(existing.id, formData),
  })
  const submitting = createMutation.isPending || updateMutation.isPending

  const setValue = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setFormError('')
  }

  const handleMainPhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const problem = canUseImage(file)
    if (problem) {
      setErrors((current) => ({ ...current, foto_utama: problem }))
      return
    }
    setErrors((current) => ({ ...current, foto_utama: undefined }))
    setMainFile(file)
    setRemoveMain(false)
    const url = URL.createObjectURL(file)
    previewUrls.current.push(url)
    setMainPreview(url)
  }

  const handleGallery = (event) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return
    for (const file of files) {
      const problem = canUseImage(file)
      if (problem) {
        setErrors((current) => ({ ...current, galeri_foto: problem }))
        return
      }
    }
    setErrors((current) => ({ ...current, galeri_foto: undefined }))
    const items = files.map((file) => {
      const url = URL.createObjectURL(file)
      previewUrls.current.push(url)
      return { file, url }
    })
    setNewGallery((current) => [...current, ...items])
  }

  const validate = () => {
    const next = {}
    if (!form.nomor_kamar.trim()) next.nomor_kamar = 'Nomor kamar wajib diisi.'
    else if (form.nomor_kamar.trim().length > 20)
      next.nomor_kamar = 'Nomor kamar maksimal 20 karakter.'

    if (!form.nama_tipe.trim()) next.nama_tipe = 'Nama tipe kamar wajib diisi.'
    else if (form.nama_tipe.trim().length > 100)
      next.nama_tipe = 'Nama tipe maksimal 100 karakter.'

    if (!form.lantai) next.lantai = 'Lantai wajib diisi.'
    else if (!Number.isInteger(Number(form.lantai)) || Number(form.lantai) < 1)
      next.lantai = 'Lantai harus berupa angka bulat minimal 1.'

    if (!form.luas_kamar.trim()) next.luas_kamar = 'Luas kamar wajib diisi.'
    else if (form.luas_kamar.trim().length > 30)
      next.luas_kamar = 'Luas kamar maksimal 30 karakter.'

    if (!form.harga_bulanan) next.harga_bulanan = 'Harga bulanan wajib diisi.'
    else if (Number(form.harga_bulanan) <= 0)
      next.harga_bulanan = 'Harga bulanan harus lebih besar dari 0.'

    if (form.fasilitas_kamar.filter((item) => item.trim()).length === 0) {
      next.fasilitas_kamar = 'Tambahkan minimal satu fasilitas kamar.'
    }

    if (!form.status) next.status = 'Status kamar wajib dipilih.'

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
    formData.append('nomor_kamar', form.nomor_kamar.trim())
    formData.append('nama_tipe', form.nama_tipe.trim())
    formData.append('lantai', String(form.lantai))
    formData.append('luas_kamar', form.luas_kamar.trim())
    formData.append('harga_bulanan', String(form.harga_bulanan))
    formData.append('deskripsi', form.deskripsi.trim())
    formData.append('status', form.status)
    form.fasilitas_kamar
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => formData.append('fasilitas_kamar[]', item))

    if (mainFile) formData.append('foto_utama', mainFile)
    if (removeMain && !mainFile) formData.append('hapus_foto_utama', '1')

    if (editing) {
      formData.append(
        'galeri_foto_lama',
        JSON.stringify(existingGallery.map((item) => item.path)),
      )
    }
    newGallery.forEach((item) => formData.append('galeri_foto[]', item.file))

    try {
      const response = editing
        ? await updateMutation.mutateAsync(formData)
        : await createMutation.mutateAsync(formData)
      push(response.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['publik', 'kamar'] })
      navigate('/admin/kamar')
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
      } else {
        setFormError('Data kamar gagal disimpan. Periksa koneksi lalu coba lagi.')
      }
    }
  }

  const removeExistingPhoto = (index) => {
    setExistingGallery((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const removeNewPhoto = (index) => {
    setNewGallery((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <>
      <PageHeader
        eyebrow="Inventaris kamar"
        title={editing ? 'Ubah Data Kamar' : 'Tambah Kamar'}
        description={
          editing
            ? 'Perbarui informasi unit kamar, harga bulanan, fasilitas, foto, dan status.'
            : 'Lengkapi informasi unit kamar baru untuk ditampilkan pada katalog publik.'
        }
      >
        <Link to="/admin/kamar" className={buttonStyles({ variant: 'secondary' })}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali
        </Link>
      </PageHeader>

      <form className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]" onSubmit={handleSubmit} noValidate>
        <div className="space-y-5">
          {formError ? (
            <p
              role="alert"
              className="rounded-btn border border-red-200 bg-red-50 px-3 py-2 text-small font-medium text-danger"
            >
              {formError}
            </p>
          ) : null}

          <section className="rounded-card border border-line bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-brand-50 text-brand-700">
                <BedDouble className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-h2 text-ink">Informasi kamar</h2>
                <p className="mt-1 text-small text-muted">Detail dasar unit yang tampil di katalog.</p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Nomor kamar"
                htmlFor="nomor_kamar"
                required
                hint="Maksimal 20 karakter dan unik."
                error={errors.nomor_kamar}
              >
                <Input
                  id="nomor_kamar"
                  value={form.nomor_kamar}
                  onChange={(event) => setValue('nomor_kamar', event.target.value)}
                  maxLength={20}
                  error={errors.nomor_kamar}
                />
              </Field>
              <Field label="Nama tipe kamar" htmlFor="nama_tipe" required error={errors.nama_tipe}>
                <Input
                  id="nama_tipe"
                  value={form.nama_tipe}
                  onChange={(event) => setValue('nama_tipe', event.target.value)}
                  maxLength={100}
                  placeholder="Contoh: Deluxe AC"
                  error={errors.nama_tipe}
                />
              </Field>
              <Field label="Lantai" htmlFor="lantai" required error={errors.lantai}>
                <Input
                  id="lantai"
                  type="number"
                  min="1"
                  value={form.lantai}
                  onChange={(event) => setValue('lantai', event.target.value)}
                  error={errors.lantai}
                  className="tabular"
                />
              </Field>
              <Field
                label="Luas kamar"
                htmlFor="luas_kamar"
                required
                hint="Contoh: 3,5 x 4 m."
                error={errors.luas_kamar}
              >
                <Input
                  id="luas_kamar"
                  value={form.luas_kamar}
                  onChange={(event) => setValue('luas_kamar', event.target.value)}
                  maxLength={30}
                  error={errors.luas_kamar}
                />
              </Field>
              <Field
                label="Harga bulanan"
                htmlFor="harga_bulanan"
                required
                hint="Masukkan angka tanpa titik. Contoh: 1550000."
                error={errors.harga_bulanan}
                className="sm:col-span-2"
              >
                <Input
                  id="harga_bulanan"
                  type="number"
                  min="1"
                  step="1000"
                  value={form.harga_bulanan}
                  onChange={(event) => setValue('harga_bulanan', event.target.value)}
                  error={errors.harga_bulanan}
                  className="tabular"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-card border border-line bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-brand-50 text-brand-700">
                <ListChecks className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-h2 text-ink">Deskripsi dan fasilitas</h2>
                <p className="mt-1 text-small text-muted">Gambaran kamar dan fasilitas yang tersedia.</p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <Field
                label="Deskripsi kamar"
                htmlFor="deskripsi"
                hint="Opsional. Jelaskan suasana dan keunggulan kamar."
              >
                <Textarea
                  id="deskripsi"
                  value={form.deskripsi}
                  onChange={(event) => setValue('deskripsi', event.target.value)}
                  rows={4}
                />
              </Field>
              <ListField
                label="Fasilitas kamar"
                items={form.fasilitas_kamar}
                onChange={(items) => setValue('fasilitas_kamar', items)}
                addLabel="Tambah fasilitas"
                placeholder="Contoh: Kasur Queen"
                error={errors.fasilitas_kamar}
                hint="Tambahkan fasilitas yang tersedia di dalam kamar."
                maxLength={100}
              />
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-card border border-line bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-brand-50 text-brand-700">
                <CircleDot className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-h2 text-ink">Status kamar</h2>
                <p className="mt-1 text-small text-muted">Ketersediaan unit pada katalog publik.</p>
              </div>
            </div>
            <div className="mt-4">
              <Field
                label="Status"
                htmlFor="status"
                required
                hint={
                  occupied
                    ? 'Kamar sedang ditempati. Status hanya dapat diubah setelah penghuni diproses keluar.'
                    : 'Status tersedia membuat kamar dapat diajukan pada halaman publik.'
                }
                error={errors.status}
              >
                <Select
                  id="status"
                  value={form.status}
                  onChange={(event) => setValue('status', event.target.value)}
                  disabled={occupied}
                  error={errors.status}
                >
                  <option value="tersedia">Tersedia</option>
                  <option value="terisi">Terisi</option>
                  <option value="perawatan">Perawatan</option>
                </Select>
              </Field>
            </div>
          </section>

          <section className="rounded-card border border-line bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-brand-50 text-brand-700">
                <Images className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-h2 text-ink">Foto kamar</h2>
                <p className="mt-1 text-small text-muted">Foto utama dan galeri untuk katalog.</p>
              </div>
            </div>
            <div className="mt-4 space-y-5">
              <Field label="Foto utama" htmlFor="foto_utama" error={errors.foto_utama}>
                <FileUpload
                  id="foto_utama"
                  onChange={handleMainPhoto}
                  previewUrl={mainPreview}
                  error={errors.foto_utama}
                />
              </Field>
              {mainPreview ? (
                <Button
                  variant="subtle-danger"
                  size="sm"
                  onClick={() => {
                    setMainFile(null)
                    setMainPreview(null)
                    setRemoveMain(true)
                  }}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Hapus foto utama
                </Button>
              ) : null}

              <Field
                label="Galeri foto"
                htmlFor="galeri_foto"
                hint="Dapat memilih lebih dari satu foto."
                error={errors.galeri_foto}
              >
                <FileUpload
                  id="galeri_foto"
                  multiple
                  onChange={handleGallery}
                  error={errors.galeri_foto}
                />
              </Field>

              {existingGallery.length > 0 || newGallery.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {existingGallery.map((foto, index) => (
                    <div
                      key={`existing-${foto.path}-${index}`}
                      className="group relative overflow-hidden rounded-btn border border-line"
                    >
                      <img
                        src={foto.url}
                        alt={`Foto galeri kamar ${index + 1}`}
                        width="320"
                        height="240"
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(index)}
                        className="absolute right-1.5 top-1.5 flex h-11 w-11 items-center justify-center rounded-btn bg-white/95 text-danger transition-colors hover:bg-red-50"
                        aria-label={`Hapus foto galeri ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  {newGallery.map((foto, index) => (
                    <div
                      key={`new-${foto.url}`}
                      className="group relative overflow-hidden rounded-btn border border-line"
                    >
                      <img
                        src={foto.url}
                        alt={`Foto galeri baru ${index + 1}`}
                        width="320"
                        height="240"
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewPhoto(index)}
                        className="absolute right-1.5 top-1.5 flex h-11 w-11 items-center justify-center rounded-btn bg-white/95 text-danger transition-colors hover:bg-red-50"
                        aria-label={`Hapus foto galeri baru ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-small text-muted">Belum ada foto pada galeri kamar.</p>
              )}
            </div>
          </section>

          <section className="rounded-card border border-line bg-white p-5">
            <div className="flex flex-col gap-2">
              <Button type="submit" loading={submitting}>
                <Save className="h-4 w-4" aria-hidden="true" />
                {editing ? 'Simpan Perubahan' : 'Simpan Kamar'}
              </Button>
              <Link to="/admin/kamar" className={buttonStyles({ variant: 'secondary' })}>
                Batal
              </Link>
            </div>
          </section>
        </div>
      </form>
    </>
  )
}
