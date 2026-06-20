from typing import Annotated

from fastapi import Depends, Request

from chatterbox.application.use_cases.get_conversation import GetConversationUseCase
from chatterbox.application.use_cases.get_current_user import GetCurrentUserUseCase
from chatterbox.application.use_cases.list_conversations import ListConversationsUseCase
from chatterbox.application.use_cases.login_user import LoginUserUseCase
from chatterbox.application.use_cases.register_user import RegisterUserUseCase
from chatterbox.application.use_cases.send_message import SendMessageUseCase
from chatterbox.application.use_cases.start_conversation import StartConversationUseCase
from chatterbox.domain.ports.ai_service import AIService
from chatterbox.domain.ports.conversation_repository import ConversationRepository
from chatterbox.domain.ports.password_hasher import PasswordHasher
from chatterbox.domain.ports.token_service import TokenService
from chatterbox.domain.ports.user_repository import UserRepository
from chatterbox.infrastructure.ai.fake_ai_service import FakeAIService
from chatterbox.infrastructure.ai.gemini_service import GeminiService
from chatterbox.infrastructure.auth.bcrypt_password_hasher import BcryptPasswordHasher
from chatterbox.infrastructure.auth.jwt_token_service import JwtTokenService
from chatterbox.infrastructure.config.settings import Settings, settings
from chatterbox.infrastructure.persistence.mongo_conversation_repository import (
    MongoConversationRepository,
)
from chatterbox.infrastructure.persistence.mongo_database import MongoDatabase
from chatterbox.infrastructure.persistence.mongo_user_repository import MongoUserRepository


def get_settings() -> Settings:
    return settings


def get_mongo_database(
    request: Request,
    app_settings: Annotated[Settings, Depends(get_settings)],
) -> MongoDatabase:
    return request.app.state.mongo_database


def get_user_repository(
    mongo_database: Annotated[MongoDatabase, Depends(get_mongo_database)],
) -> UserRepository:
    return MongoUserRepository(mongo_database)


def get_conversation_repository(
    mongo_database: Annotated[MongoDatabase, Depends(get_mongo_database)],
) -> ConversationRepository:
    return MongoConversationRepository(mongo_database)


def get_password_hasher() -> PasswordHasher:
    return BcryptPasswordHasher()


def get_token_service(
    app_settings: Annotated[Settings, Depends(get_settings)],
) -> TokenService:
    return JwtTokenService(app_settings)


def get_ai_service(
    app_settings: Annotated[Settings, Depends(get_settings)],
) -> AIService:
    if app_settings.ai_provider.lower() == "fake":
        return FakeAIService()
    return GeminiService(app_settings)


def get_register_user_use_case(
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
    password_hasher: Annotated[PasswordHasher, Depends(get_password_hasher)],
    token_service: Annotated[TokenService, Depends(get_token_service)],
) -> RegisterUserUseCase:
    return RegisterUserUseCase(user_repository, password_hasher, token_service)


def get_login_user_use_case(
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
    password_hasher: Annotated[PasswordHasher, Depends(get_password_hasher)],
    token_service: Annotated[TokenService, Depends(get_token_service)],
) -> LoginUserUseCase:
    return LoginUserUseCase(user_repository, password_hasher, token_service)


def get_current_user_use_case(
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
    token_service: Annotated[TokenService, Depends(get_token_service)],
) -> GetCurrentUserUseCase:
    return GetCurrentUserUseCase(user_repository, token_service)


def get_start_conversation_use_case(
    repository: Annotated[ConversationRepository, Depends(get_conversation_repository)],
) -> StartConversationUseCase:
    return StartConversationUseCase(repository)


def get_list_conversations_use_case(
    repository: Annotated[ConversationRepository, Depends(get_conversation_repository)],
) -> ListConversationsUseCase:
    return ListConversationsUseCase(repository)


def get_get_conversation_use_case(
    repository: Annotated[ConversationRepository, Depends(get_conversation_repository)],
) -> GetConversationUseCase:
    return GetConversationUseCase(repository)


def get_send_message_use_case(
    repository: Annotated[ConversationRepository, Depends(get_conversation_repository)],
    ai_service: Annotated[AIService, Depends(get_ai_service)],
) -> SendMessageUseCase:
    return SendMessageUseCase(repository, ai_service)
