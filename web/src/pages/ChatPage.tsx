import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatLayout } from '@/components/templates/ChatLayout'
import { Sidebar } from '@/components/organisms/Sidebar'
import { ChatWindow } from '@/components/organisms/ChatWindow'
import { ConversationItem } from '@/components/molecules/ConversationItem'
import { useAuth } from '@/domains/auth/AuthProvider'
import { createConversation, getConversation, listConversations } from '@/domains/chat/chat-api'
import { useChatWebSocket } from '@/domains/chat/hooks/useChatWebSocket'
import type { ChatMessage, Conversation } from '@/domains/chat/types'

function conversationTitle(conversation: Conversation): string {
  const firstUserMessage = conversation.messages.find((message) => message.sender === 'USER')
  if (firstUserMessage) {
    return firstUserMessage.content.slice(0, 40) || 'Nova conversa'
  }
  return 'Nova conversa'
}

function mapMessages(messages: Conversation['messages']): ChatMessage[] {
  return messages.map((message) => ({
    id: message.id,
    sender: message.sender,
    content: message.content,
  }))
}

export function ChatPage() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
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

  const handleNewChat = async () => {
    setPageError(null)
    try {
      const conversation = await createConversation()
      setConversations((current) => [conversation, ...current])
      setActiveConversationId(conversation.id)
      setMessages([])
    } catch {
      setPageError('Não foi possível criar uma nova conversa')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <ChatLayout
      sidebar={
        <Sidebar userName={user?.name ?? 'Usuário'} onNewChat={handleNewChat} onLogout={handleLogout}>
          {isLoadingConversations ? (
            <p className="px-3 text-sm text-muted">Carregando...</p>
          ) : conversations.length === 0 ? (
            <p className="px-3 text-sm text-muted">Nenhuma conversa ainda</p>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                id={conversation.id}
                title={conversationTitle(conversation)}
                isActive={conversation.id === activeConversationId}
                onSelect={setActiveConversationId}
              />
            ))
          )}
        </Sidebar>
      }
    >
      {pageError ? (
        <div className="border-b border-red-900/40 bg-red-950/30 px-4 py-2 text-center text-sm text-red-300">
          {pageError}
        </div>
      ) : null}
      <ChatWindow
        messages={messages}
        onSend={sendMessage}
        isSending={isSending}
        isConnected={Boolean(activeConversationId && isConnected)}
        isLoading={isLoadingConversations || isLoadingMessages}
        error={chatError}
        onStreamingTypingComplete={finalizeStreamingMessage}
      />
    </ChatLayout>
  )
}
