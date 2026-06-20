import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { RegisterForm } from '@/components/organisms/RegisterForm'
import { useAuth } from '@/domains/auth/AuthProvider'
import { useAuthFormAction } from '@/domains/auth/useAuthFormAction'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const { handleSubmit, error, isLoading } = useAuthFormAction({
    action: register,
    onSuccess: () => navigate('/chat'),
    fallbackError: 'Não foi possível criar a conta',
  })

  return (
    <AuthLayout title="Crie sua conta" subtitle="Cadastre-se para começar a conversar">
      <RegisterForm onSubmit={handleSubmit} error={error} isLoading={isLoading} />
    </AuthLayout>
  )
}
