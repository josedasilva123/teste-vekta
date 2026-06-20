import { useEffect, useState } from 'react'
import { getConversation } from '@/domains/chat/chat-api'
import { mapMessages } from '@/domains/chat/utils'

type UseConversationMessagesOptions = {
  activeConversationId: string | null
  setMessages: (messages: ReturnType<typeof mapMessages>) => void
  clearMessages: () => void
  onLoadError: () => void
}

export function useConversationMessages({
  activeConversationId,
  setMessages,
  clearMessages,
  onLoadError,
}: UseConversationMessagesOptions): boolean {
  const [loadedConversationId, setLoadedConversationId] = useState<string | null>(null)
  const isLoadingMessages =
    Boolean(activeConversationId) && loadedConversationId !== activeConversationId

  useEffect(() => {
    if (!activeConversationId) {
      clearMessages()
      return
    }

    let cancelled = false

    getConversation(activeConversationId)
      .then((conversation) => {
        if (cancelled) return
        setMessages(mapMessages(conversation.messages))
        setLoadedConversationId(activeConversationId)
      })
      .catch(() => {
        if (cancelled) return
        onLoadError()
        setLoadedConversationId(activeConversationId)
      })

    return () => {
      cancelled = true
    }
  }, [activeConversationId, setMessages, clearMessages, onLoadError])

  return isLoadingMessages
}
