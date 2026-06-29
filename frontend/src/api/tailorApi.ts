import client from './client';
import type { ResumeData, JobListing, TailorResult } from '../stores/useAppStore';

export async function tailorResume(
  resumeData: ResumeData,
  jobListing: JobListing
): Promise<TailorResult> {
  const { data } = await client.post('/tailor', {
    resume_data: resumeData,
    job_listing: jobListing,
  });
  return data;
}

export async function downloadTailored(
  content: string,
  format: 'docx' | 'pdf'
): Promise<Blob> {
  const { data } = await client.post(
    '/tailor/download',
    { tailored_content: content, format },
    { responseType: 'blob' }
  );
  return data;
}
