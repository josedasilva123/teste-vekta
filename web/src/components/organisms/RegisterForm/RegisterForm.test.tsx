import type { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { RegisterForm } from '@/components/organisms/RegisterForm'

function renderRegisterForm(props: ComponentProps<typeof RegisterForm>) {
  return render(
    <MemoryRouter>
      <RegisterForm {...props} />
    </MemoryRouter>,
  )
}

describe('RegisterForm', () => {
  it('renderiza campos de cadastro', () => {
    renderRegisterForm({ onSubmit: vi.fn() })
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('submete dados ao enviar o formulário', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    renderRegisterForm({ onSubmit })

    await user.type(screen.getByLabelText('Nome'), 'Maria')
    await user.type(screen.getByLabelText('E-mail'), 'maria@example.com')
    await user.type(screen.getByLabelText('Senha'), 'senha12345')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Maria',
      email: 'maria@example.com',
      password: 'senha12345',
    })
  })

  it('exibe erro quando informado', () => {
    renderRegisterForm({ onSubmit: vi.fn(), error: 'E-mail já cadastrado' })
    expect(screen.getByText('E-mail já cadastrado')).toBeInTheDocument()
  })
})
