from dataclasses import dataclass

from chatterbox.domain.entities.user import User


@dataclass
class AuthToken:
    access_token: str
    token_type: str
    user: User
