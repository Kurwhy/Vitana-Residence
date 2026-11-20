import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endpoints } from '../lib/endpoints'

export const qk = {
  publicProfile: ['publik', 'profil-kos'],
  publicKamar: ['publik', 'kamar'],
  publicRoom: (id) => ['publik', 'kamar', Number(id)],
  adminDashboard: ['admin', 'dashboard'],
  adminProfile: ['admin', 'profil-kos'],
  adminKamar: (page) => ['admin', 'kamar', page],
  adminKamarDetail: (id) => ['admin', 'kamar', 'detail', Number(id)],
  adminPengajuan: (page, status) => ['admin', 'pengajuan', page, status],
  adminPengajuanDetail: (id) => ['admin', 'pengajuan', 'detail', Number(id)],
  adminIdentitas: (id) => ['admin', 'pengajuan', Number(id), 'identitas'],
  adminPenghuni: (page, status) => ['admin', 'penghuni', page, status],
  adminTagihan: (page, status) => ['admin', 'tagihan', page, status],
  adminKeluhan: (page, status) => ['admin', 'keluhan', page, status],
  adminKeluhanDetail: (id) => ['admin', 'keluhan', 'detail', Number(id)],
  penyewaDashboard: ['penyewa', 'dashboard'],
  penyewaProfile: ['penyewa', 'profil'],
  penyewaTagihan: ['penyewa', 'tagihan'],
  penyewaKeluhan: ['penyewa', 'keluhan'],
}

export function usePublicProfile() {
  return useQuery({
    queryKey: qk.publicProfile,
    queryFn: endpoints.publik.profil,
    staleTime: 60_000,
  })
}

export function usePublicKamar() {
  return useQuery({
    queryKey: qk.publicKamar,
    queryFn: () => endpoints.publik.kamar(),
    staleTime: 30_000,
  })
}

export function usePublicKamarDetail(id) {
  return useQuery({
    queryKey: qk.publicRoom(id),
    queryFn: () => endpoints.publik.kamarDetail(id),
    enabled: Boolean(id),
  })
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: qk.adminDashboard,
    queryFn: endpoints.admin.dashboard,
  })
}

export function useAdminProfile() {
  return useQuery({
    queryKey: qk.adminProfile,
    queryFn: endpoints.admin.profil.get,
  })
}

export function useAdminKamar(page = 1) {
  return useQuery({
    queryKey: qk.adminKamar(page),
    queryFn: () => endpoints.admin.kamar.list(page),
    placeholderData: keepPreviousData,
  })
}

export function useAdminKamarDetail(id) {
  return useQuery({
    queryKey: qk.adminKamarDetail(id),
    queryFn: () => endpoints.admin.kamar.detail(id),
    enabled: Boolean(id),
  })
}

export function useAdminPengajuan(page = 1, status = 'semua') {
  return useQuery({
    queryKey: qk.adminPengajuan(page, status),
    queryFn: () => endpoints.admin.pengajuan.list(page, status),
    placeholderData: keepPreviousData,
  })
}

export function useAdminPengajuanDetail(id) {
  return useQuery({
    queryKey: qk.adminPengajuanDetail(id),
    queryFn: () => endpoints.admin.pengajuan.detail(id),
    enabled: Boolean(id),
  })
}

export function useAdminPenghuni(page = 1, status = 'aktif') {
  return useQuery({
    queryKey: qk.adminPenghuni(page, status),
    queryFn: () => endpoints.admin.penghuni.list(page, status),
    placeholderData: keepPreviousData,
  })
}

export function useAdminTagihan(page = 1, status = 'semua') {
  return useQuery({
    queryKey: qk.adminTagihan(page, status),
    queryFn: () => endpoints.admin.tagihan.list(page, status),
    placeholderData: keepPreviousData,
  })
}

export function useAdminKeluhan(page = 1, status = 'semua') {
  return useQuery({
    queryKey: qk.adminKeluhan(page, status),
    queryFn: () => endpoints.admin.keluhan.list(page, status),
    placeholderData: keepPreviousData,
  })
}

export function useAdminKeluhanDetail(id) {
  return useQuery({
    queryKey: qk.adminKeluhanDetail(id),
    queryFn: () => endpoints.admin.keluhan.detail(id),
    enabled: Boolean(id),
  })
}

export function usePenyewaDashboard() {
  return useQuery({
    queryKey: qk.penyewaDashboard,
    queryFn: endpoints.penyewa.dashboard,
  })
}

export function usePenyewaProfile() {
  return useQuery({
    queryKey: qk.penyewaProfile,
    queryFn: endpoints.penyewa.profil,
  })
}

export function usePenyewaTagihan() {
  return useQuery({
    queryKey: qk.penyewaTagihan,
    queryFn: endpoints.penyewa.tagihan,
  })
}

export function usePenyewaKeluhan() {
  return useQuery({
    queryKey: qk.penyewaKeluhan,
    queryFn: endpoints.penyewa.keluhan.list,
  })
}
