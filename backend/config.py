import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
# In production (e.g. Hugging Face), set DATA_DIR=/tmp/resumify so uploads land on
# an ephemeral, writable, auto-wiped path. Locally it defaults to ./.tmp
TMP_DIR = Path(os.getenv("DATA_DIR", str(BASE_DIR / ".tmp")))
UPLOADS_DIR = TMP_DIR / "uploads"
EXPORTS_DIR = TMP_DIR / "exports"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
EXPORTS_DIR.mkdir(parents=True, exist_ok=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
JSEARCH_API_KEY = os.getenv("JSEARCH_API_KEY", "")
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID", "")
ADZUNA_API_KEY = os.getenv("ADZUNA_API_KEY", "")
JOOBLE_API_KEY = os.getenv("JOOBLE_API_KEY", "")

JOB_PROVIDER = os.getenv("JOB_PROVIDER", "jsearch")
JOB_PROVIDER_FALLBACKS = os.getenv("JOB_PROVIDER_FALLBACKS", "adzuna,jooble").split(",")

MAX_UPLOAD_SIZE_MB = 10
ALLOWED_EXTENSIONS = {".pdf", ".docx"}

JOB_CACHE_TTL_SECONDS = 1800

# Comma-separated list of allowed CORS origins. In production the frontend is served
# same-origin by FastAPI so this can stay empty; for local dev we allow the Vite port.
ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if o.strip()
]

# Per-IP rate limit guarding our own endpoints (protects free API quotas).
RATE_LIMIT = os.getenv("RATE_LIMIT", "30/minute")
