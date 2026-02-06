from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db: str = "hemoscan"
    jwt_secret: str = "dev-secret-change-me"
    gemini_api_key: str | None = None
    gemini_model: str = "models/gemini-flash-latest"
    gemini_vision_model: str = "models/gemini-2.5-flash-image"
    gemini_temperature: float = 0.2
    frontend_url: str = "http://localhost:5173"
    backend_url: str = "http://127.0.0.1:8000"
    google_client_id: str | None = None
    google_client_secret: str | None = None

    class Config:
        env_prefix = "HEMOSCAN_"
        env_file = ("backend/.env", ".env")
        extra = "ignore"


settings = Settings()
