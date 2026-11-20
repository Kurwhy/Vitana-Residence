let loaderPromise = null

export function loadSnapScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Browser tidak tersedia.'))
  if (window.snap?.pay) return Promise.resolve()
  if (loaderPromise) return loaderPromise

  loaderPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-vitana-snap]')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Gagal memuat Snap Midtrans.')))
      return
    }

    const script = document.createElement('script')
    script.src = import.meta.env.VITE_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '')
    script.setAttribute('data-vitana-snap', 'true')
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Gagal memuat Snap Midtrans.'))
    document.body.appendChild(script)
  })

  return loaderPromise
}
