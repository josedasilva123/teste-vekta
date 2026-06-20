from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from chatterbox.application.use_cases.get_conversation import GetConversationUseCase
from chatterbox.application.use_cases.list_conversations import ListConversationsUseCase
from chatterbox.application.use_cases.send_message import SendMessageUseCase
from chatterbox.application.use_cases.start_conversation import StartConversationUseCase
from chatterbox.domain.entities.user import User
from chatterbox.domain.exceptions import ConversationNotFoundError
from chatterbox.presentation.api.mappers import (
    to_conversation_schema,
    to_send_message_response,
)
from chatterbox.presentation.auth.security import get_current_user
from chatterbox.presentation.api.schemas.conversation import (
    ConversationSchema,
    CreateMessageRequest,
    SendMessageResponse,
)
from chatterbox.presentation.dependencies import (
    get_get_conversation_use_case,
    get_list_conversations_use_case,
    get_send_message_use_case,
    get_start_conversation_use_case,
)

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.get("", response_model=list[ConversationSchema])
async def list_conversations(
    current_user: Annotated[User, Depends(get_current_user)],
    use_case: Annotated[ListConversationsUseCase, Depends(get_list_conversations_use_case)],
) -> list[ConversationSchema]:
    conversations = await use_case.execute(current_user.id)
    return [to_conversation_schema(conversation) for conversation in conversations]


@router.post("", response_model=ConversationSchema, status_code=status.HTTP_201_CREATED)
async def start_conversation(
    current_user: Annotated[User, Depends(get_current_user)],
    use_case: Annotated[StartConversationUseCase, Depends(get_start_conversation_use_case)],
) -> ConversationSchema:
    conversation = await use_case.execute(current_user.id)
    return to_conversation_schema(conversation)


@router.get("/{conversation_id}", response_model=ConversationSchema)
async def get_conversation(
    conversation_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    use_case: Annotated[GetConversationUseCase, Depends(get_get_conversation_use_case)],
) -> ConversationSchema:
    try:
        conversation = await use_case.execute(conversation_id, current_user.id)
    except ConversationNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
    return to_conversation_schema(conversation)


@router.post("/{conversation_id}/messages", response_model=SendMessageResponse)
async def send_message(
    conversation_id: str,
    body: CreateMessageRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    use_case: Annotated[SendMessageUseCase, Depends(get_send_message_use_case)],
) -> SendMessageResponse:
    try:
        result = await use_case.execute(conversation_id, current_user.id, body.content)
    except ConversationNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
    return to_send_message_response(result.user_message, result.ai_message)
