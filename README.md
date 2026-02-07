# HemoScan AI

"AI-powered anemia screening and guidance for better care decisions."

HemoScan AI is a generative AI web platform for non-invasive anemia risk analysis. It supports CBC OCR extraction, eye-scan workflow, symptom tracking, personalized diet guidance, multilingual explanations, and doctor consultation support.

## Table of Contents
1. [Scenario](#scenario)
2. [Solution](#solution)
3. [Key Features](#key-features)
4. [Screenshots](#screenshots)
5. [Tech Stack](#tech-stack)
6. [Local Setup](#local-setup)
7. [Project Structure](#project-structure)

## Scenario
Anemia is under-diagnosed in many communities due to limited access to diagnostics and delayed follow-ups. People often receive CBC reports without clear explanations or actionable guidance. HemoScan AI bridges this gap by combining simple data input, AI explanations, and personalized next steps.

## Solution
HemoScan AI provides a friendly, accessible interface that accepts multiple inputs, explains results in plain language, and supports users with nutrition guidance, translation, and referral workflows.

## Key Features
- Generative AI summaries for CBC and scan results
- AI chatbot to explain reports in simple language
- Personalized diet plans with translation
- Non-invasive eye scan workflow with camera and uploads
- Symptom-based risk analysis
- Doctor consultation workflow
- Awareness and guidelines for public health outreach

## Screenshots

### Generative AI Features
Generative AI capabilities such as diet plans, chatbot explanations, summaries, and translations.

![Generative AI Features](docs/screenshots/Generative-%20AI%20features.png)

### Dashboard
Health overview with hemoglobin trend, risk score, reminders, and quick actions.

![Dashboard](docs/screenshots/Dashboard.png)

### Retina Scan
Non-invasive eye scan workflow with camera preview and upload options.

![Retina Scan](docs/screenshots/Retina%20Scan.png)

### Doctor Consultation
Search, upload reports, and book appointments with doctors.

![Doctor Consultation](docs/screenshots/Doctor%20Consultancy.png)

### Diet Planner
AI-assisted diet planner with iron-rich foods and guidance.

![Diet Planner](docs/screenshots/Diet%20Plan.png)

### Awareness and Guidelines
Educational content and outreach insights for public health awareness.

![Awareness and Guidelines](docs/screenshots/Awareness%20%26%20Guidelines.png)

## Tech Stack
- Frontend: React (Vite), Tailwind, ShadCN UI
- Backend: FastAPI
- AI/ML: Scikit-learn, TensorFlow or TFLite (planned), CNN (MobileNet or EfficientNet)
- OCR: Tesseract with PDF support
- Database: MongoDB

## Local Setup

### Frontend
```bash
npm i
npm run dev
```

### Backend
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\uvicorn app.main:app --reload --port 8000
```

## Project Structure
- `src/` frontend app
- `backend/` FastAPI backend
- `docs/screenshots/` README images

### Jon Snow
Additional interface preview.

![Jon Snow](docs/screenshots/jon-snow.jpeg)


