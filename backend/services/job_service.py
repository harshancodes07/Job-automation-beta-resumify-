import time
import uuid
from backend.models.schemas import SearchRequest, SearchResponse, JobListing
from backend.config import JOB_CACHE_TTL_SECONDS
from tools.job_provider_factory import get_provider

_cache: dict[str, dict] = {}


def _clean_expired():
    now = time.time()
    expired = [k for k, v in _cache.items() if now - v["created"] > JOB_CACHE_TTL_SECONDS]
    for k in expired:
        del _cache[k]


def _cache_key(req: SearchRequest) -> str:
    return f"{req.role}|{req.location}|{req.filters.model_dump_json()}|{req.page}"


async def search_jobs(req: SearchRequest) -> SearchResponse:
    _clean_expired()

    key = _cache_key(req)
    for sid, entry in _cache.items():
        if entry["key"] == key:
            return SearchResponse(
                search_id=sid,
                listings=entry["listings"],
                total=entry["total"],
                page=req.page,
            )

    provider = get_provider()
    listings, total = await provider.search(
        role=req.role,
        location=req.location,
        filters=req.filters.model_dump(),
        page=req.page,
        per_page=req.per_page,
    )

    search_id = str(uuid.uuid4())
    _cache[search_id] = {
        "key": key,
        "listings": listings,
        "total": total,
        "created": time.time(),
    }

    return SearchResponse(
        search_id=search_id,
        listings=listings,
        total=total,
        page=req.page,
    )


def get_cached_listings(search_id: str) -> list[JobListing] | None:
    entry = _cache.get(search_id)
    if entry is None:
        return None
    if time.time() - entry["created"] > JOB_CACHE_TTL_SECONDS:
        del _cache[search_id]
        return None
    return entry["listings"]
