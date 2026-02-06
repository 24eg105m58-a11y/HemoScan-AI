import io

from fastapi import APIRouter, File, UploadFile, HTTPException
from pdf2image import convert_from_bytes
from PIL import Image
from pydantic import BaseModel
import pytesseract

from backend.app.config import settings
from backend.app.services.gemini_client import get_text_model, get_vision_model

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


class SummaryRequest(BaseModel):
    context: str


class DietRequest(BaseModel):
    diet_type: str
    notes: str | None = None


class TranslateRequest(BaseModel):
    text: str
    target_language: str


def _require_gemini():
    if not settings.gemini_api_key:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key not configured. Set HEMOSCAN_GEMINI_API_KEY.",
        )


@router.post("/chat")
def chat(payload: ChatRequest):
    _require_gemini()
    model = get_text_model()
    prompt = (
        "You are HemoScan AI. Provide clear, concise responses. "
        "Do not diagnose; suggest seeing a clinician for medical advice.\n\n"
        f"User: {payload.message}"
    )
    response = model.generate_content(
        prompt,
        generation_config={"temperature": settings.gemini_temperature},
    )
    return {"reply": response.text.strip()}


@router.post("/summary")
def summary(payload: SummaryRequest):
    _require_gemini()
    model = get_text_model()
    prompt = (
        "Summarize the clinical context clearly and concisely. "
        "Do not add new facts.\n\n"
        f"Context: {payload.context}"
    )
    response = model.generate_content(
        prompt,
        generation_config={"temperature": settings.gemini_temperature},
    )
    return {"summary": response.text.strip()}


@router.post("/diet")
def diet(payload: DietRequest):
    prompt = (
        f"Create a practical, budget-friendly diet plan for a {payload.diet_type} diet. "
        "Focus on iron-rich foods and include 3 meal ideas plus 3 snack ideas."
    )
    if payload.notes:
        prompt += f" Notes: {payload.notes}"
    _require_gemini()
    model = get_text_model()
    response = model.generate_content(
        prompt,
        generation_config={"temperature": settings.gemini_temperature},
    )
    return {"plan": response.text.strip()}


@router.post("/translate")
def translate(payload: TranslateRequest):
    _require_gemini()
    model = get_text_model()
    prompt = (
        "Translate the text to the target language. Return only the translated text.\n\n"
        f"Target language: {payload.target_language}\nText: {payload.text}"
    )
    response = model.generate_content(
        prompt,
        generation_config={"temperature": settings.gemini_temperature},
    )
    return {"translated": response.text.strip()}


@router.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    content = await file.read()

    def ocr_image_tesseract(image: Image.Image) -> str:
        return pytesseract.image_to_string(image)

    def ocr_image(image: Image.Image) -> str:
        model = get_vision_model()
        response = model.generate_content(
            [
                "Extract all text from this image. Return only the text.",
                image,
            ],
            generation_config={"temperature": 0},
        )
        return response.text.strip()

    try:
        if file.filename.lower().endswith(".pdf"):
            pages = convert_from_bytes(content, dpi=200)
            extracted = []
            for index, page in enumerate(pages, start=1):
                if settings.gemini_api_key:
                    try:
                        text = ocr_image(page)
                        extracted.append(f"--- Page {index} ---\n{text}")
                        continue
                    except Exception:
                        pass
                text = ocr_image_tesseract(page)
                extracted.append(f"--- Page {index} ---\n{text}")
            return {
                "text": "\n\n".join(extracted),
                "method": "gemini" if settings.gemini_api_key else "tesseract",
            }

        image = Image.open(io.BytesIO(content))
        if settings.gemini_api_key:
            try:
                return {"text": ocr_image(image), "method": "gemini"}
            except Exception:
                pass
        return {"text": ocr_image_tesseract(image), "method": "tesseract"}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"OCR failed: {exc}")
