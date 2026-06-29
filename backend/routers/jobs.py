from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from backend.models.schemas import SearchRequest, SearchResponse
from backend.services.job_service import search_jobs, get_cached_listings
from tools.excel_exporter import export_to_excel

router = APIRouter()


@router.post("/search", response_model=SearchResponse)
async def search(req: SearchRequest):
    try:
        return await search_jobs(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job search failed: {str(e)}")


@router.get("/export/{search_id}")
async def export_excel(search_id: str):
    listings = get_cached_listings(search_id)
    if listings is None:
        raise HTTPException(
            status_code=404,
            detail="Search results not found or expired. Please search again.",
        )

    buf = export_to_excel(listings)
    return StreamingResponse(
        buf,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=resumify_jobs.xlsx"},
    )
