import pytest
from httpx import AsyncClient


async def register_and_login(client: AsyncClient, email: str = "user@example.com") -> str:
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "senha12345",
            "name": "Usuário Teste",
        },
    )
    assert response.status_code == 201
    return response.json()["access_token"]


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}
