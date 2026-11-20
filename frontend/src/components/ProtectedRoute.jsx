import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-5">
        <div className="flex items-center gap-3 text-small font-medium text-muted" role="status">
          <Loader2 className="h-5 w-5 animate-spin text-brand-700" aria-hidden="true" />
          Memeriksa sesi
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (user.role !== role) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin/dashboard' : '/penyewa/dashboard'}
        replace
      />
    )
  }

  return children
}
