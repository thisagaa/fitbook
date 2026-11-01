import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface ProtectedRouteProps {
  /** When true, only admins may enter. */
  adminOnly?: boolean
}

export default function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  const session = useAuthStore((s) => s.session)
  const checkExpiry = useAuthStore((s) => s.checkExpiry)
  const location = useLocation()

  if (!session || !checkExpiry()) {
    return <Navigate to="/login" replace state={{ from: location.pathname, expired: session !== null }} />
  }
  if (adminOnly && session.user.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
