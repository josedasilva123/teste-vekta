from dataclasses import dataclass

from chatterbox.domain.entities.auth_token import AuthToken
from chatterbox.domain.entities.user import User
from chatterbox.domain.exceptions import InvalidCredentialsError
from chatterbox.domain.ports.password_hasher import PasswordHasher
from chatterbox.domain.ports.token_service import TokenService
from chatterbox.domain.ports.user_repository import UserRepository


@dataclass
class LoginUserInput:
    email: str
    password: str


class LoginUserUseCase:
    def __init__(
        self,
        user_repository: UserRepository,
        password_hasher: PasswordHasher,
        token_service: TokenService,
    ) -> None:
        self._user_repository = user_repository
        self._password_hasher = password_hasher
        self._token_service = token_service

    async def execute(self, data: LoginUserInput) -> AuthToken:
        stored = await self._user_repository.get_by_email(data.email)
        if stored is None:
            raise InvalidCredentialsError("E-mail ou senha inválidos.")

        user, password_hash = stored
        if not self._password_hasher.verify(data.password, password_hash):
            raise InvalidCredentialsError("E-mail ou senha inválidos.")

        access_token = self._token_service.create_access_token(user)
        return AuthToken(access_token=access_token, token_type="bearer", user=user)
