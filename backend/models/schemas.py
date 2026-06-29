from pydantic import BaseModel, Field
from typing import Optional


class ExperienceItem(BaseModel):
    title: str = ""
    company: str = ""
    dates: str = ""
    bullets: list[str] = Field(default_factory=list)


class EducationItem(BaseModel):
    degree: str = ""
    institution: str = ""
    year: str = ""


class ResumeData(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    summary: str = ""
    skills: list[str] = Field(default_factory=list)
    experience: list[ExperienceItem] = Field(default_factory=list)
    education: list[EducationItem] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    raw_text: str = ""


class JobListing(BaseModel):
    id: str
    title: str
    company: str
    location: str
    posted_date: str = ""
    salary_range: str = ""
    source: str = ""
    apply_url: str = ""
    description: str = ""
    is_remote: bool = False


class SearchFilters(BaseModel):
    remote_only: bool = False
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    experience_level: Optional[str] = None


class SearchRequest(BaseModel):
    role: str
    location: str
    filters: SearchFilters = Field(default_factory=SearchFilters)
    page: int = 1
    per_page: int = 20


class SearchResponse(BaseModel):
    search_id: str
    listings: list[JobListing]
    total: int
    page: int


class PasteResumeRequest(BaseModel):
    text: str


class TailorRequest(BaseModel):
    resume_data: ResumeData
    job_listing: JobListing


class TailorResponse(BaseModel):
    tailored_resume_text: str
    matched_keywords: list[str] = Field(default_factory=list)
    gap_keywords: list[str] = Field(default_factory=list)
    match_score: float = 0.0
    suggestions: list[str] = Field(default_factory=list)


class DownloadRequest(BaseModel):
    tailored_content: str
    format: str = "docx"
