import httpx
from tools.job_provider_base import JobProvider
from backend.models.schemas import JobListing
from backend.config import ADZUNA_APP_ID, ADZUNA_API_KEY

ADZUNA_URL = "https://api.adzuna.com/v1/api/jobs/in/search/{page}"


class AdzunaProvider(JobProvider):
    def provider_name(self) -> str:
        return "adzuna"

    async def search(
        self,
        role: str,
        location: str,
        filters: dict,
        page: int = 1,
        per_page: int = 20,
    ) -> tuple[list[JobListing], int]:
        if not ADZUNA_APP_ID or not ADZUNA_API_KEY:
            raise ValueError(
                "ADZUNA_APP_ID and ADZUNA_API_KEY are not set. Add them to your .env file."
            )

        what = role
        if filters.get("remote_only"):
            what = f"{role} remote"

        params = {
            "app_id": ADZUNA_APP_ID,
            "app_key": ADZUNA_API_KEY,
            "results_per_page": str(per_page),
            "what": what,
            "where": location,
            "max_days_old": "30",
            "content-type": "application/json",
        }

        if filters.get("min_salary"):
            params["salary_min"] = str(filters["min_salary"])
        if filters.get("max_salary"):
            params["salary_max"] = str(filters["max_salary"])

        url = ADZUNA_URL.format(page=page)

        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()

        raw_jobs = data.get("results", [])
        total = data.get("count", len(raw_jobs))
        listings = []

        for i, job in enumerate(raw_jobs):
            salary_min = job.get("salary_min")
            salary_max = job.get("salary_max")
            salary_range = ""
            if salary_min and salary_max:
                salary_range = f"INR {int(salary_min):,}-{int(salary_max):,}/year"
            elif salary_min:
                salary_range = f"INR {int(salary_min):,}+/year"

            location_name = ""
            loc = job.get("location")
            if isinstance(loc, dict):
                location_name = loc.get("display_name", "")

            company_name = ""
            comp = job.get("company")
            if isinstance(comp, dict):
                company_name = comp.get("display_name", "")

            listings.append(
                JobListing(
                    id=str(job.get("id", f"adzuna_{page}_{i}")),
                    title=job.get("title", ""),
                    company=company_name,
                    location=location_name,
                    posted_date=job.get("created", "")[:10],
                    salary_range=salary_range,
                    source="Adzuna",
                    apply_url=job.get("redirect_url", ""),
                    description=job.get("description", "")[:2000],
                    is_remote=filters.get("remote_only", False),
                )
            )

        return listings, total
