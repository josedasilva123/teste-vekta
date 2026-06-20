from typing import Protocol

from chatterbox.domain.entities.conversation import Conversation
from chatterbox.domain.entities.message import Message


class ConversationRepository(Protocol):
    async def create(self, user_id: str) -> Conversation: ...

    async def get_by_id(self, conversation_id: str, user_id: str) -> Conversation | None: ...

    async def list_by_user(self, user_id: str) -> list[Conversation]: ...

    async def add_message(self, message: Message) -> Message: ...
