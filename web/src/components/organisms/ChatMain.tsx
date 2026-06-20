import { ChatWindow } from '@/components/organisms/ChatWindow'
import { useChat } from '@/domains/chat/ChatProvider'

export function ChatMain() {
  const {
    messages,
    pageError,
    chatError,
    isLoadingConversations,
    isLoadingMessages,
    isConnected,
    isSending,
    sendMessage,
    finalizeStreamingMessage,
  } = useChat()

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
        onStreamingTypingComplete={finalizeStreamingMessage}
      />
    </>
  )
}
