import uuid
from pathlib import Path
from fastapi import UploadFile

from backend.config import UPLOADS_DIR, ALLOWED_EXTENSIONS, MAX_UPLOAD_SIZE_MB
from backend.models.schemas import ResumeData
from tools.resume_parser import extract_text
from tools.gemini_client import parse_resume


async def process_upload(file: UploadFile) -> ResumeData:
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Unsupported file type: {ext}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}")

    content = await file.read()
    if len(content) > MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise ValueError(f"File too large. Maximum size: {MAX_UPLOAD_SIZE_MB}MB")

    tmp_path = UPLOADS_DIR / f"{uuid.uuid4()}{ext}"
    try:
        tmp_path.write_bytes(content)
        raw_text = extract_text(str(tmp_path))
        parsed = parse_resume(raw_text)
        parsed["raw_text"] = raw_text
        return ResumeData(**parsed)
    finally:
        tmp_path.unlink(missing_ok=True)


async def process_paste(text: str) -> ResumeData:
    if not text.strip():
        raise ValueError("Resume text cannot be empty")

    parsed = parse_resume(text)
    parsed["raw_text"] = text
    return ResumeData(**parsed)
