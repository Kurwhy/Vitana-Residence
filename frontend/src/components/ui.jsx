import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Inbox,
  Loader2,
  Plus,
  X,
} from 'lucide-react'
import { STATUS_BADGE } from '../lib/status'
import { cn } from '../lib/utils'

const baseButton =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-btn border text-small font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:pointer-events-none disabled:opacity-50'

const buttonVariants = {
  primary: 'border-brand-700 bg-brand-700 text-white hover:border-brand-800 hover:bg-brand-800 active:bg-brand-900',
  secondary: 'border-line-strong bg-white text-ink hover:border-brand-300 hover:bg-brand-50 active:bg-brand-100',
  ghost: 'border-transparent bg-transparent text-brand-800 hover:bg-brand-50 active:bg-brand-100',
  danger: 'border-danger bg-danger text-white hover:border-red-800 hover:bg-red-800',
  link: 'min-h-0 border-transparent bg-transparent px-0 text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-900',
  'subtle-danger': 'border-red-200 bg-white text-danger hover:border-red-300 hover:bg-red-50',
  inverse: 'border-white bg-white text-brand-900 hover:border-brand-50 hover:bg-brand-50 active:bg-brand-100',
}

const buttonSizes = {
  sm: 'px-3',
  md: 'px-4',
  lg: 'min-h-[48px] px-5 text-base',
  icon: 'h-11 w-11 p-0',
}

export function buttonStyles({ variant = 'primary', size = 'md', className } = {}) {
  return cn(baseButton, buttonVariants[variant], buttonSizes[size], className)
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  )
}

export function Field({ label, htmlFor, required, hint, error, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? (
        <label htmlFor={htmlFor} className="block text-small font-semibold text-ink">
          {label}
          {required ? <span className="text-danger" aria-hidden="true"> *</span> : null}
        </label>
      ) : null}
      {children}
      {hint && !error ? <p className="text-small leading-relaxed text-muted">{hint}</p> : null}
      {error ? (
        <p className="flex items-start gap-1.5 text-small font-medium text-danger" role="alert">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  )
}

const controlClasses =
  'w-full rounded-btn border bg-white px-3.5 text-base text-ink transition-colors placeholder:text-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:bg-brand-50/50 disabled:text-muted'

export function Input({ className, error, ...props }) {
  return (
    <input
      className={cn(
        controlClasses,
        'h-11',
        error ? 'border-danger focus:border-danger focus:ring-red-100' : 'border-line-strong',
        className,
      )}
      aria-invalid={error ? 'true' : undefined}
      {...props}
    />
  )
}

export function Textarea({ className, error, rows = 5, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cn(
        controlClasses,
        'min-h-[120px] py-2.5 leading-relaxed',
        error ? 'border-danger focus:border-danger focus:ring-red-100' : 'border-line-strong',
        className,
      )}
      aria-invalid={error ? 'true' : undefined}
      {...props}
    />
  )
}

export function Select({ className, error, children, ...props }) {
  return (
    <div className="relative">
      <select
        className={cn(
          controlClasses,
          'h-11 appearance-none pr-10',
          error ? 'border-danger focus:border-danger focus:ring-red-100' : 'border-line-strong',
          className,
        )}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
    </div>
  )
}

export function FileUpload({
  id,
  accept = 'image/jpeg,image/png',
  multiple = false,
  onChange,
  previewUrl,
  error,
  disabled,
  hintId,
}) {
  const [names, setNames] = useState([])

  const handleChange = (event) => {
    const files = Array.from(event.target.files || [])
    setNames(files.map((file) => file.name))
    onChange?.(event)
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={cn(
          'flex min-h-[88px] cursor-pointer items-center gap-3 rounded-btn border border-dashed bg-white px-4 py-3 transition-colors hover:bg-brand-50 focus-within:ring-2 focus-within:ring-brand-200',
          error ? 'border-danger' : 'border-line-strong',
          disabled && 'cursor-not-allowed opacity-60 hover:bg-white',
        )}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-brand-50 text-brand-700">
          <ImagePlus className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-small font-semibold text-ink">
            {multiple ? 'Pilih beberapa foto' : 'Pilih file foto'}
          </span>
          <span className="mt-0.5 block text-small text-muted">
            JPG, JPEG, atau PNG. Maksimal 2 MB per foto.
          </span>
        </span>
        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          aria-describedby={hintId}
        />
      </label>
      {previewUrl ? (
        <div className="overflow-hidden rounded-btn border border-line bg-ivory">
          <img
            src={previewUrl}
            alt="Pratinjau foto yang dipilih"
            width="640"
            height="360"
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      ) : null}
      {names.length > 0 ? (
        <p className="break-words text-small leading-relaxed text-muted">
          {names.length === 1 ? names[0] : `${names.length} file dipilih: ${names.join(', ')}`}
        </p>
      ) : null}
    </div>
  )
}

export function StatusBadge({ status, className }) {
  const item = STATUS_BADGE[status] || {
    label: status,
    classes: 'border-line bg-ivory text-muted',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-small font-semibold leading-5',
        item.classes,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {item.label}
    </span>
  )
}

export function PageHeader({ title, description, eyebrow, children }) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-brand-600" aria-hidden="true" />
            <p className="text-small font-semibold text-brand-700">{eyebrow}</p>
          </div>
        ) : null}
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-panel-h1">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-prose text-small leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  )
}

export function Pagination({ page, totalItems, pageSize = 15, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex flex-col gap-3 border-t border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-small text-muted">
        Menampilkan <span className="tabular font-medium text-ink">{from}</span> sampai{' '}
        <span className="tabular font-medium text-ink">{to}</span> dari{' '}
        <span className="tabular font-medium text-ink">{totalItems}</span> data
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Sebelumnya
        </Button>
        <span className="px-1 text-small font-semibold tabular text-muted">
          {page} / {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Halaman berikutnya"
        >
          Berikutnya
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-card border border-dashed border-line-strong bg-white px-6 py-12 text-center',
        className,
      )}
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="text-h3 font-semibold text-ink">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-md text-small leading-relaxed text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-btn bg-brand-100/70', className)} />
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) {
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef(null)
  const previousFocus = useRef(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    previousFocus.current = document.activeElement
    const panel = panelRef.current
    const focusable = panel
      ? Array.from(
          panel.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        )
      : []

    const focusTarget = focusable[0] || panel
    window.setTimeout(() => focusTarget?.focus(), 0)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current?.()
        return
      }
      if (event.key !== 'Tab' || focusable.length === 0) return
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
      if (previousFocus.current instanceof HTMLElement) {
        previousFocus.current.focus()
      }
    }
  }, [open])

  if (!open) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/45 p-0 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCloseRef.current?.()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'max-h-[92vh] w-full overflow-y-auto rounded-t-modal bg-white shadow-modal sm:rounded-modal',
          sizes[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-h3 font-bold text-ink">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-small leading-relaxed text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onCloseRef.current?.()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn text-muted transition-colors hover:bg-ivory hover:text-ink"
            aria-label="Tutup dialog"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-6">{children}</div>
        {footer ? (
          <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}

export function FilterTabs({ options, value, onChange, label = 'Filter status' }) {
  return (
    <div
      className="inline-flex max-w-full flex-wrap gap-1 rounded-btn border border-line bg-white p-1"
      role="group"
      aria-label={label}
    >
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn(
              'inline-flex min-h-[44px] items-center rounded-[6px] px-3.5 text-small font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1',
              active
                ? 'bg-brand-700 text-white'
                : 'bg-transparent text-muted hover:bg-brand-50 hover:text-brand-800',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export function SectionLabel({ index, children, tone = 'default' }) {
  const light = tone === 'light'
  return (
    <div className="flex items-center gap-3">
      {index ? (
        <span
          className={cn(
            'text-small font-semibold tabular',
            light ? 'text-brand-300' : 'text-brand-700',
          )}
        >
          {index}
        </span>
      ) : null}
      <span className={cn('h-px w-8', light ? 'bg-brand-400' : 'bg-brand-300')} aria-hidden="true" />
      <span className={cn('text-small font-semibold', light ? 'text-brand-100' : 'text-brand-700')}>
        {children}
      </span>
    </div>
  )
}


export function ListField({
  label,
  items,
  onChange,
  addLabel = 'Tambah item',
  placeholder,
  error,
  hint,
  maxLength,
}) {
  const updateItem = (index, value) => {
    const next = [...items]
    next[index] = value
    onChange(next)
  }

  const removeItem = (index) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <fieldset className="space-y-1.5">
      <legend className="block text-small font-semibold text-ink">{label}</legend>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder={placeholder}
              aria-label={`${label} ${index + 1}`}
              maxLength={maxLength}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              aria-label={`Hapus ${label.toLowerCase()} ${index + 1}`}
              className="shrink-0 text-muted hover:text-danger"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="secondary" size="sm" onClick={() => onChange([...items, ''])}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        {addLabel}
      </Button>
      {hint && !error ? <p className="text-small leading-relaxed text-muted">{hint}</p> : null}
      {error ? (
        <p className="flex items-start gap-1.5 text-small font-medium text-danger" role="alert">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}

export function LoadingState({ label = 'Memuat data' }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-card border border-line bg-white px-6 py-12">
      <div className="flex items-center gap-3 text-small font-medium text-muted" role="status">
        <Loader2 className="h-5 w-5 animate-spin text-brand-700" aria-hidden="true" />
        {label}
      </div>
    </div>
  )
}

export function ErrorState({
  title = 'Data gagal dimuat',
  description = 'Periksa koneksi ke server Vitana Residence, lalu coba lagi.',
  onRetry,
  action,
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      action={
        action ||
        (onRetry ? (
          <Button variant="secondary" onClick={onRetry}>
            Coba lagi
          </Button>
        ) : null)
      }
      className="border-red-200"
    />
  )
}

export function TableSkeleton({ rows = 6, columns = 5 }) {
  return (
    <div className="table-shell" aria-hidden="true">
      <div className="min-w-[820px]">
        <div className="flex gap-4 border-b border-line bg-brand-50/60 px-4 py-3">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex h-[52px] items-center gap-4 border-b border-line px-4 last:border-0"
          >
            {Array.from({ length: columns }).map((_, cellIndex) => (
              <Skeleton key={cellIndex} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
