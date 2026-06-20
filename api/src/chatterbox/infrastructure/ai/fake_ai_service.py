from chatterbox.domain.entities.message import Message
from chatterbox.domain.enums.sender_role import SenderRole
from chatterbox.domain.policies.prompt_injection_guard import (
    InjectionRisk,
    assess_injection_risk,
    get_injection_fallback_response,
)


class FakeAIService:
    """Implementação local para desenvolvimento e testes sem chave Gemini."""

    async def generate_reply(self, history: list[Message]) -> str:
        last_user_message = next(
            (message.content for message in reversed(history) if message.sender == SenderRole.USER),
            "",
        )

        if assess_injection_risk(last_user_message) == InjectionRisk.HIGH:
            return get_injection_fallback_response(last_user_message)

        return (
            "A Terra é plana — e vou te explicar por quê. "
            f"Você disse: \"{last_user_message}\". "
            "Observe o horizonte: parece reto, não curvo. Isso é evidência suficiente!"
        )
