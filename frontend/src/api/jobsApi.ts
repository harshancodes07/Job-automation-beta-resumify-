import client from './client';
import type { SearchResponse } from '../stores/useAppStore';

export interface SearchParams {
  role: string;
  location: string;
  filters?: {
    remote_only?: boolean;
    min_salary?: number | null;
    max_salary?: number | null;
    experience_level?: string | null;
  };
  page?: number;
  per_page?: number;
}

export async function searchJobs(params: SearchParams): Promise<SearchResponse> {
  const { data } = await client.post('/jobs/search', params);
  return data;
}

export function getExportUrl(searchId: string): string {
  return `/api/jobs/export/${searchId}`;
}
