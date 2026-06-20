import { useNavigate } from 'react-router-dom'
import { ConversationItem } from '@/components/molecules/ConversationItem'
import { Sidebar } from '@/components/organisms/Sidebar'
import { useAuth } from '@/domains/auth/AuthProvider'
import { useChatConversations } from '@/domains/chat/chat-context'
import { conversationTitle } from '@/domains/chat/utils'

export function ChatSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
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

  return (
    <Sidebar userName={user?.name ?? 'Usuário'} onNewChat={createNewChat} onLogout={handleLogout}>
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
            onSelect={selectConversation}
          />
        ))
      )}
    </Sidebar>
  )
}
