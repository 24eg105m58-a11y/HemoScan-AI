import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from backend.app.routes import ai, auth, data, health
from backend.app.config import settings
from backend.app.services.db import get_client

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="HemoScan AI Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key=settings.jwt_secret)

app.include_router(health.router, prefix="/api/health", tags=["health"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(data.router, prefix="/api/data", tags=["data"])


@app.on_event("startup")
async def startup():
    client = get_client()
    try:
        await client.admin.command("ping")
        logging.info("MongoDB connected")
    except Exception as exc:
        logging.error("MongoDB connection failed: %s", exc)
