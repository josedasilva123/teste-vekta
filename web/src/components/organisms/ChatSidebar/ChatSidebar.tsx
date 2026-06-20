import { useNavigate } from 'react-router-dom'
import { ConversationItem } from '@/components/molecules/ConversationItem'
import { Sidebar } from '@/components/organisms/Sidebar'
import { useSidebarLayout } from '@/components/templates/ChatLayout/sidebar-layout-context'
import { useAuth } from '@/domains/auth/AuthProvider'
import { useChatConversations } from '@/domains/chat/chat-context'
import { conversationTitle } from '@/domains/chat/utils'

export function ChatSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { closeSidebar } = useSidebarLayout()
  const {
    conversations,
    activeConversationId,
    isLoadingConversations,
    selectConversation,
    createNewChat,
  } = useChatConversations()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSelectConversation = (id: string) => {
    selectConversation(id)
    closeSidebar()
  }

  const handleNewChat = () => {
    createNewChat()
    closeSidebar()
  }

  return (
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
            onSelect={handleSelectConversation}
          />
        ))
      )}
    </Sidebar>
  )
}
