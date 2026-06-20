import type { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from '@/components/organisms/LoginForm'

function renderLoginForm(props: ComponentProps<typeof LoginForm>) {
  return render(
    <MemoryRouter>
      <LoginForm {...props} />
    </MemoryRouter>,
  )
}

describe('LoginForm', () => {
  it('renderiza campos de e-mail e senha', () => {
    renderLoginForm({ onSubmit: vi.fn() })
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('submete credenciais ao enviar o formulário', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    renderLoginForm({ onSubmit })

    await user.type(screen.getByLabelText('E-mail'), 'user@example.com')
    await user.type(screen.getByLabelText('Senha'), 'senha12345')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'senha12345',
    })
  })

  it('exibe erro quando informado', () => {
    renderLoginForm({ onSubmit: vi.fn(), error: 'Credenciais inválidas' })
    expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument()
  })
})
