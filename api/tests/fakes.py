from chatterbox.domain.entities.conversation import Conversation
from chatterbox.domain.entities.message import Message
from chatterbox.domain.entities.user import User
from chatterbox.domain.exceptions import UserAlreadyExistsError


class FakeUserRepository:
    def __init__(self) -> None:
        self._users: dict[str, User] = {}
        self._passwords: dict[str, str] = {}
        self._email_index: dict[str, str] = {}

    async def create(self, email: str, name: str, password_hash: str) -> User:
        normalized_email = email.strip().lower()
        if normalized_email in self._email_index:
            raise UserAlreadyExistsError(f"E-mail {normalized_email} já cadastrado.")

        user = User(email=normalized_email, name=name.strip())
        self._users[user.id] = user
        self._email_index[normalized_email] = user.id
        self._passwords[user.id] = password_hash
        return user

    async def get_by_email(self, email: str) -> tuple[User, str] | None:
        user_id = self._email_index.get(email.strip().lower())
        if user_id is None:
            return None
        return self._users[user_id], self._passwords[user_id]

    async def get_by_id(self, user_id: str) -> User | None:
        return self._users.get(user_id)


class FakeConversationRepository:
    def __init__(self) -> None:
        self._conversations: dict[str, Conversation] = {}
        self._messages: dict[str, list[Message]] = {}

    async def create(self, user_id: str) -> Conversation:
        conversation = Conversation(user_id=user_id)
        self._conversations[conversation.id] = conversation
        self._messages[conversation.id] = []
        return conversation

    async def get_by_id(self, conversation_id: str, user_id: str) -> Conversation | None:
        conversation = self._conversations.get(conversation_id)
        if conversation is None or conversation.user_id != user_id:
            return None
        return Conversation(
            id=conversation.id,
            user_id=conversation.user_id,
            messages=list(self._messages.get(conversation_id, [])),
            created_at=conversation.created_at,
        )

    async def list_by_user(self, user_id: str) -> list[Conversation]:
        conversations = [
            await self.get_by_id(conversation.id, user_id)
            for conversation in self._conversations.values()
            if conversation.user_id == user_id
        ]
        return [conversation for conversation in conversations if conversation is not None]

    async def add_message(self, message: Message) -> Message:
        self._messages.setdefault(message.conversation_id, []).append(message)
        return message
