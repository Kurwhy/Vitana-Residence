import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getToken, setToken, clearToken } from '../lib/api'
import { endpoints } from '../lib/endpoints'
import { useToast } from './ToastContext'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { push } = useToast()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const handleUnauthorized = () => {
      if (!active) return
      setUser(null)
      setLoading(false)
      push('Sesi Anda berakhir. Silakan masuk kembali.', 'error')
    }

    window.addEventListener('vitana:unauthorized', handleUnauthorized)

    if (!getToken()) {
      setLoading(false)
    } else {
      endpoints.auth
        .me()
        .then((response) => {
          if (active) setUser(response.user)
        })
        .catch(() => {
          if (active) {
            clearToken()
            setUser(null)
          }
        })
        .finally(() => {
          if (active) setLoading(false)
        })
    }

    return () => {
      active = false
      window.removeEventListener('vitana:unauthorized', handleUnauthorized)
    }
  }, [push])

  const login = useCallback(async (email, password) => {
    const response = await endpoints.auth.login({ email, password })
    setToken(response.token)
    setUser(response.user)
    return response.user
  }, [])

  const logout = useCallback(async () => {
    try {
      if (getToken()) await endpoints.auth.logout()
    } catch {
      // Local session is cleared even when the server is unreachable.
    } finally {
      clearToken()
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return context
}
