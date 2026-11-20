import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { Button, Field, Input } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ApiError } from '../../lib/api'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const { user, loading: authLoading, login } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  usePageMeta({
    title: 'Masuk',
    description: 'Masuk ke panel Admin atau portal Penyewa Vitana Residence.',
    noindex: true,
  })

  if (authLoading) {
    return (
      <div className="w-full max-w-md rounded-card border border-line bg-white p-8 text-center">
        <p className="text-small font-medium text-muted" role="status">
          Memeriksa sesi Anda
        </p>
      </div>
    )
  }

  if (user) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin/dashboard' : '/penyewa/dashboard'}
        replace
      />
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!email.trim()) nextErrors.email = 'Email wajib diisi.'
    else if (!emailPattern.test(email.trim())) nextErrors.email = 'Format email tidak valid.'
    if (!password) nextErrors.password = 'Kata sandi wajib diisi.'
    else if (password.length < 8) nextErrors.password = 'Kata sandi minimal 8 karakter.'

    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) {
      const first = Object.keys(nextErrors)[0]
      document.getElementById(first)?.focus()
      return
    }

    setSubmitting(true)
    try {
      const loggedIn = await login(email, password)
      push(`Selamat datang, ${loggedIn.nama}.`, 'success')
      navigate(
        loggedIn.role === 'admin' ? '/admin/dashboard' : '/penyewa/dashboard',
        { replace: true },
      )
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
        setFormError('Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="overflow-hidden rounded-card border border-line bg-white">
        <div className="bg-brand-900 px-6 py-5 sm:px-8">
          <p className="text-small font-semibold text-brand-200">Akses portal</p>
          <p className="mt-1 text-h3 font-bold text-white">Portal Admin dan Penyewa</p>
        </div>
        <div className="p-6 sm:p-8">
          <h1 className="text-panel-h1 text-ink">Selamat datang kembali</h1>
          <p className="mt-2 text-small leading-relaxed text-muted">
            Masuk untuk mengelola operasional kos atau memantau tagihan dan keluhan kamar Anda.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            {formError ? (
              <p
                role="alert"
                className="rounded-btn border border-red-200 bg-red-50 px-3 py-2 text-small font-medium text-danger"
              >
                {formError}
              </p>
            ) : null}

            <Field label="Email" htmlFor="email" required error={errors.email}>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setErrors((current) => ({ ...current, email: undefined }))
                  setFormError('')
                }}
                autoComplete="email"
                placeholder="nama@email.com"
                error={errors.email}
              />
            </Field>

            <Field label="Kata sandi" htmlFor="password" required error={errors.password}>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setErrors((current) => ({ ...current, password: undefined }))
                    setFormError('')
                  }}
                  autoComplete="current-password"
                  placeholder="Minimal 8 karakter"
                  error={errors.password}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-btn text-muted transition-colors hover:text-ink"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </Field>

            <Button type="submit" className="w-full" loading={submitting}>
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Masuk
            </Button>
          </form>
        </div>
      </div>
      <p className="mt-4 text-center text-small leading-relaxed text-muted">
        Akun penyewa dibuat otomatis oleh Admin setelah pengajuan sewa disetujui.
      </p>
    </div>
  )
}
