import pytest

from tests.fakes import FakeConversationRepository


@pytest.fixture
def fake_repository() -> FakeConversationRepository:
    return FakeConversationRepository()
