import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { AuthLayout, PanelLayout, PublicLayout } from './components/layouts'
import { ProtectedRoute } from './components/ProtectedRoute'

const HomePage = lazy(() => import('./pages/public/HomePage'))
const KamarListPage = lazy(() => import('./pages/public/KamarListPage'))
const KamarDetailPage = lazy(() => import('./pages/public/KamarDetailPage'))
const CekPengajuanPage = lazy(() => import('./pages/public/CekPengajuanPage'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const AdminDashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const AdminKamarPage = lazy(() => import('./pages/admin/KamarListPage'))
const AdminKamarFormPage = lazy(() => import('./pages/admin/KamarFormPage'))
const AdminPengajuanPage = lazy(() => import('./pages/admin/PengajuanListPage'))
const AdminPengajuanDetailPage = lazy(() => import('./pages/admin/PengajuanDetailPage'))
const AdminPenghuniPage = lazy(() => import('./pages/admin/PenghuniPage'))
const AdminTagihanPage = lazy(() => import('./pages/admin/TagihanPage'))
const AdminKeluhanPage = lazy(() => import('./pages/admin/KeluhanListPage'))
const AdminKeluhanDetailPage = lazy(() => import('./pages/admin/KeluhanDetailPage'))
const AdminProfilKosPage = lazy(() => import('./pages/admin/ProfilKosPage'))

const PenyewaDashboardPage = lazy(() => import('./pages/penyewa/DashboardPage'))
const PenyewaTagihanPage = lazy(() => import('./pages/penyewa/TagihanPage'))
const PenyewaKeluhanPage = lazy(() => import('./pages/penyewa/KeluhanPage'))
const PenyewaProfilPage = lazy(() => import('./pages/penyewa/ProfilPage'))

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  return null
}

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-5">
      <div className="flex items-center gap-3 text-small font-medium text-muted" role="status">
        <Loader2 className="h-5 w-5 animate-spin text-brand-700" aria-hidden="true" />
        Memuat halaman
      </div>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="kamar" element={<KamarListPage />} />
            <Route path="kamar/:id" element={<KamarDetailPage />} />
            <Route path="cek-pengajuan" element={<CekPengajuanPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/login" element={<AuthLayout />}>
            <Route index element={<LoginPage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <PanelLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="kamar" element={<AdminKamarPage />} />
            <Route path="kamar/baru" element={<AdminKamarFormPage />} />
            <Route path="kamar/:id/edit" element={<AdminKamarFormPage />} />
            <Route path="pengajuan" element={<AdminPengajuanPage />} />
            <Route path="pengajuan/:id" element={<AdminPengajuanDetailPage />} />
            <Route path="penghuni" element={<AdminPenghuniPage />} />
            <Route path="tagihan" element={<AdminTagihanPage />} />
            <Route path="keluhan" element={<AdminKeluhanPage />} />
            <Route path="keluhan/:id" element={<AdminKeluhanDetailPage />} />
            <Route path="profil-kos" element={<AdminProfilKosPage />} />
          </Route>

          <Route
            path="/penyewa"
            element={
              <ProtectedRoute role="penyewa">
                <PanelLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PenyewaDashboardPage />} />
            <Route path="tagihan" element={<PenyewaTagihanPage />} />
            <Route path="keluhan" element={<PenyewaKeluhanPage />} />
            <Route path="profil" element={<PenyewaProfilPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
