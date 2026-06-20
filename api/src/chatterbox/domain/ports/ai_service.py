from typing import Protocol

from chatterbox.domain.entities.message import Message


class AIService(Protocol):
    async def generate_reply(self, history: list[Message]) -> str: ...
