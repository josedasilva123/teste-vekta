from dataclasses import dataclass

from chatterbox.domain.entities.auth_token import AuthToken
from chatterbox.domain.exceptions import UserAlreadyExistsError
from chatterbox.domain.ports.password_hasher import PasswordHasher
from chatterbox.domain.ports.token_service import TokenService
from chatterbox.domain.ports.user_repository import UserRepository


@dataclass
class RegisterUserInput:
    email: str
    password: str
    name: str


class RegisterUserUseCase:
    def __init__(
        self,
        user_repository: UserRepository,
        password_hasher: PasswordHasher,
        token_service: TokenService,
    ) -> None:
        self._user_repository = user_repository
        self._password_hasher = password_hasher
        self._token_service = token_service

    async def execute(self, data: RegisterUserInput) -> AuthToken:
        password_hash = self._password_hasher.hash(data.password)
        try:
            user = await self._user_repository.create(data.email, data.name, password_hash)
        except UserAlreadyExistsError:
            raise

        access_token = self._token_service.create_access_token(user)
        return AuthToken(access_token=access_token, token_type="bearer", user=user)
