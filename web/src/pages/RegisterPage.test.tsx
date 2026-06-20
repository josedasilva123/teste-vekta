import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/domains/auth/AuthProvider'
import { RegisterPage } from '@/pages/RegisterPage'
import { clearAuthStorage } from '@/lib/storage'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderRegisterPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    clearAuthStorage()
    mockNavigate.mockReset()
    vi.restoreAllMocks()
  })

  it('renderiza formulário de cadastro', () => {
    renderRegisterPage()
    expect(screen.getByRole('heading', { name: 'Crie sua conta' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
  })

  it('cadastra usuário e redireciona para o chat', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({
          access_token: 'token-456',
          token_type: 'bearer',
          user: {
            id: '2',
            email: 'nova@example.com',
            name: 'João',
            created_at: '2026-01-01T00:00:00Z',
          },
        }),
      }),
    )

    renderRegisterPage()

    await user.type(screen.getByLabelText('Nome'), 'João')
    await user.type(screen.getByLabelText('E-mail'), 'nova@example.com')
    await user.type(screen.getByLabelText('Senha'), 'senha12345')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/chat')
    })
  })
})
