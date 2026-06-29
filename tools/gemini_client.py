import json
import time
from google import genai
from google.genai import errors as genai_errors
from backend.config import GEMINI_API_KEY

_client: genai.Client | None = None
_MODEL = "gemini-2.5-flash"

# Retry transient server/rate errors with exponential backoff
_RETRY_CODES = {429, 500, 503}
_MAX_RETRIES = 4


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set. Add it to your .env file.")
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def _generate(contents: str, temperature: float) -> str:
    last_exc: Exception | None = None
    for attempt in range(_MAX_RETRIES):
        try:
            response = _get_client().models.generate_content(
                model=_MODEL,
                contents=contents,
                config={
                    "response_mime_type": "application/json",
                    "temperature": temperature,
                },
            )
            return response.text
        except genai_errors.APIError as e:
            if e.code in _RETRY_CODES and attempt < _MAX_RETRIES - 1:
                wait = 2 ** attempt  # 1s, 2s, 4s
                time.sleep(wait)
                last_exc = e
                continue
            raise
    if last_exc:
        raise last_exc
    raise RuntimeError("Gemini request failed without a response")


PARSE_RESUME_PROMPT = """You are a resume parser. Extract structured data from the following resume text.
Return ONLY valid JSON matching this exact schema:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "summary": "string (professional summary or objective)",
  "skills": ["string"],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "dates": "string",
      "bullets": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string"
    }
  ],
  "certifications": ["string"]
}

If a field cannot be determined from the text, use an empty string or empty list.
Do NOT invent or hallucinate information not present in the text.

Resume text:
"""

TAILOR_RESUME_PROMPT = """You are an expert resume writer. Given the candidate's resume data and a target job description, optimize the resume for this specific role.

Rules:
- NEVER fabricate experience, skills, or credentials
- Only rephrase, reorder, and emphasize existing information
- Highlight transferable skills that match the job description
- Use keywords from the job description where the candidate genuinely has the skill

Candidate Resume:
{resume_json}

Target Job:
Title: {job_title}
Company: {job_company}
Description: {job_description}

Return ONLY valid JSON matching this schema:
{{
  "tailored_resume_text": "string (the full rewritten resume as formatted text)",
  "matched_keywords": ["keywords from JD that the candidate already has"],
  "gap_keywords": ["keywords from JD missing from the resume"],
  "match_score": float (0-100, how well the resume matches),
  "suggestions": ["3-5 specific improvement suggestions"]
}}
"""


def parse_resume(raw_text: str) -> dict:
    text = _generate(PARSE_RESUME_PROMPT + raw_text, temperature=0.1)
    return json.loads(text)


def tailor_resume(resume_data: dict, job_listing: dict) -> dict:
    prompt = TAILOR_RESUME_PROMPT.format(
        resume_json=json.dumps(resume_data, indent=2),
        job_title=job_listing.get("title", ""),
        job_company=job_listing.get("company", ""),
        job_description=job_listing.get("description", ""),
    )
    text = _generate(prompt, temperature=0.3)
    return json.loads(text)
