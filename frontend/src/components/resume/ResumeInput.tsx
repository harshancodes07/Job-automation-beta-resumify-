import { useState } from 'react';
import { motion } from 'framer-motion';
import FileDropzone from './FileDropzone';
import PasteEditor from './PasteEditor';
import ParsedResumePreview from './ParsedResumePreview';
import { useAppStore } from '../../stores/useAppStore';
import { uploadResume, pasteResume } from '../../api/resumeApi';
import { toast } from 'sonner';

export default function ResumeInput() {
  const [tab, setTab] = useState<'upload' | 'paste'>('upload');
  const {
    resumeData,
    setResumeData,
    isParsingResume,
    setIsParsingResume,
    setStep,
    setError,
  } = useAppStore();

  const handleFile = async (file: File) => {
    setIsParsingResume(true);
    setError(null);
    try {
      const data = await uploadResume(file);
      setResumeData(data);
      toast.success('Resume parsed successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to parse resume';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsParsingResume(false);
    }
  };

  const handlePaste = async (text: string) => {
    setIsParsingResume(true);
    setError(null);
    try {
      const data = await pasteResume(text);
      setResumeData(data);
      toast.success('Resume parsed successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to parse resume';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsParsingResume(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Upload Your Resume</h2>
        <p className="text-text-muted">We'll extract your skills, experience, and education using AI</p>
      </div>

      <div className="flex gap-2">
        {(['upload', 'paste'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t
                ? 'bg-primary/20 text-primary-light border border-primary/40'
                : 'bg-dark-card text-text-muted border border-dark-border hover:border-primary/20'
            }`}
          >
            {t === 'upload' ? '📁 Upload File' : '📋 Paste Text'}
          </button>
        ))}
      </div>

      {tab === 'upload' ? (
        <FileDropzone onFile={handleFile} isLoading={isParsingResume} />
      ) : (
        <PasteEditor onSubmit={handlePaste} isLoading={isParsingResume} />
      )}

      <p className="text-xs text-text-muted leading-relaxed border border-dark-border rounded-xl p-3 bg-dark-card/40">
        🔒 <span className="text-text">Privacy:</span> Your resume is processed by
        Google Gemini (free tier), which may use submitted data to improve its
        products, and is deleted from our server immediately after parsing. Please
        don't upload anything you wouldn't be comfortable sharing with Google.
      </p>

      {resumeData && (
        <>
          <ParsedResumePreview data={resumeData} />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glow-btn w-full text-lg py-4"
            onClick={() => setStep('search')}
          >
            Continue to Job Search →
          </motion.button>
        </>
      )}
    </div>
  );
}
