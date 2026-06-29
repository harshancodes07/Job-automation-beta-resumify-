import re
import httpx
from tools.job_provider_base import JobProvider
from backend.models.schemas import JobListing
from backend.config import JOOBLE_API_KEY

JOOBLE_URL = "https://jooble.org/api/{key}"

_TAG_RE = re.compile(r"<[^>]+>")


def _strip_html(text: str) -> str:
    return _TAG_RE.sub("", text or "").replace("&nbsp;", " ").strip()


class JoobleProvider(JobProvider):
    def provider_name(self) -> str:
        return "jooble"

    async def search(
        self,
        role: str,
        location: str,
        filters: dict,
        page: int = 1,
        per_page: int = 20,
    ) -> tuple[list[JobListing], int]:
        if not JOOBLE_API_KEY:
            raise ValueError("JOOBLE_API_KEY is not set. Add it to your .env file.")

        keywords = role
        if filters.get("remote_only"):
            keywords = f"{role} remote"

        body: dict = {
            "keywords": keywords,
            "location": location,
            "page": str(page),
        }
        if filters.get("min_salary"):
            body["salary"] = str(filters["min_salary"])

        url = JOOBLE_URL.format(key=JOOBLE_API_KEY)

        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(url, json=body)
            resp.raise_for_status()
            data = resp.json()

        raw_jobs = data.get("jobs", [])
        total = data.get("totalCount", len(raw_jobs))
        listings = []

        for i, job in enumerate(raw_jobs[:per_page]):
            listings.append(
                JobListing(
                    id=str(job.get("id", f"jooble_{page}_{i}")),
                    title=job.get("title", ""),
                    company=job.get("company", ""),
                    location=job.get("location", ""),
                    posted_date=(job.get("updated", "") or "")[:10],
                    salary_range=job.get("salary", "") or "",
                    source=f"Jooble / {job.get('source', '')}".rstrip(" /"),
                    apply_url=job.get("link", ""),
                    description=_strip_html(job.get("snippet", ""))[:2000],
                    is_remote=filters.get("remote_only", False),
                )
            )

        return listings, total
