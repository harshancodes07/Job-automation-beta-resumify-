import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { searchJobs } from '../../api/jobsApi';
import { toast } from 'sonner';

export default function SearchForm() {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const { isSearching, setIsSearching, setSearchResults, setStep, setError } =
    useAppStore();

  const handleSearch = async () => {
    if (!role.trim() || !location.trim()) {
      toast.error('Please enter both role and location');
      return;
    }

    setIsSearching(true);
    setError(null);
    try {
      const res = await searchJobs({
        role: role.trim(),
        location: location.trim(),
        filters: { remote_only: remoteOnly },
      });
      setSearchResults(res.search_id, res.listings, res.total);
      setStep('results');
      toast.success(`Found ${res.listings.length} jobs!`);
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Job search failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Search Jobs</h2>
        <p className="text-text-muted">Find matching positions across Indian job platforms</p>
      </div>

      <div className="glass p-6 space-y-5">
        <div>
          <label className="block text-sm text-text-muted mb-2">Target Role</label>
          <input
            type="text"
            className="w-full bg-dark/50 border border-dark-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors"
            placeholder="e.g. Frontend Developer, Data Scientist..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isSearching}
          />
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-2">Location</label>
          <input
            type="text"
            className="w-full bg-dark/50 border border-dark-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors"
            placeholder="e.g. Chennai, Bangalore, Mumbai..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isSearching}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={remoteOnly}
            onChange={(e) => setRemoteOnly(e.target.checked)}
            className="w-4 h-4 accent-primary"
            disabled={isSearching}
          />
          <span className="text-sm text-text">Remote only</span>
        </label>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glow-btn w-full text-lg py-4"
          onClick={handleSearch}
          disabled={isSearching || !role.trim() || !location.trim()}
        >
          {isSearching ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                ⟳
              </motion.span>
              Searching...
            </span>
          ) : (
            '🔍 Search Jobs'
          )}
        </motion.button>
      </div>

      <button
        className="text-text-muted text-sm hover:text-primary-light transition-colors"
        onClick={() => useAppStore.getState().setStep('resume')}
      >
        ← Back to Resume
      </button>
    </div>
  );
}
