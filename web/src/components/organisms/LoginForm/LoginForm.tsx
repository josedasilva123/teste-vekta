import { Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'

type LoginFormProps = {
  onSubmit: (payload: { email: string; password: string }) => Promise<void>
  error?: string | null
  isLoading?: boolean
}

export function LoginForm({ onSubmit, error, isLoading = false }: LoginFormProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    await onSubmit({
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="E-mail" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </FormField>

      <FormField label="Senha" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
        />
      </FormField>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Entrar
      </Button>

      <p className="text-center text-sm text-muted">
        Não tem conta?{' '}
        <Link to="/cadastro" className="text-accent hover:underline">
          Cadastre-se
        </Link>
      </p>
    </form>
  )
}
