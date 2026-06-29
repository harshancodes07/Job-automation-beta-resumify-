import httpx
from tools.job_provider_base import JobProvider
from backend.models.schemas import JobListing
from backend.config import JSEARCH_API_KEY

JSEARCH_URL = "https://jsearch.p.rapidapi.com/search"


class JSearchProvider(JobProvider):
    def provider_name(self) -> str:
        return "jsearch"

    async def search(
        self,
        role: str,
        location: str,
        filters: dict,
        page: int = 1,
        per_page: int = 20,
    ) -> tuple[list[JobListing], int]:
        query = f"{role} in {location}"
        params = {
            "query": query,
            "page": str(page),
            "num_pages": "1",
            "country": "in",
            "date_posted": "month",
        }

        if filters.get("remote_only"):
            params["remote_jobs_only"] = "true"

        headers = {
            "x-rapidapi-key": JSEARCH_API_KEY,
            "x-rapidapi-host": "jsearch.p.rapidapi.com",
        }

        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(JSEARCH_URL, headers=headers, params=params)
            resp.raise_for_status()
            data = resp.json()

        raw_jobs = data.get("data", [])
        listings = []

        for i, job in enumerate(raw_jobs[:per_page]):
            salary_min = job.get("job_min_salary") or ""
            salary_max = job.get("job_max_salary") or ""
            salary_range = ""
            if salary_min and salary_max:
                currency = job.get("job_salary_currency", "INR")
                period = job.get("job_salary_period", "YEAR")
                salary_range = f"{currency} {salary_min}-{salary_max}/{period}"
            elif salary_min:
                salary_range = f"{job.get('job_salary_currency', 'INR')} {salary_min}+"

            listings.append(
                JobListing(
                    id=job.get("job_id", f"jsearch_{page}_{i}"),
                    title=job.get("job_title", ""),
                    company=job.get("employer_name", ""),
                    location=job.get("job_city", job.get("job_state", job.get("job_country", ""))),
                    posted_date=job.get("job_posted_at_datetime_utc", "")[:10],
                    salary_range=salary_range,
                    source="JSearch",
                    apply_url=job.get("job_apply_link", ""),
                    description=job.get("job_description", "")[:2000],
                    is_remote=job.get("job_is_remote", False),
                )
            )

        total = len(listings)
        return listings, total
