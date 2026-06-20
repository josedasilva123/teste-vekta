import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { LoginForm } from '@/components/organisms/LoginForm'
import { useAuth } from '@/domains/auth/AuthProvider'
import { ApiError } from '@/lib/http'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (payload: { email: string; password: string }) => {
    setIsLoading(true)
    setError(null)

    try {
      await login(payload)
      navigate('/chat')
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Não foi possível entrar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Entre para continuar no ChatterBox">
      <LoginForm onSubmit={handleSubmit} error={error} isLoading={isLoading} />
    </AuthLayout>
  )
}
