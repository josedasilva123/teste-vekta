from typing import Protocol

from chatterbox.domain.entities.user import User


class TokenService(Protocol):
    def create_access_token(self, user: User) -> str: ...

    def get_user_id_from_token(self, token: str) -> str: ...
