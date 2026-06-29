import { create } from 'zustand';

export interface ExperienceItem {
  title: string;
  company: string;
  dates: string;
  bullets: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: string[];
  raw_text: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  posted_date: string;
  salary_range: string;
  source: string;
  apply_url: string;
  description: string;
  is_remote: boolean;
}

export interface SearchResponse {
  search_id: string;
  listings: JobListing[];
  total: number;
  page: number;
}

export interface TailorResult {
  tailored_resume_text: string;
  matched_keywords: string[];
  gap_keywords: string[];
  match_score: number;
  suggestions: string[];
}

type Step = 'resume' | 'search' | 'results' | 'tailor';

interface AppState {
  entered: boolean;
  enter: () => void;

  step: Step;
  setStep: (step: Step) => void;

  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData) => void;

  isParsingResume: boolean;
  setIsParsingResume: (v: boolean) => void;

  searchId: string | null;
  listings: JobListing[];
  totalJobs: number;
  setSearchResults: (id: string, listings: JobListing[], total: number) => void;

  isSearching: boolean;
  setIsSearching: (v: boolean) => void;

  selectedJob: JobListing | null;
  setSelectedJob: (job: JobListing | null) => void;

  tailorResult: TailorResult | null;
  setTailorResult: (result: TailorResult | null) => void;

  isTailoring: boolean;
  setIsTailoring: (v: boolean) => void;

  error: string | null;
  setError: (msg: string | null) => void;

  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  entered: false,
  enter: () => set({ entered: true }),

  step: 'resume',
  setStep: (step) => set({ step }),

  resumeData: null,
  setResumeData: (data) => set({ resumeData: data }),

  isParsingResume: false,
  setIsParsingResume: (v) => set({ isParsingResume: v }),

  searchId: null,
  listings: [],
  totalJobs: 0,
  setSearchResults: (id, listings, total) =>
    set({ searchId: id, listings, totalJobs: total }),

  isSearching: false,
  setIsSearching: (v) => set({ isSearching: v }),

  selectedJob: null,
  setSelectedJob: (job) => set({ selectedJob: job }),

  tailorResult: null,
  setTailorResult: (result) => set({ tailorResult: result }),

  isTailoring: false,
  setIsTailoring: (v) => set({ isTailoring: v }),

  error: null,
  setError: (msg) => set({ error: msg }),

  reset: () =>
    set({
      entered: false,
      step: 'resume',
      resumeData: null,
      searchId: null,
      listings: [],
      totalJobs: 0,
      selectedJob: null,
      tailorResult: null,
      error: null,
    }),
}));
