from datetime import datetime

from pymongo.errors import DuplicateKeyError

from chatterbox.domain.entities.user import User
from chatterbox.domain.exceptions import UserAlreadyExistsError
from chatterbox.infrastructure.persistence.mongo_database import MongoDatabase


class MongoUserRepository:
    USERS = "users"

    def __init__(self, database: MongoDatabase) -> None:
        self._database = database

    async def ensure_indexes(self) -> None:
        await self._database.database[self.USERS].create_index("email", unique=True)

    async def create(self, email: str, name: str, password_hash: str) -> User:
        user = User(email=email.strip().lower(), name=name.strip())
        try:
            await self._database.database[self.USERS].insert_one(
                {
                    "_id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "password_hash": password_hash,
                    "created_at": user.created_at,
                }
            )
        except DuplicateKeyError as error:
            raise UserAlreadyExistsError(f"E-mail {user.email} já cadastrado.") from error
        return user

    async def get_by_email(self, email: str) -> tuple[User, str] | None:
        doc = await self._database.database[self.USERS].find_one(
            {"email": email.strip().lower()}
        )
        if doc is None:
            return None
        return _to_user(doc), doc["password_hash"]

    async def get_by_id(self, user_id: str) -> User | None:
        doc = await self._database.database[self.USERS].find_one({"_id": user_id})
        if doc is None:
            return None
        return _to_user(doc)


def _to_user(doc: dict) -> User:
    created_at = doc["created_at"]
    if isinstance(created_at, datetime) and created_at.tzinfo is None:
        from datetime import UTC

        created_at = created_at.replace(tzinfo=UTC)

    return User(
        id=doc["_id"],
        email=doc["email"],
        name=doc["name"],
        created_at=created_at,
    )
