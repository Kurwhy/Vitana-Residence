export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayISO() {
  return toISODate(new Date())
}

export function parseDate(iso) {
  return new Date(`${iso}T00:00:00`)
}

export function addDays(iso, days) {
  const date = parseDate(iso)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

export function formatTanggal(iso, options = {}) {
  if (!iso) return '-'

  if (typeof iso === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [year, month, day] = iso.split('-').map(Number)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: options.short ? 'short' : 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, day)))
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: options.short ? 'short' : 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(iso))
}

export function formatTanggalWaktu(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(value))
}

export function formatPeriode(periode) {
  if (!periode) return '-'
  const [year, month] = periode.split('-').map(Number)
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  )
}

export function nextDueDate(cycle, from = new Date()) {
  const day = Math.min(Math.max(Number(cycle) || 1, 1), 28)
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  let candidate = new Date(from.getFullYear(), from.getMonth(), day)
  if (candidate < start) {
    candidate = new Date(from.getFullYear(), from.getMonth() + 1, day)
  }
  return toISODate(candidate)
}

export function cycleFromDate(iso) {
  const day = Number(iso.slice(8, 10))
  return Math.min(Math.max(day, 1), 28)
}

export function monthPrefix(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function dateStamp(date = new Date()) {
  return toISODate(date).replaceAll('-', '')
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 KB'
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function normalizeWhatsApp(value) {
  return String(value || '').replace(/\D/g, '')
}
