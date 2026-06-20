import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ChatSidebar } from '@/components/organisms/ChatSidebar'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/domains/auth/AuthProvider', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/domains/chat/chat-context', () => ({
  useChatConversations: vi.fn(),
}))

import { useAuth } from '@/domains/auth/AuthProvider'
import { useChatConversations } from '@/domains/chat/chat-context'

const mockUseAuth = vi.mocked(useAuth)
const mockUseChatConversations = vi.mocked(useChatConversations)

describe('ChatSidebar', () => {
  it('renderiza conversas e nome do usuário', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'maria@example.com', name: 'Maria', created_at: '2026-01-01T00:00:00Z' },
      token: 'token-123',
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    })
    mockUseChatConversations.mockReturnValue({
      conversations: [
        {
          id: 'conv-1',
          user_id: '1',
          created_at: '2026-01-01T00:00:00Z',
          messages: [
            {
              id: 'm1',
              conversation_id: 'conv-1',
              content: 'Primeira mensagem',
              sender: 'USER',
              created_at: '2026-01-01T00:00:00Z',
            },
          ],
        },
      ],
      activeConversationId: 'conv-1',
      isLoadingConversations: false,
      pageError: null,
      selectConversation: vi.fn(),
      createNewChat: vi.fn(),
    })

    render(
      <MemoryRouter>
        <ChatSidebar />
      </MemoryRouter>,
    )

    expect(screen.getByText('Maria')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Primeira mensagem' })).toBeInTheDocument()
  })

  it('faz logout e redireciona para login', async () => {
    const user = userEvent.setup()
    const logout = vi.fn()

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'maria@example.com', name: 'Maria', created_at: '2026-01-01T00:00:00Z' },
      token: 'token-123',
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout,
    })
    mockUseChatConversations.mockReturnValue({
      conversations: [],
      activeConversationId: null,
      isLoadingConversations: false,
      pageError: null,
      selectConversation: vi.fn(),
      createNewChat: vi.fn(),
    })

    render(
      <MemoryRouter>
        <ChatSidebar />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Sair' }))

    expect(logout).toHaveBeenCalledOnce()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})
