from chatterbox.domain.entities.user import User
from chatterbox.domain.exceptions import InvalidTokenError
from chatterbox.domain.ports.token_service import TokenService
from chatterbox.domain.ports.user_repository import UserRepository


class GetCurrentUserUseCase:
    def __init__(
        self,
        user_repository: UserRepository,
        token_service: TokenService,
    ) -> None:
        self._user_repository = user_repository
        self._token_service = token_service

    async def execute(self, token: str) -> User:
        user_id = self._token_service.get_user_id_from_token(token)
        user = await self._user_repository.get_by_id(user_id)
        if user is None:
            raise InvalidTokenError("Token inválido ou expirado.")
        return user
