from backend.models.schemas import ResumeData, JobListing, TailorResponse
from tools.gemini_client import tailor_resume
from tools.resume_generator import generate_docx, generate_pdf
from io import BytesIO


async def tailor(resume_data: ResumeData, job_listing: JobListing) -> TailorResponse:
    resume_dict = resume_data.model_dump()
    job_dict = job_listing.model_dump()
    result = tailor_resume(resume_dict, job_dict)
    return TailorResponse(**result)


async def download_tailored(content: str, fmt: str) -> tuple[BytesIO, str, str]:
    if fmt == "pdf":
        buf = generate_pdf(content)
        return buf, "application/pdf", "resumify_tailored.pdf"
    else:
        buf = generate_docx(content)
        content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        return buf, content_type, "resumify_tailored.docx"
