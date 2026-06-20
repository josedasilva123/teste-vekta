from chatterbox.domain.entities.conversation import Conversation
from chatterbox.domain.entities.message import Message
from chatterbox.domain.entities.user import User
from chatterbox.presentation.api.schemas.auth import AuthResponse, UserSchema
from chatterbox.presentation.api.schemas.conversation import (
    ConversationSchema,
    MessageSchema,
    SendMessageResponse,
)


def to_user_schema(user: User) -> UserSchema:
    return UserSchema(
        id=user.id,
        email=user.email,
        name=user.name,
        created_at=user.created_at,
    )


def to_auth_response(access_token: str, token_type: str, user: User) -> AuthResponse:
    return AuthResponse(
        access_token=access_token,
        token_type=token_type,
        user=to_user_schema(user),
    )


def to_message_schema(message: Message) -> MessageSchema:
    return MessageSchema(
        id=message.id,
        conversation_id=message.conversation_id,
        sender=message.sender,
        content=message.content,
        created_at=message.created_at,
    )


def to_conversation_schema(conversation: Conversation) -> ConversationSchema:
    return ConversationSchema(
        id=conversation.id,
        user_id=conversation.user_id,
        messages=[to_message_schema(message) for message in conversation.messages],
        created_at=conversation.created_at,
    )


def to_send_message_response(
    user_message: Message,
    ai_message: Message,
) -> SendMessageResponse:
    return SendMessageResponse(
        user_message=to_message_schema(user_message),
        ai_message=to_message_schema(ai_message),
    )
