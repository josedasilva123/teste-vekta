from datetime import UTC, datetime, timedelta

import jwt

from chatterbox.domain.entities.user import User
from chatterbox.domain.exceptions import InvalidTokenError
from chatterbox.infrastructure.config.settings import Settings


class JwtTokenService:
    def __init__(self, settings: Settings) -> None:
        self._secret_key = settings.jwt_secret_key
        self._algorithm = settings.jwt_algorithm
        self._expire_minutes = settings.jwt_expire_minutes

    def create_access_token(self, user: User) -> str:
        expires_at = datetime.now(UTC) + timedelta(minutes=self._expire_minutes)
        payload = {
            "sub": user.id,
            "email": user.email,
            "exp": expires_at,
        }
        return jwt.encode(payload, self._secret_key, algorithm=self._algorithm)

    def get_user_id_from_token(self, token: str) -> str:
        try:
            payload = jwt.decode(token, self._secret_key, algorithms=[self._algorithm])
        except jwt.PyJWTError as error:
            raise InvalidTokenError("Token inválido ou expirado.") from error

        user_id = payload.get("sub")
        if not isinstance(user_id, str) or not user_id:
            raise InvalidTokenError("Token inválido ou expirado.")

        return user_id
