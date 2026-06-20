import type { SenderRole } from '@/domains/chat/types'

type ChatMessageProps = {
  sender: SenderRole
  content: string
  streaming?: boolean
}

export function ChatMessage({ sender, content, streaming = false }: ChatMessageProps) {
  const isUser = sender === 'USER'

  return (
    <div className={`flex gap-4 px-4 py-6 ${isUser ? 'bg-transparent' : 'bg-[#2a2a2a]/40'}`}>
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-sm text-xs font-semibold ${
          isUser ? 'bg-accent text-white' : 'bg-[#5436da] text-white'
        }`}
      >
        {isUser ? 'V' : 'AI'}
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="whitespace-pre-wrap text-[15px] leading-7 text-[#ececec]">
          {content}
          {streaming ? <span className="ml-1 inline-block animate-pulse text-muted">▍</span> : null}
        </p>
      </div>
    </div>
  )
}
