import { Navigate, Outlet } from 'react-router-dom'
import { Spinner } from '@/components/atoms/Spinner'
import { useAuth } from '@/domains/auth/AuthProvider'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-surface">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-sidebar">
        <Spinner />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />
  }

  return <Outlet />
}
