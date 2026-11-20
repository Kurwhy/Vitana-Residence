import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { BedDouble, LockKeyhole, UserRound } from 'lucide-react'
import {
  Button,
  EmptyState,
  ErrorState,
  Field,
  Input,
  LoadingState,
  PageHeader,
  StatusBadge,
} from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { usePenyewaProfile } from '../../hooks/api'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ApiError } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import { JENIS_PENGHUNI } from '../../lib/status'
import { formatRupiah, formatTanggal } from '../../lib/utils'

const initialPasswordForm = {
  password_lama: '',
  password_baru: '',
  password_baru_confirmation: '',
}

export default function ProfilPage() {
  const { push } = useToast()
  const { data, isLoading, isError, refetch } = usePenyewaProfile()
  const mutation = useMutation({ mutationFn: endpoints.auth.changePassword })
  const [form, setForm] = useState(initialPasswordForm)
  const [errors, setErrors] = useState({})

  usePageMeta({
    title: 'Profil Akun',
    description: 'Data pribadi, rincian hunian, dan pengaturan kata sandi penyewa.',
    noindex: true,
  })

  if (isLoading) {
    return (
      <>
        <PageHeader eyebrow="Akun saya" title="Profil Akun" />
        <div className="mt-5">
          <LoadingState label="Memuat profil akun" />
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader eyebrow="Akun saya" title="Profil Akun" />
        <div className="mt-5">
          <ErrorState onRetry={refetch} />
        </div>
      </>
    )
  }

  const user = data?.data?.user
  const current = data?.data?.penghuni
  const room = data?.data?.kamar

  if (!current || !room) {
    return (
      <>
        <h1 className="sr-only">Data hunian tidak ditemukan</h1>
        <EmptyState
          icon={BedDouble}
          title="Data hunian tidak ditemukan"
          description="Akun Anda belum terhubung dengan data kamar aktif. Hubungi Admin Vitana Residence."
        />
      </>
    )
  }

  const setValue = (name, value) => {
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.password_lama) nextErrors.password_lama = 'Kata sandi lama wajib diisi.'
    if (!form.password_baru) nextErrors.password_baru = 'Kata sandi baru wajib diisi.'
    else if (form.password_baru.length < 8)
      nextErrors.password_baru = 'Kata sandi baru minimal 8 karakter.'
    if (!form.password_baru_confirmation)
      nextErrors.password_baru_confirmation = 'Konfirmasi kata sandi wajib diisi.'
    else if (form.password_baru_confirmation !== form.password_baru)
      nextErrors.password_baru_confirmation = 'Konfirmasi kata sandi tidak sama.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      const first = Object.keys(nextErrors)[0]
      document.getElementById(first)?.focus()
      return
    }

    try {
      const response = await mutation.mutateAsync({
        password_lama: form.password_lama,
        password_baru: form.password_baru,
        password_baru_confirmation: form.password_baru_confirmation,
      })
      setForm(initialPasswordForm)
      setErrors({})
      push(response.message, 'success')
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors) {
          const mapped = Object.fromEntries(
            Object.entries(error.errors).map(([key, messages]) => [key, messages?.[0]]),
          )
          setErrors(mapped)
          const first = Object.keys(mapped)[0]
          if (first) document.getElementById(first)?.focus()
        } else {
          setErrors({ password_lama: error.message })
          document.getElementById('password_lama')?.focus()
        }
      } else {
        setErrors({ password_lama: 'Kata sandi gagal diperbarui. Periksa koneksi lalu coba lagi.' })
      }
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Akun saya"
        title="Profil Akun"
        description="Informasi pribadi, rincian kamar, dan keamanan akun penyewa."
      />

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <section className="rounded-card border border-line bg-white p-5">
            <div className="flex items-center gap-2">
              <UserRound className="h-5 w-5 text-brand-700" aria-hidden="true" />
              <h2 className="text-h2 text-ink">Data pribadi</h2>
            </div>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-small font-medium text-muted">Nama</dt>
                <dd className="mt-1 text-small font-semibold text-ink">{user?.nama}</dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Email</dt>
                <dd className="mt-1 break-all text-small font-semibold text-ink">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Nomor WhatsApp</dt>
                <dd className="mt-1 text-small font-semibold tabular text-ink">
                  {user?.no_whatsapp}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Status penghuni</dt>
                <dd className="mt-1 text-small font-semibold text-ink">
                  {JENIS_PENGHUNI[current.status_penghuni]}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-small font-medium text-muted">Kampus atau instansi</dt>
                <dd className="mt-1 text-small font-semibold text-ink">{current.nama_instansi}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-card border border-line bg-white p-5">
            <div className="flex items-center gap-2">
              <BedDouble className="h-5 w-5 text-brand-700" aria-hidden="true" />
              <h2 className="text-h2 text-ink">Rincian hunian</h2>
            </div>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-small font-medium text-muted">Kamar</dt>
                <dd className="mt-1 text-small font-semibold text-ink">
                  {room.nomor_kamar}, {room.nama_tipe}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Status hunian</dt>
                <dd className="mt-1">
                  <StatusBadge status={current.status} />
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Lantai dan luas</dt>
                <dd className="mt-1 text-small font-semibold text-ink">
                  Lantai <span className="tabular">{room.lantai}</span>, {room.luas_kamar}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Harga bulanan</dt>
                <dd className="mt-1 text-small font-semibold tabular text-ink">
                  {formatRupiah(room.harga_bulanan)}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Tanggal masuk</dt>
                <dd className="mt-1 text-small font-semibold text-ink">
                  {formatTanggal(current.tanggal_masuk)}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Siklus tagihan</dt>
                <dd className="mt-1 text-small font-semibold tabular text-ink">
                  Tanggal {current.tanggal_siklus_bulanan} setiap bulan
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-card border border-line bg-white p-5">
            <h2 className="text-h2 text-ink">Kontak darurat terdaftar</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-small font-medium text-muted">Nama kontak</dt>
                <dd className="mt-1 text-small font-semibold text-ink">
                  {current.nama_kontak_darurat}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-muted">Nomor telepon</dt>
                <dd className="mt-1 text-small font-semibold tabular text-ink">
                  {current.no_kontak_darurat}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-small leading-relaxed text-muted">
              Hubungi Admin jika kontak darurat perlu diperbarui.
            </p>
          </section>
        </div>

        <div>
          <form
            className="rounded-card border border-line bg-white p-5 xl:sticky xl:top-24"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5 text-brand-700" aria-hidden="true" />
              <h2 className="text-h2 text-ink">Ubah kata sandi</h2>
            </div>
            <p className="mt-1 text-small leading-relaxed text-muted">
              Gunakan kata sandi baru minimal 8 karakter yang tidak mudah ditebak.
            </p>

            <div className="mt-4 space-y-4">
              <Field
                label="Kata sandi lama"
                htmlFor="password_lama"
                required
                error={errors.password_lama}
              >
                <Input
                  id="password_lama"
                  type="password"
                  value={form.password_lama}
                  onChange={(event) => setValue('password_lama', event.target.value)}
                  autoComplete="current-password"
                  error={errors.password_lama}
                />
              </Field>
              <Field
                label="Kata sandi baru"
                htmlFor="password_baru"
                required
                error={errors.password_baru}
              >
                <Input
                  id="password_baru"
                  type="password"
                  value={form.password_baru}
                  onChange={(event) => setValue('password_baru', event.target.value)}
                  autoComplete="new-password"
                  error={errors.password_baru}
                />
              </Field>
              <Field
                label="Konfirmasi kata sandi baru"
                htmlFor="password_baru_confirmation"
                required
                error={errors.password_baru_confirmation}
              >
                <Input
                  id="password_baru_confirmation"
                  type="password"
                  value={form.password_baru_confirmation}
                  onChange={(event) => setValue('password_baru_confirmation', event.target.value)}
                  autoComplete="new-password"
                  error={errors.password_baru_confirmation}
                />
              </Field>
              <Button type="submit" className="w-full" loading={mutation.isPending}>
                Simpan Kata Sandi
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
