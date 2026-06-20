import type { SenderRole } from '@/domains/chat/types'
import { TypewriterText } from '@/components/atoms/TypewriterText'

type ChatMessageProps = {
  sender: SenderRole
  content: string
  streaming?: boolean
  finalizeOnComplete?: boolean
  onTypingComplete?: () => void
  onTypingProgress?: () => void
}

export function ChatMessage({
  sender,
  content,
  streaming = false,
  finalizeOnComplete = false,
  onTypingComplete,
  onTypingProgress,
}: ChatMessageProps) {
  const isUser = sender === 'USER'
  const animateAi = !isUser && streaming

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
          {animateAi ? (
            <TypewriterText
              text={content}
              active
              showCursor
              onComplete={finalizeOnComplete ? onTypingComplete : undefined}
              onProgress={onTypingProgress}
            />
          ) : (
            content
          )}
        </p>
      </div>
    </div>
  )
}
