from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field

from backend.app.services.deps import get_current_user
from backend.app.services.repos import CBCReportRepo, SymptomRepo

router = APIRouter()


class CBCCreateRequest(BaseModel):
    hemoglobin: float = Field(ge=0, le=25)
    rbc: float | None = Field(default=None, ge=0, le=10)
    hematocrit: float | None = Field(default=None, ge=0, le=70)
    mcv: float | None = Field(default=None, ge=50, le=130)
    mch: float | None = Field(default=None, ge=10, le=40)
    mchc: float | None = Field(default=None, ge=25, le=40)
    rdw: float | None = Field(default=None, ge=10, le=25)
    wbc: float | None = Field(default=None, ge=0, le=50)
    platelets: float | None = Field(default=None, ge=0, le=1000)
    lab: str | None = None
    report_date: str | None = None


class SymptomCreateRequest(BaseModel):
    symptoms: dict


@router.post("/cbc")
async def create_cbc(payload: CBCCreateRequest, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    data = payload.model_dump()
    data["user_email"] = user
    data["created_at"] = datetime.utcnow().isoformat() + "Z"
    result = await CBCReportRepo.create(data)
    return {"status": "ok", "id": str(result.inserted_id)}


@router.get("/cbc/{email}")
async def list_cbc(email: str, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    if email != user:
        raise HTTPException(status_code=403, detail="Forbidden")
    items = await CBCReportRepo.list_by_user(email)
    return {"items": items}


@router.post("/symptoms")
async def create_symptom(payload: SymptomCreateRequest, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    data = payload.model_dump()
    data["user_email"] = user
    data["created_at"] = datetime.utcnow().isoformat() + "Z"
    result = await SymptomRepo.create(data)
    return {"status": "ok", "id": str(result.inserted_id)}


@router.get("/symptoms/{email}")
async def list_symptoms(email: str, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    if email != user:
        raise HTTPException(status_code=403, detail="Forbidden")
    items = await SymptomRepo.list_by_user(email)
    return {"items": items}
