import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { LoginForm } from '@/components/organisms/LoginForm'
import { useAuth } from '@/domains/auth/AuthProvider'
import { useAuthFormAction } from '@/domains/auth/useAuthFormAction'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { handleSubmit, error, isLoading } = useAuthFormAction({
    action: login,
    onSuccess: () => navigate('/chat'),
    fallbackError: 'Não foi possível entrar',
  })

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Entre para continuar no ChatterBox">
      <LoginForm onSubmit={handleSubmit} error={error} isLoading={isLoading} />
    </AuthLayout>
  )
}
