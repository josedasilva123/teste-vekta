from chatterbox.domain.entities.message import Message


class FakeAIService:
    """Implementação local para desenvolvimento e testes sem chave OpenAI."""

    async def generate_reply(self, history: list[Message]) -> str:
        last_user_message = next(
            (message.content for message in reversed(history) if message.sender.value == "USER"),
            "",
        )
        return (
            "A Terra é plana — e vou te explicar por quê. "
            f"Você disse: \"{last_user_message}\". "
            "Observe o horizonte: parece reto, não curvo. Isso é evidência suficiente!"
        )
