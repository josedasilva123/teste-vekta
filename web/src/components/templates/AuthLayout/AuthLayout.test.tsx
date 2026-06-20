import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthLayout } from '@/components/templates/AuthLayout'

describe('AuthLayout', () => {
  it('renderiza título, subtítulo e conteúdo', () => {
    render(
      <AuthLayout title="Bem-vindo" subtitle="Entre na sua conta">
        <p>Formulário aqui</p>
      </AuthLayout>,
    )

    expect(screen.getByRole('heading', { name: 'Bem-vindo' })).toBeInTheDocument()
    expect(screen.getByText('Entre na sua conta')).toBeInTheDocument()
    expect(screen.getByText('Formulário aqui')).toBeInTheDocument()
    expect(screen.getByText('ChatterBox')).toBeInTheDocument()
  })
})
