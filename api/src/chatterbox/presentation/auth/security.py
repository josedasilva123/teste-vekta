from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from chatterbox.application.use_cases.get_current_user import GetCurrentUserUseCase
from chatterbox.domain.entities.user import User
from chatterbox.domain.exceptions import InvalidTokenError
from chatterbox.presentation.dependencies import get_current_user_use_case

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    use_case: Annotated[GetCurrentUserUseCase, Depends(get_current_user_use_case)],
) -> User:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autenticação necessária.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        return await use_case.execute(credentials.credentials)
    except InvalidTokenError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
            headers={"WWW-Authenticate": "Bearer"},
        ) from error
