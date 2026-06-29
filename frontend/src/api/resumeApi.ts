import client from './client';
import type { ResumeData } from '../stores/useAppStore';

export async function uploadResume(file: File): Promise<ResumeData> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await client.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function pasteResume(text: string): Promise<ResumeData> {
  const { data } = await client.post('/resume/paste', { text });
  return data;
}
