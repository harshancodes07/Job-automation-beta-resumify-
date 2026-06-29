---
title: Resumify
emoji: 📄
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# Resumify

A job-search assistant: upload your resume, search job listings (India) via the
Adzuna API, export them to Excel, and get an AI-tailored version of your resume for
any listing using Google Gemini. It never auto-applies to jobs.

## Stack
- **Backend**: FastAPI (Python 3.12), serves both the API and the built frontend
- **Frontend**: React + Vite + TypeScript + Tailwind + Three.js (3D animated UI)
- **AI**: Google Gemini (`gemini-2.5-flash`) for resume parsing + tailoring
- **Jobs**: Adzuna API (Jooble / JSearch providers also available)

## Run locally
```bash
# Backend (from repo root)
python3 -m uvicorn backend.main:app --reload --port 8000

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```
Open http://localhost:5173

## Required secrets (env vars)
| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key (resume parsing + tailoring) |
| `ADZUNA_APP_ID` | Adzuna application ID |
| `ADZUNA_API_KEY` | Adzuna application key |
| `JOB_PROVIDER` | `adzuna` (default provider) |

## Privacy
Resume files are processed in memory and deleted immediately after parsing. No
database, no file retention. Resume text is sent to the Google Gemini API for
parsing/tailoring.
