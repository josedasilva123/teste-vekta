import json
from dataclasses import asdict

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import ValidationError

from chatterbox.application.use_cases.get_current_user import GetCurrentUserUseCase
from chatterbox.application.use_cases.send_message_stream import (
    SendMessageStreamUseCase,
    StreamChunkEvent,
    StreamDoneEvent,
    StreamReplaceEvent,
    StreamUserMessageEvent,
)
from chatterbox.domain.exceptions import ConversationNotFoundError, InvalidTokenError
from chatterbox.infrastructure.ai.fake_ai_service import FakeAIService
from chatterbox.infrastructure.ai.gemini_service import GeminiService
from chatterbox.infrastructure.auth.jwt_token_service import JwtTokenService
from chatterbox.infrastructure.config.settings import settings
from chatterbox.infrastructure.persistence.mongo_conversation_repository import (
    MongoConversationRepository,
)
from chatterbox.infrastructure.persistence.mongo_user_repository import MongoUserRepository
from chatterbox.presentation.api.mappers import to_message_schema
from chatterbox.presentation.api.schemas.websocket import WebSocketClientMessage

router = APIRouter(prefix="/conversations", tags=["conversations-ws"])


@router.websocket("/{conversation_id}/ws")
async def conversation_websocket(
    websocket: WebSocket,
    conversation_id: str,
    token: str | None = None,
) -> None:
    if not token:
        await websocket.close(code=4401, reason="Token ausente.")
        return

    user_repository = MongoUserRepository(websocket.app.state.mongo_database)
    token_service = JwtTokenService(settings)
    get_current_user_use_case = GetCurrentUserUseCase(user_repository, token_service)

    try:
        current_user = await get_current_user_use_case.execute(token)
    except InvalidTokenError:
        await websocket.close(code=4401, reason="Token inválido.")
        return

    await websocket.accept()
    repository = MongoConversationRepository(websocket.app.state.mongo_database)
    ai_service = _build_ai_service()
    use_case = SendMessageStreamUseCase(repository, ai_service)

    try:
        while True:
            payload = await websocket.receive_json()
            try:
                client_message = WebSocketClientMessage.model_validate(payload)
            except ValidationError:
                await _send_event(websocket, {"type": "error", "detail": "Payload inválido."})
                continue

            try:
                async for event in use_case.execute(
                    conversation_id,
                    current_user.id,
                    client_message.content,
                ):
                    await _send_event(websocket, _serialize_stream_event(event))
            except ConversationNotFoundError as error:
                await _send_event(websocket, {"type": "error", "detail": str(error)})
                await websocket.close(code=4404)
                return
            except Exception:
                await _send_event(
                    websocket,
                    {"type": "error", "detail": "Erro ao processar mensagem. Tente novamente."},
                )
    except WebSocketDisconnect:
        return


def _build_ai_service():
    if settings.ai_provider.lower() == "fake":
        return FakeAIService()
    return GeminiService(settings)


def _serialize_stream_event(event) -> dict:
    if isinstance(event, StreamUserMessageEvent):
        return {
            "type": event.type,
            "message": to_message_schema(event.user_message).model_dump(mode="json"),
        }
    if isinstance(event, StreamDoneEvent):
        return {
            "type": event.type,
            "ai_message": to_message_schema(event.ai_message).model_dump(mode="json"),
        }
    return asdict(event)


async def _send_event(websocket: WebSocket, payload: dict) -> None:
    await websocket.send_text(json.dumps(payload, ensure_ascii=False))
