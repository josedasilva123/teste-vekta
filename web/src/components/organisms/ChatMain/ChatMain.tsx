import { ChatWindow } from '@/components/organisms/ChatWindow'
import { useChatConversations, useChatMessages } from '@/domains/chat/chat-context'

export function ChatMain() {
  const { pageError, isLoadingConversations } = useChatConversations()
  const {
    messages,
    chatError,
    canRetry,
    isLoadingMessages,
    isConnected,
    isSending,
    sendMessage,
    retryLastMessage,
    finalizeStreamingMessage,
  } = useChatMessages()

  return (
    <>
      {pageError ? (
        <div className="border-b border-red-900/40 bg-red-950/30 px-4 py-2 text-center text-sm text-red-300">
          {pageError}
        </div>
      ) : null}
      <ChatWindow
        messages={messages}
        onSend={sendMessage}
        isSending={isSending}
        isConnected={isConnected}
        isLoading={isLoadingConversations || isLoadingMessages}
        error={chatError}
        canRetry={canRetry}
        onRetry={retryLastMessage}
        onStreamingTypingComplete={finalizeStreamingMessage}
      />
    </>
  )
}
