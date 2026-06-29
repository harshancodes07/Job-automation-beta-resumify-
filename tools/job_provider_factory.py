from tools.job_provider_base import JobProvider
from tools.job_provider_jsearch import JSearchProvider
from tools.job_provider_adzuna import AdzunaProvider
from tools.job_provider_jooble import JoobleProvider
from backend.config import JOB_PROVIDER

_PROVIDERS: dict[str, type[JobProvider]] = {
    "jsearch": JSearchProvider,
    "adzuna": AdzunaProvider,
    "jooble": JoobleProvider,
}


def get_provider(name: str | None = None) -> JobProvider:
    provider_name = name or JOB_PROVIDER
    provider_cls = _PROVIDERS.get(provider_name)
    if not provider_cls:
        raise ValueError(
            f"Unknown job provider: {provider_name}. Available: {list(_PROVIDERS.keys())}"
        )
    return provider_cls()
