import { useCallback, useEffect, useState } from 'react'
import { createConversation, listConversations } from '@/domains/chat/chat-api'
import { withFirstUserMessage } from '@/domains/chat/utils'
import type { Conversation, Message } from '@/domains/chat/types'

type UseConversationsResult = {
  conversations: Conversation[]
  activeConversationId: string | null
  isLoadingConversations: boolean
  pageError: string | null
  setPageError: (error: string | null) => void
  selectConversation: (id: string) => void
  createNewChat: () => Promise<void>
  applyUserMessage: (conversationId: string, message: Message) => void
}

export function useConversations(): UseConversationsResult {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        let items = await listConversations()
        if (items.length === 0) {
          items = [await createConversation()]
        }

        if (cancelled) return

        setConversations(items)
        setActiveConversationId(items[0].id)
      } catch {
        if (!cancelled) {
          setPageError('Não foi possível carregar as conversas')
        }
      } finally {
        if (!cancelled) {
          setIsLoadingConversations(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const applyUserMessage = useCallback((conversationId: string, message: Message) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? withFirstUserMessage(conversation, message)
          : conversation,
      ),
    )
  }, [])

  const createNewChat = useCallback(async () => {
    setPageError(null)

    try {
      const conversation = await createConversation()
      setConversations((current) => [conversation, ...current])
      setActiveConversationId(conversation.id)
    } catch {
      setPageError('Não foi possível criar uma nova conversa')
    }
  }, [])

  return {
    conversations,
    activeConversationId,
    isLoadingConversations,
    pageError,
    setPageError,
    selectConversation: setActiveConversationId,
    createNewChat,
    applyUserMessage,
  }
}
