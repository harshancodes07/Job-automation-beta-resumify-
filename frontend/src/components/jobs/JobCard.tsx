import { motion } from 'framer-motion';
import type { JobListing } from '../../stores/useAppStore';

interface Props {
  job: JobListing;
  onTailor: (job: JobListing) => void;
  index: number;
}

export default function JobCard({ job, onTailor, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass glass-hover p-5 space-y-3 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text truncate">{job.title}</h3>
          <p className="text-primary-light text-sm">{job.company}</p>
        </div>
        {job.is_remote && (
          <span className="shrink-0 px-2 py-1 rounded-lg text-xs bg-secondary/20 text-secondary border border-secondary/30">
            Remote
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-text-muted">
        {job.location && <span>📍 {job.location}</span>}
        {job.posted_date && <span>📅 {job.posted_date}</span>}
        {job.salary_range && <span>💰 {job.salary_range}</span>}
        {job.source && <span>🔗 {job.source}</span>}
      </div>

      {job.description && (
        <p className="text-sm text-text-muted line-clamp-3">{job.description}</p>
      )}

      <div className="flex gap-2 pt-1">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="glow-btn text-sm py-2 px-4 flex-1"
          onClick={() => onTailor(job)}
        >
          ✨ Tailor Resume
        </motion.button>
        {job.apply_url && (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-sm font-medium bg-dark-card border border-dark-border text-text-muted hover:border-primary/40 hover:text-primary-light transition-all text-center"
          >
            View ↗
          </a>
        )}
      </div>
    </motion.div>
  );
}
