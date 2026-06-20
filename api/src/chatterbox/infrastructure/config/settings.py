from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_database: str = "chatterbox"

    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_reload: bool = True

    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash-lite"
    ai_provider: str = "gemini"


settings = Settings()
