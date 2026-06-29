import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import MatchAnalysis from './MatchAnalysis';
import TailoredEditor from './TailoredEditor';
import DownloadBar from './DownloadBar';

export default function TailorPanel() {
  const { selectedJob, tailorResult, isTailoring, setStep } = useAppStore();
  const [editedContent, setEditedContent] = useState('');

  const displayContent = editedContent || tailorResult?.tailored_resume_text || '';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tailored Resume</h2>
        {selectedJob && (
          <p className="text-text-muted">
            Optimized for{' '}
            <span className="text-primary-light font-medium">{selectedJob.title}</span> at{' '}
            <span className="text-secondary">{selectedJob.company}</span>
          </p>
        )}
      </div>

      {isTailoring ? (
        <div className="glass p-16 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-6 inline-block"
          >
            ✨
          </motion.div>
          <p className="text-lg text-primary-light font-medium">AI is tailoring your resume...</p>
          <p className="text-text-muted text-sm mt-2">This may take 10-20 seconds</p>
        </div>
      ) : tailorResult ? (
        <>
          <MatchAnalysis result={tailorResult} />
          <TailoredEditor
            content={tailorResult.tailored_resume_text}
            onChange={setEditedContent}
          />
          <DownloadBar content={displayContent} />
        </>
      ) : null}

      <button
        className="text-text-muted text-sm hover:text-primary-light transition-colors"
        onClick={() => setStep('results')}
      >
        ← Back to Results
      </button>
    </div>
  );
}
