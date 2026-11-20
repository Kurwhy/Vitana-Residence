import { api } from './api'

function query(params) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'semua') {
      search.set(key, value)
    }
  })
  const suffix = search.toString()
  return suffix ? `?${suffix}` : ''
}

export const endpoints = {
  auth: {
    login: (payload) => api.post('/login', payload, { auth: false }),
    logout: () => api.post('/logout'),
    me: () => api.get('/me'),
    changePassword: (payload) => api.put('/profil/password', payload),
  },

  publik: {
    profil: () => api.get('/publik/profil-kos'),
    kamar: (status) => api.get(`/publik/kamar${query({ status })}`),
    kamarDetail: (id) => api.get(`/publik/kamar/${id}`),
    pengajuan: (formData) => api.post('/publik/pengajuan', formData),
    cekPengajuan: (payload) => api.post('/publik/cek-pengajuan', payload, { auth: false }),
  },

  admin: {
    dashboard: () => api.get('/admin/dashboard'),
    profil: {
      get: () => api.get('/admin/profil-kos'),
      update: (payload) => api.put('/admin/profil-kos', payload),
    },
    kamar: {
      list: (page = 1) => api.get(`/admin/kamar${query({ page })}`),
      detail: (id) => api.get(`/admin/kamar/${id}`),
      create: (formData) => api.post('/admin/kamar', formData),
      update: (id, formData) => {
        formData.append('_method', 'PUT')
        return api.post(`/admin/kamar/${id}`, formData)
      },
      remove: (id) => api.delete(`/admin/kamar/${id}`),
    },
    pengajuan: {
      list: (page = 1, status = 'semua') => api.get(`/admin/pengajuan${query({ page, status })}`),
      detail: (id) => api.get(`/admin/pengajuan/${id}`),
      identitas: (id) => api.getBlob(`/admin/pengajuan/${id}/identitas`),
      setujui: (id) => api.post(`/admin/pengajuan/${id}/setujui`),
      tolak: (id, payload) => api.post(`/admin/pengajuan/${id}/tolak`, payload),
    },
    penghuni: {
      list: (page = 1, status = 'aktif') => api.get(`/admin/penghuni${query({ page, status })}`),
      checkout: (id) => api.post(`/admin/penghuni/${id}/checkout`),
    },
    tagihan: {
      list: (page = 1, status = 'semua') => api.get(`/admin/tagihan${query({ page, status })}`),
      remind: (id) => api.post(`/admin/tagihan/${id}/ingatkan`),
    },
    keluhan: {
      list: (page = 1, status = 'semua') => api.get(`/admin/keluhan${query({ page, status })}`),
      detail: (id) => api.get(`/admin/keluhan/${id}`),
      update: (id, payload) => api.patch(`/admin/keluhan/${id}`, payload),
    },
  },

  penyewa: {
    dashboard: () => api.get('/penyewa/dashboard'),
    tagihan: () => api.get('/penyewa/tagihan'),
    bayar: (id) => api.post(`/penyewa/tagihan/${id}/bayar`),
    keluhan: {
      list: () => api.get('/penyewa/keluhan'),
      create: (formData) => api.post('/penyewa/keluhan', formData),
    },
    profil: () => api.get('/penyewa/profil'),
  },

  webhook: {
    midtrans: (payload) => api.post('/webhooks/midtrans', payload, { auth: false }),
  },
}
