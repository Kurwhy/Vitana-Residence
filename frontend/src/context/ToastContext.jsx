import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '../lib/utils'

const ToastContext = createContext(null)

const icons = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
}

const styles = {
  success: 'border-green-200 text-green-800',
  error: 'border-red-200 text-red-800',
  info: 'border-brand-200 text-brand-800',
}

const iconStyles = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-brand-700',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (message, type = 'success') => {
      const id = Date.now() + Math.random()
      setToasts((current) => [...current, { id, message, type }].slice(-3))
      const timer = window.setTimeout(() => dismiss(id), 4000)
      timers.current.set(id, timer)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col items-end gap-2 sm:left-auto sm:w-[380px]"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info
          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                'pointer-events-auto flex w-full items-start gap-3 rounded-card border bg-white p-4 shadow-dropdown',
                styles[toast.type] || styles.info,
              )}
            >
              <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconStyles[toast.type] || iconStyles.info)} aria-hidden="true" />
              <p className="min-w-0 flex-1 text-small font-medium leading-relaxed">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn text-muted transition-colors hover:bg-ivory hover:text-ink"
                aria-label="Tutup notifikasi"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast harus dipakai di dalam ToastProvider')
  return context
}
