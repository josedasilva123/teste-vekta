from chatterbox.domain.entities.conversation import Conversation
from chatterbox.domain.ports.conversation_repository import ConversationRepository


class ListConversationsUseCase:
    def __init__(self, conversation_repository: ConversationRepository) -> None:
        self._conversation_repository = conversation_repository

    async def execute(self, user_id: str) -> list[Conversation]:
        return await self._conversation_repository.list_by_user(user_id)
