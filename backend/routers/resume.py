from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.models.schemas import ResumeData, PasteResumeRequest
from backend.services.resume_service import process_upload, process_paste

router = APIRouter()


@router.post("/upload", response_model=ResumeData)
async def upload_resume(file: UploadFile = File(...)):
    try:
        return await process_upload(file)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")


@router.post("/paste", response_model=ResumeData)
async def paste_resume(req: PasteResumeRequest):
    try:
        return await process_paste(req.text)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")
