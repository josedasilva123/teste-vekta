class DomainError(Exception):
    """Erro base de domínio."""


class ConversationNotFoundError(DomainError):
    """Conversa não encontrada."""


class UserAlreadyExistsError(DomainError):
    """Usuário já cadastrado com este e-mail."""


class InvalidCredentialsError(DomainError):
    """Credenciais inválidas."""


class InvalidTokenError(DomainError):
    """Token de autenticação inválido ou expirado."""
