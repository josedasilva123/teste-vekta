import { useCallback, useMemo, type ReactNode } from 'react'
import { useAuth } from '@/domains/auth/AuthProvider'
import {
  ChatConversationsContext,
  ChatMessagesContext,
} from '@/domains/chat/chat-context'
import { useChatWebSocket } from '@/domains/chat/hooks/useChatWebSocket'
import { useConversationMessages } from '@/domains/chat/hooks/useConversationMessages'
import { useConversations } from '@/domains/chat/hooks/useConversations'
import type { Message } from '@/domains/chat/types'

export function ChatProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const {
    conversations,
    activeConversationId,
    isLoadingConversations,
    pageError,
    setPageError,
    selectConversation,
    createNewChat: createNewChatBase,
    applyUserMessage,
  } = useConversations()

  const handleUserMessage = useCallback(
    (message: Message) => {
      if (!activeConversationId) return
      applyUserMessage(activeConversationId, message)
    },
    [activeConversationId, applyUserMessage],
  )

  const {
    messages,
    isConnected,
    isSending,
    error: chatError,
    sendMessage,
    setMessages,
    clearMessages,
    finalizeStreamingMessage,
  } = useChatWebSocket({
    conversationId: activeConversationId,
    token,
    enabled: !isLoadingConversations && Boolean(activeConversationId),
    onUserMessage: handleUserMessage,
  })

  const handleLoadError = useCallback(() => {
    setPageError('Não foi possível carregar a conversa')
  }, [setPageError])

  const isLoadingMessages = useConversationMessages({
    activeConversationId,
    setMessages,
    clearMessages,
    onLoadError: handleLoadError,
  })

  const createNewChat = useCallback(async () => {
    setPageError(null)
    clearMessages()
    await createNewChatBase()
  }, [clearMessages, createNewChatBase, setPageError])

  const conversationsValue = useMemo(
    () => ({
      conversations,
      activeConversationId,
      isLoadingConversations,
      pageError,
      selectConversation,
      createNewChat,
    }),
    [
      conversations,
      activeConversationId,
      isLoadingConversations,
      pageError,
      selectConversation,
      createNewChat,
    ],
  )

  const messagesValue = useMemo(
    () => ({
      messages,
      isLoadingMessages,
      isConnected: Boolean(activeConversationId && isConnected),
      isSending,
      chatError,
      sendMessage,
      finalizeStreamingMessage,
    }),
    [
      messages,
      isLoadingMessages,
      activeConversationId,
      isConnected,
      isSending,
      chatError,
      sendMessage,
      finalizeStreamingMessage,
    ],
  )

  return (
    <ChatConversationsContext.Provider value={conversationsValue}>
      <ChatMessagesContext.Provider value={messagesValue}>{children}</ChatMessagesContext.Provider>
    </ChatConversationsContext.Provider>
  )
}
