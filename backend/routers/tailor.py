from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from backend.models.schemas import TailorRequest, TailorResponse, DownloadRequest
from backend.services.tailor_service import tailor, download_tailored

router = APIRouter()


@router.post("", response_model=TailorResponse)
async def tailor_resume(req: TailorRequest):
    try:
        return await tailor(req.resume_data, req.job_listing)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume tailoring failed: {str(e)}")


@router.post("/download")
async def download(req: DownloadRequest):
    if req.format not in ("docx", "pdf"):
        raise HTTPException(status_code=400, detail="Format must be 'docx' or 'pdf'")

    try:
        buf, content_type, filename = await download_tailored(req.tailored_content, req.format)
        return StreamingResponse(
            buf,
            media_type=content_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download generation failed: {str(e)}")
