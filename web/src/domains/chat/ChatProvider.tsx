import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

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

    createConversationForMessage,

    applyUserMessage,

  } = useConversations()



  const pendingMessageRef = useRef<string | null>(null)

  const skipLoadConversationIdRef = useRef<string | null>(null)

  const [isCreatingConversation, setIsCreatingConversation] = useState(false)



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

    canRetry,

    sendMessage: sendWebSocketMessage,

    retryLastMessage,

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



  const shouldSkipInitialLoad = useCallback((conversationId: string) => {

    return skipLoadConversationIdRef.current === conversationId

  }, [])



  const isLoadingMessages = useConversationMessages({

    activeConversationId,

    setMessages,

    clearMessages,

    onLoadError: handleLoadError,

    shouldSkipInitialLoad,

  })



  useEffect(() => {

    if (!activeConversationId || !isConnected || !pendingMessageRef.current) {

      return

    }



    const content = pendingMessageRef.current

    pendingMessageRef.current = null

    skipLoadConversationIdRef.current = null

    setIsCreatingConversation(false)

    sendWebSocketMessage(content)

  }, [activeConversationId, isConnected, sendWebSocketMessage])



  const sendMessage = useCallback(

    (content: string) => {

      const trimmed = content.trim()

      if (!trimmed) {

        return false

      }



      if (activeConversationId) {

        return sendWebSocketMessage(trimmed)

      }



      if (isCreatingConversation) {

        return false

      }



      setPageError(null)

      setIsCreatingConversation(true)

      pendingMessageRef.current = trimmed



      void createConversationForMessage()

        .then((conversation) => {

          skipLoadConversationIdRef.current = conversation.id

        })

        .catch(() => {

          pendingMessageRef.current = null

          setIsCreatingConversation(false)

          setPageError('Não foi possível criar uma nova conversa')

        })



      return true

    },

    [

      activeConversationId,

      createConversationForMessage,

      isCreatingConversation,

      sendWebSocketMessage,

      setPageError,

    ],

  )



  const createNewChat = useCallback(() => {

    setPageError(null)

    pendingMessageRef.current = null

    skipLoadConversationIdRef.current = null

    setIsCreatingConversation(false)

    clearMessages()

    createNewChatBase()

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

      isConnected: activeConversationId

        ? Boolean(isConnected)

        : !isLoadingConversations && !isCreatingConversation,

      isSending: isSending || isCreatingConversation,

      chatError,

      canRetry,

      sendMessage,

      retryLastMessage,

      finalizeStreamingMessage,

    }),

    [

      messages,

      isLoadingMessages,

      activeConversationId,

      isConnected,

      isLoadingConversations,

      isCreatingConversation,

      isSending,

      chatError,

      canRetry,

      sendMessage,

      retryLastMessage,

      finalizeStreamingMessage,

    ],

  )



  return (

    <ChatConversationsContext.Provider value={conversationsValue}>

      <ChatMessagesContext.Provider value={messagesValue}>{children}</ChatMessagesContext.Provider>

    </ChatConversationsContext.Provider>

  )

}


