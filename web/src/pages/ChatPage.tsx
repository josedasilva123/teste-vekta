import { ChatLayout } from '@/components/templates/ChatLayout'
import { ChatMain } from '@/components/organisms/ChatMain'
import { ChatSidebar } from '@/components/organisms/ChatSidebar'

export function ChatPage() {
  return (
    <ChatLayout sidebar={<ChatSidebar />}>
      <ChatMain />
    </ChatLayout>
  )
}
