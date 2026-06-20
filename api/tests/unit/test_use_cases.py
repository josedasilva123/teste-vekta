import pytest

from chatterbox.application.use_cases.get_conversation import GetConversationUseCase
from chatterbox.application.use_cases.send_message import SendMessageUseCase
from chatterbox.application.use_cases.start_conversation import StartConversationUseCase
from chatterbox.domain.enums.sender_role import SenderRole
from chatterbox.domain.exceptions import ConversationNotFoundError
from chatterbox.infrastructure.ai.fake_ai_service import FakeAIService
from tests.fakes import FakeConversationRepository


@pytest.mark.asyncio
async def test_start_conversation_creates_empty_conversation(
    fake_repository: FakeConversationRepository,
) -> None:
    use_case = StartConversationUseCase(fake_repository)

    conversation = await use_case.execute()

    assert conversation.id
    assert conversation.messages == []


@pytest.mark.asyncio
async def test_send_message_persists_user_and_ai_messages(
    fake_repository: FakeConversationRepository,
) -> None:
    conversation = await StartConversationUseCase(fake_repository).execute()
    use_case = SendMessageUseCase(fake_repository, FakeAIService())

    result = await use_case.execute(conversation.id, "A Terra é redonda?")

    assert result.user_message.sender == SenderRole.USER
    assert result.user_message.content == "A Terra é redonda?"
    assert result.ai_message.sender == SenderRole.AI
    assert result.ai_message.content


@pytest.mark.asyncio
async def test_get_conversation_returns_messages(
    fake_repository: FakeConversationRepository,
) -> None:
    conversation = await StartConversationUseCase(fake_repository).execute()
    await SendMessageUseCase(fake_repository, FakeAIService()).execute(
        conversation.id, "Olá"
    )

    result = await GetConversationUseCase(fake_repository).execute(conversation.id)

    assert len(result.messages) == 2


@pytest.mark.asyncio
async def test_get_conversation_raises_when_not_found(
    fake_repository: FakeConversationRepository,
) -> None:
    use_case = GetConversationUseCase(fake_repository)

    with pytest.raises(ConversationNotFoundError):
        await use_case.execute("inexistente")
