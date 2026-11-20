import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  Building2,
  ClipboardList,
  CreditCard,
  ExternalLink,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquareWarning,
  Phone,
  ReceiptText,
  UserRound,
  Users,
  X,
  Clock,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { jamOperasional } from '../data/config'
import { usePublicProfile } from '../hooks/api'
import { cn, formatTanggal, normalizeWhatsApp, todayISO } from '../lib/utils'
import { Button, Skeleton } from './ui'

function BrandMark({ className }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g stroke="currentColor" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M8 15 L18 6 L28 15" strokeWidth="1.6" />
        <path d="M36 15 L46 6 L56 15" strokeWidth="1.6" />
        <path d="M18 16 L32 45 L46 16" strokeWidth="8" />
        <path d="M10 54 H54" strokeWidth="1.6" />
      </g>
    </svg>
  )
}

export function BrandWordmark({ tone = 'default', size = 'default', className }) {
  const light = tone === 'light'
  const large = size === 'lg'
  const textColor = light ? 'text-white' : 'text-brand-800'
  const subColor = light ? 'text-brand-200' : 'text-muted'

  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap',
        large ? 'gap-4' : 'gap-2.5',
        className,
      )}
    >
      <BrandMark
        className={cn(light ? 'text-brand-100' : 'text-brand-700', large ? 'h-14 w-14' : 'h-8 w-8')}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-extrabold uppercase',
            textColor,
            large ? 'text-[25px] tracking-[0.16em]' : 'text-[15px] tracking-[0.18em]',
          )}
        >
          Vitana
        </span>
        <span
          className={cn(
            'font-semibold uppercase',
            subColor,
            large ? 'mt-1 text-[12px] tracking-[0.28em]' : 'mt-1 text-[9px] tracking-[0.26em]',
          )}
        >
          Residence
        </span>
        {large ? (
          <>
            <span className={cn('mt-3 h-px w-full', light ? 'bg-brand-400/60' : 'bg-brand-300')} />
            <span
              className={cn(
                'mt-2 text-[9px] font-medium uppercase tracking-[0.18em]',
                light ? 'text-brand-300' : 'text-muted',
              )}
            >
              A serene female boarding house
            </span>
          </>
        ) : null}
      </span>
    </span>
  )
}

const publicNav = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/kamar', label: 'Katalog Kamar' },
  { to: '/cek-pengajuan', label: 'Cek Pengajuan' },
]

export function PublicLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { data: profilData, isLoading: profilLoading } = usePublicProfile()
  const profilKos = profilData?.data

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  const waNumber = profilKos
    ? `62${normalizeWhatsApp(profilKos.no_whatsapp_admin).replace(/^0/, '')}`
    : ''

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <header className="sticky top-0 z-40 border-b border-line bg-ivory">
        <div className="container-page flex h-[72px] items-center justify-between gap-4">
          <Link
            to="/"
            className="flex min-h-[44px] items-center rounded-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
          >
            <BrandWordmark />
            <span className="sr-only">kembali ke beranda</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
            {publicNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'inline-flex h-11 items-center border-b-2 px-3.5 text-[15px] transition-colors',
                    isActive
                      ? 'border-brand-700 font-semibold text-brand-800'
                      : 'border-transparent font-medium text-muted hover:border-brand-200 hover:text-ink',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden min-h-[44px] items-center justify-center rounded-btn border border-line-strong bg-white px-4 text-[15px] font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 sm:inline-flex"
            >
              Masuk
            </Link>
            <button
              type="button"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-btn border border-line-strong bg-white px-3 text-[15px] font-semibold text-ink transition-colors hover:bg-brand-50 md:hidden"
              onClick={() => setOpen((current) => !current)}
              aria-expanded={open}
              aria-controls="menu-publik"
              aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            >
              {open ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
              {open ? 'Tutup' : 'Menu'}
            </button>
          </div>
        </div>
        {open ? (
          <div id="menu-publik" className="border-t border-line bg-white md:hidden">
            <nav className="container-page flex flex-col py-2" aria-label="Navigasi utama ponsel">
              {publicNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-[48px] items-center rounded-btn px-3 text-[15px]',
                      isActive
                        ? 'bg-brand-800 font-semibold text-white'
                        : 'font-medium text-brand-100/80 hover:bg-white/5 hover:text-white',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/login"
                className="mt-2 flex min-h-[48px] items-center justify-center rounded-btn bg-brand-700 px-3 text-small font-semibold text-white transition-colors hover:bg-brand-800"
              >
                Masuk
              </Link>
            </nav>
          </div>
        ) : null}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-16 bg-brand-900 text-brand-100">
        <div className="container-page py-14">
          <div className="grid gap-12 border-b border-brand-800 pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <BrandWordmark tone="light" size="lg" />
              <p className="mt-6 max-w-lg text-[24px] font-semibold leading-snug tracking-tight text-white sm:text-[28px]">
                Kos putri yang tenang, dekat kampus, dan siap ditempati.
              </p>
              <p className="mt-4 max-w-md text-small leading-relaxed text-brand-200">
                Lingkungan bersih, keamanan 24 jam, dan akses cepat ke kawasan kampus di
                Yogyakarta untuk mahasiswi maupun karyawati.
              </p>
              <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-1" aria-label="Navigasi footer">
                {publicNav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="inline-flex min-h-[44px] items-center text-small font-medium text-brand-100 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  className="inline-flex min-h-[44px] items-center text-small font-medium text-brand-100 transition-colors hover:text-white"
                >
                  Masuk
                </Link>
              </nav>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="text-small font-semibold text-white">Alamat dan kontak</h2>
                {profilLoading ? (
                  <div className="mt-3 space-y-3">
                    <Skeleton className="h-4 w-full bg-brand-700" />
                    <Skeleton className="h-4 w-3/4 bg-brand-700" />
                    <Skeleton className="h-4 w-1/2 bg-brand-700" />
                  </div>
                ) : profilKos ? (
                  <address className="mt-3 space-y-3 not-italic">
                    <p className="flex gap-2.5 text-small leading-relaxed text-brand-100/90">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
                      <span>{profilKos.alamat}</span>
                    </p>
                    <a
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-h-[44px] items-center gap-2.5 text-small text-brand-100 transition-colors hover:text-white"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
                      <span className="tabular">{profilKos.no_whatsapp_admin}</span>
                    </a>
                    <a
                      href={`mailto:${profilKos.email_admin}`}
                      className="flex min-h-[44px] items-center gap-2.5 break-all text-small text-brand-100 transition-colors hover:text-white"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
                      {profilKos.email_admin}
                    </a>
                  </address>
                ) : (
                  <p className="mt-3 text-small leading-relaxed text-brand-200">
                    Informasi kontak belum dapat dimuat.
                  </p>
                )}
              </div>
              <div>
                <h2 className="text-small font-semibold text-white">Jam operasional</h2>
                <p className="mt-3 flex gap-2.5 text-small leading-relaxed text-brand-100/90">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
                  {jamOperasional}
                </p>
                {profilKos ? (
                  <a
                    href={profilKos.link_maps}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-btn border border-brand-700 bg-brand-800 px-3.5 text-small font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Buka Google Maps
                  </a>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-6 text-small text-brand-300 sm:flex-row sm:items-center sm:justify-between">
            <p>Vitana Residence. Kos putri di Yogyakarta.</p>
            <p>Company profile, pengajuan sewa, dan portal penghuni.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-50/50">
      <header className="container-page flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <Link
          to="/"
          className="flex min-h-[44px] items-center rounded-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
        >
          <BrandWordmark />
          <span className="sr-only">kembali ke beranda</span>
        </Link>
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-btn px-3 text-small font-semibold text-muted transition-colors hover:bg-brand-50 hover:text-brand-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Kembali ke beranda</span>
          <span className="sm:hidden">Beranda</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <Outlet />
      </main>
      <footer className="container-page py-5 text-center text-small text-muted">
        Vitana Residence. Kos putri di Yogyakarta.
      </footer>
    </div>
  )
}

const adminMenu = [
  {
    label: 'Utama',
    items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Operasional',
    items: [
      { to: '/admin/kamar', label: 'Kelola Kamar', icon: BedDouble },
      { to: '/admin/pengajuan', label: 'Pengajuan Sewa', icon: FileCheck2 },
      { to: '/admin/penghuni', label: 'Penghuni', icon: Users },
      { to: '/admin/tagihan', label: 'Tagihan', icon: ReceiptText },
      { to: '/admin/keluhan', label: 'Keluhan', icon: MessageSquareWarning },
    ],
  },
  {
    label: 'Pengaturan',
    items: [{ to: '/admin/profil-kos', label: 'Profil Kos', icon: Building2 }],
  },
]

const penyewaMenu = [
  {
    label: 'Utama',
    items: [{ to: '/penyewa/dashboard', label: 'Beranda', icon: LayoutDashboard }],
  },
  {
    label: 'Layanan',
    items: [
      { to: '/penyewa/tagihan', label: 'Tagihan', icon: CreditCard },
      { to: '/penyewa/keluhan', label: 'Keluhan Saya', icon: ClipboardList },
    ],
  },
  {
    label: 'Akun',
    items: [{ to: '/penyewa/profil', label: 'Profil Akun', icon: UserRound }],
  },
]

function SidebarNav({ sections, onNavigate }) {
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Menu panel">
      {sections.map((section) => (
        <div key={section.label}>
          <p className="px-3 pb-2 text-small font-semibold text-brand-300">{section.label}</p>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to.endsWith('dashboard')}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-[44px] items-center gap-3 rounded-btn px-3 text-small transition-colors',
                      isActive
                        ? 'bg-brand-800 font-semibold text-white'
                        : 'font-medium text-brand-100/80 hover:bg-white/5 hover:text-white',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-white' : 'text-brand-300')}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {isActive ? (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" aria-hidden="true" />
                      ) : null}
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}

export function PanelLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previousFocus = useRef(null)

  const isAdmin = user?.role === 'admin'
  const sections = isAdmin ? adminMenu : penyewaMenu
  const panelName = isAdmin ? 'Panel Admin' : 'Portal Penyewa'

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!drawerOpen) return undefined
    previousFocus.current = document.activeElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const panel = drawerRef.current
      if (!panel) return
      const focusable = Array.from(
        panel.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = originalOverflow
      if (previousFocus.current instanceof HTMLElement) previousFocus.current.focus()
    }
  }, [drawerOpen])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-ivory">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-brand-800 bg-brand-900 lg:flex">
        <div className="flex h-20 items-center border-b border-brand-800 px-5">
          <Link
            to={isAdmin ? '/admin/dashboard' : '/penyewa/dashboard'}
            className="flex min-h-[44px] items-center rounded-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900"
          >
            <BrandWordmark tone="light" />
            <span className="sr-only">buka dashboard</span>
          </Link>
        </div>
        <div className="border-b border-brand-800 px-5 py-4">
          <p className="text-small font-medium text-brand-300">{panelName}</p>
          <p className="mt-1 truncate text-small font-semibold text-white">{user.nama}</p>
        </div>
        <SidebarNav sections={sections} />
        <div className="border-t border-brand-800 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-[44px] w-full items-center gap-3 rounded-btn px-3 text-small font-medium text-brand-100 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
            Keluar
          </button>
        </div>
      </aside>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/45"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setDrawerOpen(false)
            }}
            aria-hidden="true"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu panel"
            className="absolute inset-y-0 left-0 flex w-[min(86vw,320px)] flex-col bg-brand-900 shadow-modal"
          >
            <div className="flex h-20 items-center justify-between gap-3 border-b border-brand-800 px-4">
              <BrandWordmark tone="light" />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-btn text-brand-100 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Tutup menu panel"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="border-b border-brand-800 px-4 py-3">
              <p className="text-small font-medium text-brand-300">{panelName}</p>
              <p className="mt-1 truncate text-small font-semibold text-white">{user.nama}</p>
            </div>
            <SidebarNav sections={sections} onNavigate={() => setDrawerOpen(false)} />
            <div className="border-t border-brand-800 p-3">
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-[44px] w-full items-center gap-3 rounded-btn px-3 text-small font-medium text-brand-100 transition-colors hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-20 border-b border-line bg-ivory">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-btn border border-line-strong bg-white px-3 text-small font-semibold text-ink transition-colors hover:bg-brand-50 lg:hidden"
                aria-label="Buka menu panel"
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
                Menu
              </button>
              <p className="hidden truncate text-small font-semibold text-ink sm:block">{panelName}</p>
              <span className="hidden h-4 w-px bg-line sm:block" aria-hidden="true" />
              <p className="hidden items-center gap-2 text-small text-muted md:flex">
                <CalendarDays className="h-4 w-4 text-brand-600" aria-hidden="true" />
                {formatTanggal(todayISO())}
              </p>
            </div>
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="hidden min-w-0 text-right sm:block">
                <p className="truncate text-small font-semibold text-ink">{user.nama}</p>
              </div>
              <span className="inline-flex h-7 items-center rounded-md border border-brand-200 bg-brand-50 px-2 text-small font-semibold text-brand-800">
                {isAdmin ? 'Admin' : 'Penyewa'}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                aria-label="Keluar dari akun"
                className="gap-1.5"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Keluar</span>
              </Button>
            </div>
          </div>
        </header>
        <main className="container-panel">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
