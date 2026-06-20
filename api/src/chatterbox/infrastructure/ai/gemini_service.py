from collections.abc import AsyncIterator

from google import genai
from google.genai import types

from chatterbox.domain.entities.ai_stream_event import AIStreamEvent
from chatterbox.domain.entities.message import Message
from chatterbox.domain.enums.sender_role import SenderRole
from chatterbox.domain.policies.prompt_injection_guard import (
    InjectionRisk,
    assess_injection_risk,
    get_injection_fallback_response,
)
from chatterbox.infrastructure.ai.conversation_context import build_model_contents
from chatterbox.infrastructure.ai.prompts import FLAT_EARTH_SYSTEM_PROMPT, RETRY_SYSTEM_APPENDIX
from chatterbox.infrastructure.ai.response_finalizer import finalize_ai_response
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

        return await finalize_ai_response(
            latest_user_message,
            response_text,
            lambda: self._generate(
                contents,
                f"{FLAT_EARTH_SYSTEM_PROMPT}\n\n{RETRY_SYSTEM_APPENDIX}",
            ),
        )

    async def generate_reply_stream(self, history: list[Message]) -> AsyncIterator[AIStreamEvent]:
        latest_user_message = _latest_user_message(history)
        if latest_user_message and assess_injection_risk(latest_user_message) == InjectionRisk.HIGH:
            fallback = get_injection_fallback_response(latest_user_message)
            yield AIStreamEvent(kind="chunk", content=fallback)
            return

        contents = build_model_contents(history, self._settings.ai_max_history_turns)
        accumulated = ""

        stream = await self._client.aio.models.generate_content_stream(
            model=self._model,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=FLAT_EARTH_SYSTEM_PROMPT,
                temperature=self._settings.gemini_temperature,
                top_p=self._settings.gemini_top_p,
                max_output_tokens=self._settings.gemini_max_output_tokens,
            ),
        )
        async for chunk in stream:
            text = chunk.text or ""
            if not text:
                continue
            accumulated += text
            yield AIStreamEvent(kind="chunk", content=text)

        final_text = await finalize_ai_response(
            latest_user_message,
            accumulated,
            lambda: self._generate(
                contents,
                f"{FLAT_EARTH_SYSTEM_PROMPT}\n\n{RETRY_SYSTEM_APPENDIX}",
            ),
        )
        if final_text != accumulated:
            yield AIStreamEvent(kind="replace", content=final_text)

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
