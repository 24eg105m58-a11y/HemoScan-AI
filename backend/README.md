# HemoScan AI Backend

## Setup

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
```

Set your Gemini key in `.env` (see `.env.example`).

## Run

Run from the repo root (the directory that contains `backend`):

```bash
C:\Users\sanjay\hemoscan-ai\backend\.venv\Scripts\uvicorn backend.app.main:app --reload --port 8000
```

## PDF OCR (Poppler)

`pdf2image` requires Poppler installed on your system.

Windows (Chocolatey):
```bash
choco install poppler
```

Windows (Scoop):
```bash
scoop install poppler
```

## Endpoints (stub)

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/password-reset`
- `POST /api/auth/password-reset/confirm`
- `POST /api/ai/chat`
- `POST /api/ai/summary`
- `POST /api/ai/diet`
- `POST /api/ai/translate`
- `POST /api/ai/ocr`
