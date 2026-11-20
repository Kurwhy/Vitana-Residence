import { useEffect, useState } from 'react'
import { Landmark, QrCode, Wallet } from 'lucide-react'
import { formatPeriode, formatRupiah, formatTanggal } from '../lib/utils'
import { Button, Modal } from './ui'

const methods = [
  {
    value: 'qris',
    label: 'QRIS',
    description: 'Pindai kode QR dengan aplikasi bank atau dompet digital.',
    icon: QrCode,
  },
  {
    value: 'bank_transfer',
    label: 'Virtual Account',
    description: 'Transfer melalui mobile banking ke nomor Virtual Account.',
    icon: Landmark,
  },
  {
    value: 'gopay',
    label: 'E-Wallet',
    description: 'Selesaikan pembayaran melalui aplikasi dompet digital.',
    icon: Wallet,
  },
]

export function PaymentModal({ open, onClose, tagihan, onConfirm, processing }) {
  const [method, setMethod] = useState('qris')

  useEffect(() => {
    if (open) setMethod('qris')
  }, [open])

  if (!tagihan) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pembayaran tagihan"
      description="Midtrans belum dikonfigurasi, jadi pembayaran disimulasikan melalui webhook tervalidasi. Status tagihan menjadi lunas setelah simulasi diselesaikan."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={processing}>
            Batal
          </Button>
          <Button onClick={() => onConfirm(method)} loading={processing}>
            Simulasikan Pembayaran
          </Button>
        </>
      }
    >
      <div className="rounded-card border border-line bg-ivory p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-small font-semibold uppercase tracking-wide text-muted">Tagihan</p>
            <p className="mt-1 text-small font-bold tabular text-ink">{tagihan.kode_tagihan}</p>
          </div>
          <div className="text-right">
            <p className="text-small text-muted">Jatuh tempo</p>
            <p className="mt-1 text-small font-semibold tabular text-ink">
              {formatTanggal(tagihan.tanggal_jatuh_tempo)}
            </p>
          </div>
        </div>
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-small text-muted">Nominal tagihan</p>
          <p className="mt-1 text-[26px] font-bold tracking-tight tabular text-brand-800">
            {formatRupiah(tagihan.nominal)}
          </p>
          <p className="mt-1 text-small text-muted">
            Periode {formatPeriode(tagihan.periode_bulan)}
          </p>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="text-small font-semibold text-ink">Pilih metode pembayaran</legend>
        <div className="mt-2 space-y-2">
          {methods.map((item) => {
            const Icon = item.icon
            const selected = method === item.value
            return (
              <label
                key={item.value}
                className={`flex cursor-pointer items-start gap-3 rounded-btn border p-3 transition-colors ${
                  selected
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-line-strong bg-white hover:border-brand-300'
                }`}
              >
                <input
                  type="radio"
                  name="metode-pembayaran"
                  value={item.value}
                  checked={selected}
                  onChange={() => setMethod(item.value)}
                  className="sr-only"
                />
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-btn ${
                    selected ? 'bg-brand-700 text-white' : 'bg-ivory text-brand-700'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-small font-semibold text-ink">{item.label}</span>
                  <span className="mt-0.5 block text-small leading-relaxed text-muted">
                    {item.description}
                  </span>
                </span>
                <span
                  className={`mt-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    selected ? 'border-brand-700' : 'border-line-strong'
                  }`}
                  aria-hidden="true"
                >
                  {selected ? <span className="h-2 w-2 rounded-full bg-brand-700" /> : null}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>
      <p className="mt-4 rounded-btn bg-brand-50 px-3 py-2 text-small leading-relaxed text-brand-800">
        Mode simulasi. Setelah kunci Midtrans diisi dan mode mock dimatikan, tombol ini membuka
        Midtrans Snap dan status tagihan diperbarui melalui webhook yang tervalidasi.
      </p>
    </Modal>
  )
}
