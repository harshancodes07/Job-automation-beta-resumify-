import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from backend.config import ALLOWED_ORIGINS, RATE_LIMIT, BASE_DIR
from backend.routers import resume, jobs, tailor

app = FastAPI(
    title="Resumify API",
    description="Job search assistant — fetch listings, parse resumes, tailor for specific roles",
    version="0.1.0",
)

# Per-IP rate limiting on all endpoints — protects free Gemini/Adzuna quotas from abuse
limiter = Limiter(key_func=get_remote_address, default_limits=[RATE_LIMIT])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(tailor.router, prefix="/api/tailor", tags=["Tailor"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}


# Serve the built React frontend (production). When frontend/dist exists it is served
# same-origin, so the browser hits /api/* on the same host — no CORS needed.
_frontend_dist = BASE_DIR / "frontend" / "dist"
if _frontend_dist.is_dir():
    app.mount("/", StaticFiles(directory=str(_frontend_dist), html=True), name="frontend")
