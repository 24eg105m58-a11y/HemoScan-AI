from fastapi import APIRouter, HTTPException

from backend.app.services.db import get_client

router = APIRouter()


@router.get("/")
def health_check():
    return {"status": "ok"}


@router.get("/db")
async def db_health():
    try:
        client = get_client()
        await client.admin.command("ping")
        return {"status": "ok", "db": "connected"}
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"DB unavailable: {exc}")
