import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import type { JobListing } from '../../stores/useAppStore';
import JobCard from './JobCard';
import { getExportUrl } from '../../api/jobsApi';
import { tailorResume } from '../../api/tailorApi';
import { toast } from 'sonner';

export default function JobResults() {
  const {
    listings,
    searchId,
    resumeData,
    setSelectedJob,
    setTailorResult,
    setIsTailoring,
    setStep,
  } = useAppStore();

  const handleExport = () => {
    if (!searchId) return;
    window.open(getExportUrl(searchId), '_blank');
    toast.success('Excel download started!');
  };

  const handleTailor = async (job: JobListing) => {
    if (!resumeData) {
      toast.error('Please upload a resume first');
      return;
    }
    setSelectedJob(job);
    setIsTailoring(true);
    setStep('tailor');
    try {
      const result = await tailorResume(resumeData, job);
      setTailorResult(result);
      toast.success('Resume tailored!');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Tailoring failed';
      toast.error(msg);
    } finally {
      setIsTailoring(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Job Listings</h2>
          <p className="text-text-muted text-sm">{listings.length} results found</p>
        </div>
        {searchId && listings.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-success/20 text-success border border-success/30 hover:bg-success/30 transition-all"
            onClick={handleExport}
          >
            📊 Export Excel
          </motion.button>
        )}
      </div>

      {listings.length === 0 ? (
        <div className="glass p-10 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-text-muted">No jobs found. Try different search terms.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {listings.map((job, i) => (
            <JobCard key={job.id} job={job} onTailor={handleTailor} index={i} />
          ))}
        </div>
      )}

      <button
        className="text-text-muted text-sm hover:text-primary-light transition-colors"
        onClick={() => setStep('search')}
      >
        ← Back to Search
      </button>
    </div>
  );
}
