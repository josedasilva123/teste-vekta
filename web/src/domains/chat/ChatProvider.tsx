import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/domains/auth/AuthProvider'
import { createConversation, getConversation, listConversations } from '@/domains/chat/chat-api'
import { useChatWebSocket } from '@/domains/chat/hooks/useChatWebSocket'
import { mapMessages } from '@/domains/chat/utils'
import type { ChatMessage, Conversation } from '@/domains/chat/types'

type ChatContextValue = {
  conversations: Conversation[]
  activeConversationId: string | null
  messages: ChatMessage[]
  isLoadingConversations: boolean
  isLoadingMessages: boolean
  isConnected: boolean
  isSending: boolean
  pageError: string | null
  chatError: string | null
  selectConversation: (id: string) => void
  createNewChat: () => Promise<void>
  sendMessage: (content: string) => void
  finalizeStreamingMessage: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  const refreshConversations = useCallback(async () => {
    const items = await listConversations()
    setConversations(items)
    return items
  }, [])

  const handleConversationUpdated = useCallback(() => {
    refreshConversations().catch(() => undefined)
  }, [refreshConversations])

  useEffect(() => {
    refreshConversations()
      .then(async (items) => {
        if (items.length > 0) {
          setActiveConversationId(items[0].id)
          return
        }

        const conversation = await createConversation()
        setConversations([conversation])
        setActiveConversationId(conversation.id)
      })
      .catch(() => setPageError('Não foi possível carregar as conversas'))
      .finally(() => setIsLoadingConversations(false))
  }, [refreshConversations])

  const {
    messages,
    isConnected,
    isSending,
    error: chatError,
    sendMessage,
    setMessages,
    finalizeStreamingMessage,
  } = useChatWebSocket({
    conversationId: activeConversationId,
    token,
    enabled: !isLoadingConversations && Boolean(activeConversationId),
    onConversationUpdated: handleConversationUpdated,
  })

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([])
      return
    }

    setIsLoadingMessages(true)
    getConversation(activeConversationId)
      .then((conversation) => setMessages(mapMessages(conversation.messages)))
      .catch(() => setPageError('Não foi possível carregar a conversa'))
      .finally(() => setIsLoadingMessages(false))
  }, [activeConversationId, setMessages])

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id)
  }, [])

  const createNewChat = useCallback(async () => {
    setPageError(null)
    try {
      const conversation = await createConversation()
      setConversations((current) => [conversation, ...current])
      setActiveConversationId(conversation.id)
      setMessages([])
    } catch {
      setPageError('Não foi possível criar uma nova conversa')
    }
  }, [setMessages])

  const value = useMemo(
    () => ({
      conversations,
      activeConversationId,
      messages,
      isLoadingConversations,
      isLoadingMessages,
      isConnected: Boolean(activeConversationId && isConnected),
      isSending,
      pageError,
      chatError,
      selectConversation,
      createNewChat,
      sendMessage,
      finalizeStreamingMessage,
    }),
    [
      conversations,
      activeConversationId,
      messages,
      isLoadingConversations,
      isLoadingMessages,
      isConnected,
      isSending,
      pageError,
      chatError,
      selectConversation,
      createNewChat,
      sendMessage,
      finalizeStreamingMessage,
    ],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat(): ChatContextValue {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat deve ser usado dentro de ChatProvider')
  }
  return context
}
