from dataclasses import dataclass, field
from datetime import UTC, datetime
from uuid import uuid4


@dataclass
class User:
    email: str
    name: str
    id: str = field(default_factory=lambda: str(uuid4()))
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))
