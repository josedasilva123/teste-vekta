import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/domains/auth/AuthProvider'
import { GuestRoute, ProtectedRoute } from '@/routes/ProtectedRoute'
import { clearAuthStorage, setStoredToken, setStoredUser } from '@/lib/storage'

function renderRoutes(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<div>Página de login</div>} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<div>Área do chat</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    clearAuthStorage()
    vi.restoreAllMocks()
  })

  it('redireciona visitante não autenticado para login ao acessar /chat', async () => {
    vi.stubGlobal('fetch', vi.fn())
    renderRoutes('/chat')

    await waitFor(() => {
      expect(screen.getByText('Página de login')).toBeInTheDocument()
    })
  })

  it('permite acesso autenticado ao chat', async () => {
    setStoredToken('token-valido')
    setStoredUser({
      id: '1',
      email: 'user@example.com',
      name: 'Maria',
      created_at: '2026-01-01T00:00:00Z',
    })

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          id: '1',
          email: 'user@example.com',
          name: 'Maria',
          created_at: '2026-01-01T00:00:00Z',
        }),
      }),
    )

    renderRoutes('/chat')

    expect(await screen.findByText('Área do chat')).toBeInTheDocument()
  })

  it('redireciona usuário autenticado para o chat ao acessar login', async () => {
    setStoredToken('token-valido')
    setStoredUser({
      id: '1',
      email: 'user@example.com',
      name: 'Maria',
      created_at: '2026-01-01T00:00:00Z',
    })

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          id: '1',
          email: 'user@example.com',
          name: 'Maria',
          created_at: '2026-01-01T00:00:00Z',
        }),
      }),
    )

    renderRoutes('/login')

    expect(await screen.findByText('Área do chat')).toBeInTheDocument()
  })
})
