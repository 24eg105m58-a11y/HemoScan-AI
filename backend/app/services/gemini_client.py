from google.generativeai import GenerativeModel, configure

from backend.app.config import settings

_configured = False


def _ensure_configured() -> None:
    global _configured
    if not _configured:
        configure(api_key=settings.gemini_api_key)
        _configured = True


def _normalize_model_name(name: str) -> str:
    if name.startswith("models/"):
        return name
    return f"models/{name}"


def get_text_model() -> GenerativeModel:
    _ensure_configured()
    return GenerativeModel(_normalize_model_name(settings.gemini_model))


def get_vision_model() -> GenerativeModel:
    _ensure_configured()
    return GenerativeModel(_normalize_model_name(settings.gemini_vision_model))
