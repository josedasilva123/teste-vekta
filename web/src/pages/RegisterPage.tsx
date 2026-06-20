import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { RegisterForm } from '@/components/organisms/RegisterForm'
import { useAuth } from '@/domains/auth/AuthProvider'
import { ApiError } from '@/lib/http'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (payload: { email: string; password: string; name: string }) => {
    setIsLoading(true)
    setError(null)

    try {
      await register(payload)
      navigate('/chat')
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Não foi possível criar a conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Crie sua conta" subtitle="Cadastre-se para começar a conversar">
      <RegisterForm onSubmit={handleSubmit} error={error} isLoading={isLoading} />
    </AuthLayout>
  )
}
