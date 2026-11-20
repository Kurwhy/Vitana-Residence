import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { endpoints } from '../lib/endpoints'
import { loadSnapScript } from '../lib/midtrans'
import { METODE_PEMBAYARAN } from '../lib/status'
import { formatPeriode, formatRupiah } from '../lib/utils'

export function usePaymentFlow() {
  const queryClient = useQueryClient()
  const { push } = useToast()
  const [mockBill, setMockBill] = useState(null)
  const [mockNotification, setMockNotification] = useState(null)
  const [processingMock, setProcessingMock] = useState(false)
  const [startingId, setStartingId] = useState(null)
  const payMutation = useMutation({ mutationFn: (id) => endpoints.penyewa.bayar(id) })

  const refreshBilling = () => {
    queryClient.invalidateQueries({ queryKey: ['penyewa'] })
    queryClient.invalidateQueries({ queryKey: ['admin'] })
  }

  const scheduleRefresh = () => {
    refreshBilling()
    window.setTimeout(refreshBilling, 2500)
    window.setTimeout(refreshBilling, 6000)
  }

  const startPayment = async (tagihan) => {
    if (!tagihan) return
    setStartingId(tagihan.id)
    try {
      const response = await payMutation.mutateAsync(tagihan.id)
      const data = response.data

      if (data.mock) {
        setMockBill(tagihan)
        setMockNotification(data.mock_notification)
        return
      }

      await loadSnapScript()
      window.snap.pay(data.snap_token, {
        onSuccess: () => {
          push('Pembayaran berhasil. Status tagihan diperbarui otomatis.', 'success')
          scheduleRefresh()
        },
        onPending: () => {
          push('Pembayaran sedang menunggu penyelesaian.', 'info')
          scheduleRefresh()
        },
        onError: () => {
          push('Pembayaran belum berhasil. Silakan coba lagi.', 'error')
        },
      })
    } catch (error) {
      push(error.message || 'Permintaan pembayaran gagal diproses.', 'error')
    } finally {
      setStartingId(null)
    }
  }

  const confirmMockPayment = async (method) => {
    if (!mockNotification || !mockBill) return
    setProcessingMock(true)
    try {
      await endpoints.webhook.midtrans({
        ...mockNotification,
        payment_type: method,
      })
      push(
        `Tagihan bulan ${formatPeriode(mockBill.periode_bulan)} sebesar ${formatRupiah(mockBill.nominal)} telah lunas melalui ${METODE_PEMBAYARAN[method] || method}.`,
        'success',
      )
      setMockBill(null)
      setMockNotification(null)
      refreshBilling()
    } catch (error) {
      push(error.message || 'Simulasi pembayaran gagal diproses.', 'error')
    } finally {
      setProcessingMock(false)
    }
  }

  const closeMockPayment = () => {
    if (processingMock) return
    setMockBill(null)
    setMockNotification(null)
  }

  return {
    startPayment,
    startingId,
    startLoading: payMutation.isPending,
    mockOpen: Boolean(mockBill),
    mockBill,
    closeMockPayment,
    confirmMockPayment,
    processingMock,
  }
}
