import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, CheckCircle2, Phone, Save, ScrollText } from 'lucide-react'
import {
  Button,
  ErrorState,
  Field,
  Input,
  ListField,
  LoadingState,
  PageHeader,
  Textarea,
} from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { useAdminProfile } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ApiError } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ProfilKosPage() {
  const queryClient = useQueryClient()
  const { push } = useToast()
  const { data, isLoading, isError, refetch } = useAdminProfile()
  const updateMutation = useMutation({ mutationFn: endpoints.admin.profil.update })
  const profilKos = data?.data
  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!profilKos) return
    setForm({
      nama_kos: profilKos.nama_kos,
      tagline: profilKos.tagline,
      deskripsi: profilKos.deskripsi,
      alamat: profilKos.alamat,
      link_maps: profilKos.link_maps || '',
      no_whatsapp_admin: profilKos.no_whatsapp_admin,
      email_admin: profilKos.email_admin,
      fasilitas_umum: [...profilKos.fasilitas_umum],
      tata_tertib: [...profilKos.tata_tertib],
    })
  }, [profilKos])

  usePageMeta({
    title: 'Pengaturan Profil Kos',
    description: 'Kelola informasi publik Vitana Residence.',
    noindex: true,
  })

  if (isLoading) {
    return (
      <>
        <PageHeader eyebrow="Pengaturan publik" title="Pengaturan Profil Kos" />
        <div className="mt-5">
          <LoadingState label="Memuat profil kos" />
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader eyebrow="Pengaturan publik" title="Pengaturan Profil Kos" />
        <div className="mt-5">
          <ErrorState onRetry={refetch} />
        </div>
      </>
    )
  }

  if (!form) {
    return (
      <>
        <PageHeader eyebrow="Pengaturan publik" title="Pengaturan Profil Kos" />
        <div className="mt-5">
          <LoadingState label="Menyiapkan formulir profil kos" />
        </div>
      </>
    )
  }

  const setValue = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setFormError('')
  }

  const validate = () => {
    const next = {}
    if (!form.nama_kos.trim()) next.nama_kos = 'Nama kos wajib diisi.'
    else if (form.nama_kos.trim().length > 100)
      next.nama_kos = 'Nama kos maksimal 100 karakter.'

    if (!form.tagline.trim()) next.tagline = 'Tagline wajib diisi.'
    else if (form.tagline.trim().length > 200)
      next.tagline = 'Tagline maksimal 200 karakter.'

    if (!form.deskripsi.trim()) next.deskripsi = 'Deskripsi wajib diisi.'
    if (!form.alamat.trim()) next.alamat = 'Alamat wajib diisi.'

    if (form.link_maps.trim() && !/^https?:\/\/.+/i.test(form.link_maps.trim())) {
      next.link_maps = 'Link Google Maps harus diawali http:// atau https://.'
    }

    if (!form.no_whatsapp_admin.trim()) next.no_whatsapp_admin = 'Nomor WhatsApp wajib diisi.'
    else if (!/^\d{10,15}$/.test(form.no_whatsapp_admin.trim()))
      next.no_whatsapp_admin = 'Nomor WhatsApp harus 10 sampai 15 digit angka.'

    if (!form.email_admin.trim()) next.email_admin = 'Email Admin wajib diisi.'
    else if (!emailPattern.test(form.email_admin.trim()))
      next.email_admin = 'Format email tidak valid.'

    if (form.fasilitas_umum.filter((item) => item.trim()).length === 0) {
      next.fasilitas_umum = 'Tambahkan minimal satu fasilitas umum.'
    }
    if (form.tata_tertib.filter((item) => item.trim()).length === 0) {
      next.tata_tertib = 'Tambahkan minimal satu aturan tata tertib.'
    }

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

    try {
      const response = await updateMutation.mutateAsync({
        nama_kos: form.nama_kos.trim(),
        tagline: form.tagline.trim(),
        deskripsi: form.deskripsi.trim(),
        alamat: form.alamat.trim(),
        link_maps: form.link_maps.trim(),
        no_whatsapp_admin: form.no_whatsapp_admin.trim(),
        email_admin: form.email_admin.trim(),
        fasilitas_umum: form.fasilitas_umum.map((item) => item.trim()).filter(Boolean),
        tata_tertib: form.tata_tertib.map((item) => item.trim()).filter(Boolean),
      })
      push(response.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['admin', 'profil-kos'] })
      queryClient.invalidateQueries({ queryKey: ['publik', 'profil-kos'] })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors) {
          const mapped = Object.fromEntries(
            Object.entries(error.errors).map(([key, messages]) => [key, messages?.[0]]),
          )
          setErrors(mapped)
        }
        setFormError(error.message)
      } else {
        setFormError('Profil kos gagal disimpan. Periksa koneksi lalu coba lagi.')
      }
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Pengaturan publik"
        title="Pengaturan Profil Kos"
        description="Informasi pada halaman ini digunakan pada beranda publik, katalog kamar, dan bagian kontak."
      />

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
                <Building2 className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-h2 text-ink">Informasi utama</h2>
                <p className="mt-1 text-small text-muted">Identitas dan cerita singkat kos.</p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <Field
                label="Nama kos"
                htmlFor="nama_kos"
                required
                error={errors.nama_kos}
              >
                <Input
                  id="nama_kos"
                  value={form.nama_kos}
                  onChange={(event) => setValue('nama_kos', event.target.value)}
                  maxLength={100}
                  error={errors.nama_kos}
                />
              </Field>
              <Field
                label="Tagline"
                htmlFor="tagline"
                required
                error={errors.tagline}
              >
                <Input
                  id="tagline"
                  value={form.tagline}
                  onChange={(event) => setValue('tagline', event.target.value)}
                  maxLength={200}
                  error={errors.tagline}
                />
              </Field>
              <Field
                label="Deskripsi"
                htmlFor="deskripsi"
                required
                error={errors.deskripsi}
              >
                <Textarea
                  id="deskripsi"
                  value={form.deskripsi}
                  onChange={(event) => setValue('deskripsi', event.target.value)}
                  rows={6}
                  error={errors.deskripsi}
                />
              </Field>
              <Field
                label="Alamat"
                htmlFor="alamat"
                required
                error={errors.alamat}
              >
                <Textarea
                  id="alamat"
                  value={form.alamat}
                  onChange={(event) => setValue('alamat', event.target.value)}
                  rows={3}
                  error={errors.alamat}
                />
              </Field>
              <Field
                label="Link Google Maps"
                htmlFor="link_maps"
                hint="Opsional. Gunakan tautan lengkap yang diawali https://."
                error={errors.link_maps}
              >
                <Input
                  id="link_maps"
                  type="url"
                  value={form.link_maps}
                  onChange={(event) => setValue('link_maps', event.target.value)}
                  error={errors.link_maps}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-card border border-line bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-brand-50 text-brand-700">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-h2 text-ink">Fasilitas umum</h2>
                <p className="mt-1 text-small text-muted">Fasilitas yang tampil di beranda.</p>
              </div>
            </div>
            <div className="mt-4">
              <ListField
                label="Daftar fasilitas umum"
                items={form.fasilitas_umum}
                onChange={(items) => setValue('fasilitas_umum', items)}
                addLabel="Tambah fasilitas"
                placeholder="Contoh: WiFi Fiber 100 Mbps"
                error={errors.fasilitas_umum}
                hint="Fasilitas ini tampil pada bagian fasilitas bersama di beranda publik."
                maxLength={100}
              />
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-card border border-line bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-brand-50 text-brand-700">
                <Phone className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-h2 text-ink">Kontak Admin</h2>
                <p className="mt-1 text-small text-muted">Kontak yang tampil di halaman publik.</p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <Field
                label="Nomor WhatsApp Admin"
                htmlFor="no_whatsapp_admin"
                required
                hint="Angka 10 sampai 15 digit."
                error={errors.no_whatsapp_admin}
              >
                <Input
                  id="no_whatsapp_admin"
                  type="tel"
                  inputMode="numeric"
                  value={form.no_whatsapp_admin}
                  onChange={(event) => setValue('no_whatsapp_admin', event.target.value)}
                  error={errors.no_whatsapp_admin}
                />
              </Field>
              <Field
                label="Email Admin"
                htmlFor="email_admin"
                required
                error={errors.email_admin}
              >
                <Input
                  id="email_admin"
                  type="email"
                  value={form.email_admin}
                  onChange={(event) => setValue('email_admin', event.target.value)}
                  error={errors.email_admin}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-card border border-line bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-brand-50 text-brand-700">
                <ScrollText className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-h2 text-ink">Tata tertib</h2>
                <p className="mt-1 text-small text-muted">Aturan yang tampil di beranda dan detail kamar.</p>
              </div>
            </div>
            <div className="mt-4">
              <ListField
                label="Daftar tata tertib"
                items={form.tata_tertib}
                onChange={(items) => setValue('tata_tertib', items)}
                addLabel="Tambah aturan"
                placeholder="Tuliskan aturan kos putri"
                error={errors.tata_tertib}
                hint="Tata tertib tampil pada beranda dan halaman detail kamar."
                maxLength={500}
              />
            </div>
          </section>

          <section className="rounded-card border border-line bg-white p-5">
            <Button type="submit" className="w-full" loading={updateMutation.isPending}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Simpan Profil Kos
            </Button>
          </section>
        </div>
      </form>
    </>
  )
}
