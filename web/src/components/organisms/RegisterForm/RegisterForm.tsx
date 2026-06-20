import { Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'

type RegisterFormProps = {
  onSubmit: (payload: { email: string; password: string; name: string }) => Promise<void>
  error?: string | null
  isLoading?: boolean
}

export function RegisterForm({ onSubmit, error, isLoading = false }: RegisterFormProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    await onSubmit({
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      name: String(formData.get('name') ?? ''),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Nome" htmlFor="name">
        <Input id="name" name="name" type="text" autoComplete="name" required minLength={2} />
      </FormField>

      <FormField label="E-mail" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </FormField>

      <FormField label="Senha" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </FormField>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Criar conta
      </Button>

      <p className="text-center text-sm text-muted">
        Já tem conta?{' '}
        <Link to="/login" className="text-accent hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  )
}
