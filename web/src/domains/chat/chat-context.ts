import { createContext, useContext } from 'react'
import type { ChatMessage, Conversation } from '@/domains/chat/types'

export type ChatConversationsContextValue = {
  conversations: Conversation[]
  activeConversationId: string | null
  isLoadingConversations: boolean
  pageError: string | null
  selectConversation: (id: string) => void
  createNewChat: () => void
}

export type ChatMessagesContextValue = {
  messages: ChatMessage[]
  isLoadingMessages: boolean
  isConnected: boolean
  isSending: boolean
  chatError: string | null
  canRetry: boolean
  sendMessage: (content: string) => boolean
  retryLastMessage: () => boolean
  finalizeStreamingMessage: () => void
}

export const ChatConversationsContext = createContext<ChatConversationsContextValue | null>(null)
export const ChatMessagesContext = createContext<ChatMessagesContextValue | null>(null)

export function useChatConversations(): ChatConversationsContextValue {
  const context = useContext(ChatConversationsContext)
  if (!context) {
    throw new Error('useChatConversations deve ser usado dentro de ChatProvider')
  }
  return context
}

export function useChatMessages(): ChatMessagesContextValue {
  const context = useContext(ChatMessagesContext)
  if (!context) {
    throw new Error('useChatMessages deve ser usado dentro de ChatProvider')
  }
  return context
}
