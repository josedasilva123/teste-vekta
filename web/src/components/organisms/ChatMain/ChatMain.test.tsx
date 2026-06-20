import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ChatMain } from '@/components/organisms/ChatMain'

vi.mock('@/domains/chat/chat-context', () => ({
  useChatConversations: vi.fn(),
  useChatMessages: vi.fn(),
}))

import { useChatConversations, useChatMessages } from '@/domains/chat/chat-context'

const mockUseChatConversations = vi.mocked(useChatConversations)
const mockUseChatMessages = vi.mocked(useChatMessages)

describe('ChatMain', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
  })
  it('exibe erro da página quando presente', () => {
    mockUseChatConversations.mockReturnValue({
      conversations: [],
      activeConversationId: null,
      isLoadingConversations: false,
      pageError: 'Erro ao carregar conversas',
      selectConversation: vi.fn(),
      createNewChat: vi.fn(),
    })
    mockUseChatMessages.mockReturnValue({
      messages: [],
      isLoadingMessages: false,
      isConnected: true,
      isSending: false,
      chatError: null,
      sendMessage: vi.fn(),
      finalizeStreamingMessage: vi.fn(),
    })

    render(<ChatMain />)
    expect(screen.getByText('Erro ao carregar conversas')).toBeInTheDocument()
  })

  it('renderiza janela de chat com mensagens', () => {
    mockUseChatConversations.mockReturnValue({
      conversations: [],
      activeConversationId: null,
      isLoadingConversations: false,
      pageError: null,
      selectConversation: vi.fn(),
      createNewChat: vi.fn(),
    })
    mockUseChatMessages.mockReturnValue({
      messages: [
        {
          id: '1',
          sender: 'USER',
          content: 'Mensagem de teste',
        },
      ],
      isLoadingMessages: false,
      isConnected: true,
      isSending: false,
      chatError: null,
      sendMessage: vi.fn(),
      finalizeStreamingMessage: vi.fn(),
    })

    render(<ChatMain />)
    expect(screen.getByText('Mensagem de teste')).toBeInTheDocument()
  })
})
