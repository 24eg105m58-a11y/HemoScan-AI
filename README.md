
  # HemoScan AI UI Design

  This is a code bundle for HemoScan AI UI Design. The original project is available at https://www.figma.com/design/3S05HD9S2IXs2WDV0D4HnT/HemoScan-AI-UI-Design.

## Running the code

Run `npm i` to install the frontend dependencies.

Run `npm run dev` to start the frontend development server.

## Backend setup

Create and activate the backend virtual environment, then install dependencies:

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
```

Create `backend/.env` from `.env.example` and set secrets (Mongo, Gemini, Google OAuth as needed).

## Run backend

From the repo root:

```bash
C:\Users\sanjay\hemoscan-ai\backend\.venv\Scripts\uvicorn backend.app.main:app --reload --port 8000
```

## Run both (two terminals)

Terminal 1:
```bash
C:\Users\sanjay\hemoscan-ai\backend\.venv\Scripts\uvicorn backend.app.main:app --reload --port 8000
```

Terminal 2:
```bash
npm run dev
```
  
