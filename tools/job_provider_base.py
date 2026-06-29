from abc import ABC, abstractmethod
from backend.models.schemas import JobListing


class JobProvider(ABC):
    @abstractmethod
    async def search(
        self,
        role: str,
        location: str,
        filters: dict,
        page: int = 1,
        per_page: int = 20,
    ) -> tuple[list[JobListing], int]:
        """Returns (listings, total_count)."""
        ...

    @abstractmethod
    def provider_name(self) -> str: ...
