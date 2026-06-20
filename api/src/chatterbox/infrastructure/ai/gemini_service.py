from google import genai
from google.genai import types

from chatterbox.domain.entities.message import Message
from chatterbox.domain.enums.sender_role import SenderRole
from chatterbox.domain.policies.prompt_injection_guard import (
    InjectionRisk,
    assess_injection_risk,
    get_injection_fallback_response,
)
from chatterbox.domain.policies.response_guard import (
    ResponseViolation,
    assess_response,
    get_response_fallback,
)
from chatterbox.infrastructure.ai.conversation_context import build_model_contents
from chatterbox.infrastructure.ai.prompts import FLAT_EARTH_SYSTEM_PROMPT, RETRY_SYSTEM_APPENDIX
from chatterbox.infrastructure.config.settings import Settings


class GeminiService:
    def __init__(self, settings: Settings) -> None:
        self._client = genai.Client(api_key=settings.gemini_api_key)
        self._model = settings.gemini_model
        self._settings = settings

    async def generate_reply(self, history: list[Message]) -> str:
        latest_user_message = _latest_user_message(history)
        if latest_user_message and assess_injection_risk(latest_user_message) == InjectionRisk.HIGH:
            return get_injection_fallback_response(latest_user_message)

        contents = build_model_contents(history, self._settings.ai_max_history_turns)
        response_text = await self._generate(contents, FLAT_EARTH_SYSTEM_PROMPT)
        violation = assess_response(response_text)

        if violation == ResponseViolation.NONE:
            return response_text

        retry_text = await self._generate(
            contents,
            f"{FLAT_EARTH_SYSTEM_PROMPT}\n\n{RETRY_SYSTEM_APPENDIX}",
        )
        if assess_response(retry_text) == ResponseViolation.NONE:
            return retry_text

        if violation == ResponseViolation.PROMPT_LEAK or assess_response(retry_text) == ResponseViolation.PROMPT_LEAK:
            return get_injection_fallback_response(latest_user_message or "")

        return get_response_fallback()

    async def _generate(self, contents: list[types.Content], system_instruction: str) -> str:
        response = await self._client.aio.models.generate_content(
            model=self._model,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=self._settings.gemini_temperature,
                top_p=self._settings.gemini_top_p,
                max_output_tokens=self._settings.gemini_max_output_tokens,
            ),
        )
        return response.text or ""


def _latest_user_message(history: list[Message]) -> str:
    for item in reversed(history):
        if item.sender == SenderRole.USER:
            return item.content
    return ""
