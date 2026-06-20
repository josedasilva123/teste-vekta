from typing import Protocol

from chatterbox.domain.entities.user import User


class UserRepository(Protocol):
    async def create(self, email: str, name: str, password_hash: str) -> User: ...

    async def get_by_email(self, email: str) -> tuple[User, str] | None: ...

    async def get_by_id(self, user_id: str) -> User | None: ...
