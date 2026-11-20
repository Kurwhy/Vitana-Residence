const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')
const TOKEN_KEY = 'vitana_token'

export class ApiError extends Error {
  constructor(message, status, errors = null, payload = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
    this.payload = payload
  }
}

export function getToken() {
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json().catch(() => null)
  }
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function request(path, { method = 'GET', body = null, auth = true, headers = {} } = {}) {
  const token = getToken()
  const isForm = body instanceof FormData
  const requestHeaders = {
    Accept: 'application/json',
    ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isForm && body !== null ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  }

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: requestHeaders,
      body: body === null ? undefined : isForm ? body : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Tidak dapat terhubung ke server Vitana Residence.', 0, null, null)
  }

  const data = await parseResponse(response)

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearToken()
      window.dispatchEvent(new CustomEvent('vitana:unauthorized'))
    }
    throw new ApiError(
      data?.message || 'Terjadi kesalahan saat memproses permintaan.',
      response.status,
      data?.errors || null,
      data,
    )
  }

  return data
}

async function getBlob(path) {
  const token = getToken()
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: {
        Accept: 'image/*',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  } catch {
    throw new ApiError('Tidak dapat memuat file.', 0)
  }

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearToken()
      window.dispatchEvent(new CustomEvent('vitana:unauthorized'))
    }
    throw new ApiError('File tidak dapat dimuat.', response.status)
  }

  return response.blob()
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  getBlob,
}
