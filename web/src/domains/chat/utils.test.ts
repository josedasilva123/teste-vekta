import { describe, expect, it } from 'vitest'
import { conversationTitle, withFirstUserMessage } from '@/domains/chat/utils'
import type { Conversation, Message } from '@/domains/chat/types'

const baseConversation: Conversation = {
  id: 'conv-1',
  user_id: 'user-1',
  messages: [],
  created_at: '2026-01-01T00:00:00.000Z',
}

const userMessage: Message = {
  id: 'msg-1',
  conversation_id: 'conv-1',
  sender: 'USER',
  content: 'Olá, preciso de ajuda com meu projeto',
  created_at: '2026-01-01T00:00:01.000Z',
}

describe('withFirstUserMessage', () => {
  it('adiciona a primeira mensagem do usuário', () => {
    const updated = withFirstUserMessage(baseConversation, userMessage)

    expect(updated.messages).toHaveLength(1)
    expect(conversationTitle(updated)).toBe('Olá, preciso de ajuda com meu projeto')
  })

  it('não substitui conversas que já possuem mensagem do usuário', () => {
    const conversation = withFirstUserMessage(baseConversation, userMessage)
    const anotherMessage: Message = {
      ...userMessage,
      id: 'msg-2',
      content: 'Outra mensagem',
    }

    const updated = withFirstUserMessage(conversation, anotherMessage)

    expect(updated.messages).toHaveLength(1)
    expect(updated.messages[0].id).toBe('msg-1')
  })
})
