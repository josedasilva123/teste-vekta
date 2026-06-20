from google import genai
from google.genai import types

from chatterbox.domain.entities.message import Message
from chatterbox.domain.enums.sender_role import SenderRole
from chatterbox.infrastructure.ai.prompts import FLAT_EARTH_SYSTEM_PROMPT
from chatterbox.infrastructure.config.settings import Settings


class GeminiService:
    def __init__(self, settings: Settings) -> None:
        self._client = genai.Client(api_key=settings.gemini_api_key)
        self._model = settings.gemini_model

    async def generate_reply(self, history: list[Message]) -> str:
        contents = [
            types.Content(
                role="user" if item.sender == SenderRole.USER else "model",
                parts=[types.Part.from_text(text=item.content)],
            )
            for item in history
        ]

        response = await self._client.aio.models.generate_content(
            model=self._model,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=FLAT_EARTH_SYSTEM_PROMPT,
            ),
        )
        return response.text or ""
