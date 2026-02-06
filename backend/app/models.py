from datetime import datetime
from pydantic import BaseModel, Field, EmailStr


class User(BaseModel):
    email: EmailStr
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CBCReport(BaseModel):
    user_email: EmailStr
    hemoglobin: float
    rbc: float | None = None
    hematocrit: float | None = None
    mcv: float | None = None
    mch: float | None = None
    mchc: float | None = None
    rdw: float | None = None
    wbc: float | None = None
    platelets: float | None = None
    lab: str | None = None
    report_date: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class SymptomEntry(BaseModel):
    user_email: EmailStr
    symptoms: dict
    created_at: datetime = Field(default_factory=datetime.utcnow)
