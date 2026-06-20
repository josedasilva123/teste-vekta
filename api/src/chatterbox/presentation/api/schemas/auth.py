from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserSchema(BaseModel):
    id: str
    email: EmailStr
    name: str
    created_at: datetime


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    name: str = Field(..., min_length=2, max_length=120)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserSchema
