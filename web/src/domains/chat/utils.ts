import type { ChatMessage, Conversation } from '@/domains/chat/types'

export function conversationTitle(conversation: Conversation): string {
  const firstUserMessage = conversation.messages.find((message) => message.sender === 'USER')
  if (firstUserMessage) {
    return firstUserMessage.content.slice(0, 40) || 'Nova conversa'
  }
  return 'Nova conversa'
}

export function mapMessages(messages: Conversation['messages']): ChatMessage[] {
  return messages.map((message) => ({
    id: message.id,
    sender: message.sender,
    content: message.content,
  }))
}
