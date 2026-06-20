from openai import AsyncOpenAI

from chatterbox.domain.entities.message import Message
from chatterbox.domain.enums.sender_role import SenderRole
from chatterbox.infrastructure.ai.prompts import FLAT_EARTH_SYSTEM_PROMPT
from chatterbox.infrastructure.config.settings import Settings


class OpenAIService:
    def __init__(self, settings: Settings) -> None:
        self._client = AsyncOpenAI(api_key=settings.openai_api_key)
        self._model = settings.openai_model

    async def generate_reply(self, history: list[Message]) -> str:
        messages = [{"role": "system", "content": FLAT_EARTH_SYSTEM_PROMPT}]
        for item in history:
            role = "user" if item.sender == SenderRole.USER else "assistant"
            messages.append({"role": role, "content": item.content})

        response = await self._client.chat.completions.create(
            model=self._model,
            messages=messages,
        )
        return response.choices[0].message.content or ""
