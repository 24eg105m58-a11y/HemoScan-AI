import hashlib
import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr
from authlib.integrations.starlette_client import OAuth

from backend.app.services.auth import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    hash_token,
    refresh_token_expiry_iso,
    verify_password,
)
from backend.app.services.repos import UserRepo
from backend.app.config import settings

router = APIRouter()
oauth = OAuth()

if settings.google_client_id and settings.google_client_secret:
    oauth.register(
        name="google",
        client_id=settings.google_client_id,
        client_secret=settings.google_client_secret,
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str | None = None


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirmRequest(BaseModel):
    token: str
    new_password: str


@router.post("/register")
async def register(payload: RegisterRequest):
    existing = await UserRepo.find_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    await UserRepo.create(
        {"email": payload.email, "password_hash": hash_password(payload.password)}
    )
    return {"status": "ok"}


@router.post("/login")
async def login(payload: LoginRequest):
    user = await UserRepo.find_by_email(payload.email)
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(payload.email)
    refresh_token = create_refresh_token(payload.email)
    await UserRepo.set_refresh_token(
        payload.email, hash_token(refresh_token), refresh_token_expiry_iso()
    )
    return {
        "token": access_token,
        "refresh_token": refresh_token,
        "user": {"email": payload.email},
    }


@router.post("/refresh")
async def refresh(payload: RefreshRequest):
    try:
        payload_data = decode_token(payload.refresh_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    if payload_data.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")
    email = payload_data.get("sub", "")
    user = await UserRepo.find_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    token_hash = hash_token(payload.refresh_token)
    if user.get("refresh_token_hash") != token_hash:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    expires_at = user.get("refresh_token_expires_at")
    if expires_at:
        expires_dt = datetime.fromisoformat(expires_at.replace("Z", ""))
        if expires_dt < datetime.utcnow():
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    access_token = create_access_token(email)
    new_refresh = create_refresh_token(email)
    await UserRepo.set_refresh_token(email, hash_token(new_refresh), refresh_token_expiry_iso())
    return {"token": access_token, "refresh_token": new_refresh}


@router.post("/logout")
async def logout(payload: LogoutRequest):
    if payload.refresh_token:
        try:
            payload_data = decode_token(payload.refresh_token)
            if payload_data.get("type") == "refresh":
                email = payload_data.get("sub", "")
                if email:
                    await UserRepo.clear_refresh_token(email)
        except Exception:
            pass
    return {"status": "ok"}


@router.post("/password-reset")
async def password_reset(_: PasswordResetRequest):
    # Always return ok to avoid leaking user existence.
    user = await UserRepo.find_by_email(_.email)
    if not user:
        return {"status": "ok"}

    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    expires_at = (datetime.utcnow() + timedelta(hours=1)).isoformat() + "Z"
    await UserRepo.set_reset_token(_.email, token_hash, expires_at)

    # NOTE: For production, email the token instead of returning it.
    return {"status": "ok", "reset_token": raw_token}


@router.post("/password-reset/confirm")
async def password_reset_confirm(_: PasswordResetConfirmRequest):
    token_hash = hashlib.sha256(_.token.encode("utf-8")).hexdigest()
    user = await UserRepo.find_by_reset_token(token_hash)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    expires_at = user.get("reset_token_expires_at")
    if not expires_at:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    expires_dt = datetime.fromisoformat(expires_at.replace("Z", ""))
    if expires_dt < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    await UserRepo.update_password(user["email"], hash_password(_.new_password))
    await UserRepo.clear_reset_token(user["email"])
    return {"status": "ok"}


@router.get("/google/login")
async def google_login(request: Request):
    if not settings.google_client_id or not settings.google_client_secret:
        raise HTTPException(status_code=503, detail="Google OAuth not configured")
    redirect_uri = f"{settings.backend_url}/api/auth/google/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request):
    if not settings.google_client_id or not settings.google_client_secret:
        raise HTTPException(status_code=503, detail="Google OAuth not configured")
    token = await oauth.google.authorize_access_token(request)
    userinfo = token.get("userinfo")
    if not userinfo:
        userinfo = await oauth.google.parse_id_token(request, token)
    email = userinfo.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email")

    existing = await UserRepo.find_by_email(email)
    if not existing:
        await UserRepo.create({"email": email, "password_hash": hash_password(secrets.token_urlsafe(16))})

    access_token = create_access_token(email)
    refresh_token = create_refresh_token(email)
    await UserRepo.set_refresh_token(email, hash_token(refresh_token), refresh_token_expiry_iso())

    redirect_url = (
        f"{settings.frontend_url}/auth/google/callback"
        f"?token={access_token}&refresh_token={refresh_token}&email={email}"
    )
    return RedirectResponse(redirect_url)
