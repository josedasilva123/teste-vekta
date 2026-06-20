from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from chatterbox.application.use_cases.login_user import LoginUserInput, LoginUserUseCase
from chatterbox.application.use_cases.register_user import RegisterUserInput, RegisterUserUseCase
from chatterbox.domain.entities.user import User
from chatterbox.domain.exceptions import InvalidCredentialsError, UserAlreadyExistsError
from chatterbox.presentation.api.mappers import to_auth_response, to_user_schema
from chatterbox.presentation.api.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, UserSchema
from chatterbox.presentation.auth.security import get_current_user
from chatterbox.presentation.dependencies import get_login_user_use_case, get_register_user_use_case

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    body: RegisterRequest,
    use_case: Annotated[RegisterUserUseCase, Depends(get_register_user_use_case)],
) -> AuthResponse:
    try:
        result = await use_case.execute(
            RegisterUserInput(email=body.email, password=body.password, name=body.name)
        )
    except UserAlreadyExistsError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error)) from error
    return to_auth_response(result.access_token, result.token_type, result.user)


@router.post("/login", response_model=AuthResponse)
async def login(
    body: LoginRequest,
    use_case: Annotated[LoginUserUseCase, Depends(get_login_user_use_case)],
) -> AuthResponse:
    try:
        result = await use_case.execute(LoginUserInput(email=body.email, password=body.password))
    except InvalidCredentialsError as error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(error)) from error
    return to_auth_response(result.access_token, result.token_type, result.user)


@router.get("/me", response_model=UserSchema)
async def me(current_user: Annotated[User, Depends(get_current_user)]) -> UserSchema:
    return to_user_schema(current_user)
