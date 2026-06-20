import { useCallback, useEffect, useRef, useState } from 'react'
import { buildWsUrl } from '@/config/env'
import type { ChatMessage, WsIncomingEvent } from '@/domains/chat/types'

type UseChatWebSocketOptions = {
  conversationId: string | null
  token: string | null
  enabled?: boolean
  onConversationUpdated?: () => void
}

type UseChatWebSocketResult = {
  messages: ChatMessage[]
  streamingText: string
  isConnected: boolean
  isSending: boolean
  error: string | null
  sendMessage: (content: string) => void
  setMessages: (messages: ChatMessage[]) => void
  finalizeStreamingMessage: () => void
}

function closeWebSocket(ws: WebSocket): void {
  ws.onopen = null
  ws.onclose = null
  ws.onerror = null
  ws.onmessage = null

  if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
    ws.close()
  }
}

export function useChatWebSocket({
  conversationId,
  token,
  enabled = true,
  onConversationUpdated,
}: UseChatWebSocketOptions): UseChatWebSocketResult {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamingText, setStreamingText] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [awaitingFinalize, setAwaitingFinalize] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const streamingIdRef = useRef<string>('streaming-ai')
  const pendingFinalMessageRef = useRef<ChatMessage | null>(null)
  const onConversationUpdatedRef = useRef(onConversationUpdated)

  onConversationUpdatedRef.current = onConversationUpdated

  useEffect(() => {
    if (!enabled || !conversationId || !token) {
      setIsConnected(false)
      return
    }

    const ws = new WebSocket(
      buildWsUrl(`/api/v1/conversations/${conversationId}/ws`, token),
    )
    wsRef.current = ws

    ws.onopen = () => {
      setIsConnected(true)
      setError(null)
    }

    ws.onclose = () => {
      setIsConnected(false)
      if (wsRef.current === ws) {
        wsRef.current = null
      }
    }

    ws.onerror = () => {
      setError('Falha na conexão com o chat')
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as WsIncomingEvent

      if (data.type === 'user_message') {
        setMessages((current) => [
          ...current.filter((message) => message.id !== data.message.id),
          {
            id: data.message.id,
            sender: data.message.sender,
            content: data.message.content,
          },
        ])
        return
      }

      if (data.type === 'chunk') {
        setStreamingText((current) => current + data.content)
        return
      }

      if (data.type === 'replace') {
        setStreamingText(data.content)
        return
      }

      if (data.type === 'done') {
        pendingFinalMessageRef.current = {
          id: data.ai_message.id,
          sender: data.ai_message.sender,
          content: data.ai_message.content,
        }
        setStreamingText(data.ai_message.content)
        setAwaitingFinalize(true)
        setIsSending(false)
        onConversationUpdatedRef.current?.()
        return
      }

      if (data.type === 'error') {
        setError(data.detail ?? 'Erro ao processar mensagem')
        setStreamingText('')
        setIsSending(false)
      }
    }

    return () => {
      closeWebSocket(ws)
      if (wsRef.current === ws) {
        wsRef.current = null
      }
    }
  }, [conversationId, token, enabled])

  const finalizeStreamingMessage = useCallback(() => {
    const pending = pendingFinalMessageRef.current
    if (!pending) return

    setMessages((current) => [...current, pending])
    pendingFinalMessageRef.current = null
    setStreamingText('')
    setAwaitingFinalize(false)
  }, [])

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim()
      if (!trimmed || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        return
      }

      setError(null)
      setIsSending(true)
      wsRef.current.send(JSON.stringify({ type: 'message', content: trimmed }))
    },
    [],
  )

  const displayMessages = streamingText
    ? [
        ...messages,
        {
          id: streamingIdRef.current,
          sender: 'AI' as const,
          content: streamingText,
          streaming: true,
          finalizeOnComplete: awaitingFinalize,
        },
      ]
    : messages

  return {
    messages: displayMessages,
    streamingText,
    isConnected,
    isSending,
    error,
    sendMessage,
    setMessages,
    finalizeStreamingMessage,
  }
}
