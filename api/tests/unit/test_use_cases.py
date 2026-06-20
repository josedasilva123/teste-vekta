import pytest

from chatterbox.application.use_cases.get_conversation import GetConversationUseCase
from chatterbox.application.use_cases.login_user import LoginUserInput, LoginUserUseCase
from chatterbox.application.use_cases.register_user import RegisterUserInput, RegisterUserUseCase
from chatterbox.application.use_cases.send_message import SendMessageUseCase
from chatterbox.application.use_cases.start_conversation import StartConversationUseCase
from chatterbox.domain.enums.sender_role import SenderRole
from chatterbox.domain.exceptions import ConversationNotFoundError, InvalidCredentialsError, UserAlreadyExistsError
from chatterbox.infrastructure.ai.fake_ai_service import FakeAIService
from chatterbox.infrastructure.auth.bcrypt_password_hasher import BcryptPasswordHasher
from chatterbox.infrastructure.auth.jwt_token_service import JwtTokenService
from chatterbox.infrastructure.config.settings import Settings
from tests.fakes import FakeConversationRepository, FakeUserRepository


@pytest.fixture
def user_repository() -> FakeUserRepository:
    return FakeUserRepository()


@pytest.fixture
def fake_repository() -> FakeConversationRepository:
    return FakeConversationRepository()


@pytest.fixture
def token_service() -> JwtTokenService:
    return JwtTokenService(Settings(jwt_secret_key="test-secret"))


@pytest.mark.asyncio
async def test_register_user_returns_token(
    user_repository: FakeUserRepository,
    token_service: JwtTokenService,
) -> None:
    use_case = RegisterUserUseCase(user_repository, BcryptPasswordHasher(), token_service)

    result = await use_case.execute(
        RegisterUserInput(email="user@example.com", password="senha123", name="Usuário")
    )

    assert result.access_token
    assert result.user.email == "user@example.com"


@pytest.mark.asyncio
async def test_register_user_raises_when_email_exists(
    user_repository: FakeUserRepository,
    token_service: JwtTokenService,
) -> None:
    use_case = RegisterUserUseCase(user_repository, BcryptPasswordHasher(), token_service)
    payload = RegisterUserInput(email="user@example.com", password="senha123", name="Usuário")
    await use_case.execute(payload)

    with pytest.raises(UserAlreadyExistsError):
        await use_case.execute(payload)


@pytest.mark.asyncio
async def test_login_user_with_valid_credentials(
    user_repository: FakeUserRepository,
    token_service: JwtTokenService,
) -> None:
    register = RegisterUserUseCase(user_repository, BcryptPasswordHasher(), token_service)
    await register.execute(
        RegisterUserInput(email="user@example.com", password="senha123", name="Usuário")
    )
    login = LoginUserUseCase(user_repository, BcryptPasswordHasher(), token_service)

    result = await login.execute(LoginUserInput(email="user@example.com", password="senha123"))

    assert result.access_token


@pytest.mark.asyncio
async def test_login_user_raises_with_invalid_password(
    user_repository: FakeUserRepository,
    token_service: JwtTokenService,
) -> None:
    register = RegisterUserUseCase(user_repository, BcryptPasswordHasher(), token_service)
    await register.execute(
        RegisterUserInput(email="user@example.com", password="senha123", name="Usuário")
    )
    login = LoginUserUseCase(user_repository, BcryptPasswordHasher(), token_service)

    with pytest.raises(InvalidCredentialsError):
        await login.execute(LoginUserInput(email="user@example.com", password="errada"))


@pytest.mark.asyncio
async def test_start_conversation_creates_empty_conversation(
    fake_repository: FakeConversationRepository,
) -> None:
    use_case = StartConversationUseCase(fake_repository)

    conversation = await use_case.execute("user-1")

    assert conversation.id
    assert conversation.user_id == "user-1"
    assert conversation.messages == []


@pytest.mark.asyncio
async def test_send_message_persists_user_and_ai_messages(
    fake_repository: FakeConversationRepository,
) -> None:
    conversation = await StartConversationUseCase(fake_repository).execute("user-1")
    use_case = SendMessageUseCase(fake_repository, FakeAIService())

    result = await use_case.execute(conversation.id, "user-1", "A Terra é redonda?")

    assert result.user_message.sender == SenderRole.USER
    assert result.user_message.content == "A Terra é redonda?"
    assert result.ai_message.sender == SenderRole.AI
    assert result.ai_message.content


@pytest.mark.asyncio
async def test_get_conversation_returns_messages(
    fake_repository: FakeConversationRepository,
) -> None:
    conversation = await StartConversationUseCase(fake_repository).execute("user-1")
    await SendMessageUseCase(fake_repository, FakeAIService()).execute(
        conversation.id, "user-1", "Olá"
    )

    result = await GetConversationUseCase(fake_repository).execute(conversation.id, "user-1")

    assert len(result.messages) == 2


@pytest.mark.asyncio
async def test_get_conversation_raises_when_not_found(
    fake_repository: FakeConversationRepository,
) -> None:
    use_case = GetConversationUseCase(fake_repository)

    with pytest.raises(ConversationNotFoundError):
        await use_case.execute("inexistente", "user-1")


@pytest.mark.asyncio
async def test_get_conversation_raises_for_other_user(
    fake_repository: FakeConversationRepository,
) -> None:
    conversation = await StartConversationUseCase(fake_repository).execute("user-1")
    use_case = GetConversationUseCase(fake_repository)

    with pytest.raises(ConversationNotFoundError):
        await use_case.execute(conversation.id, "user-2")
