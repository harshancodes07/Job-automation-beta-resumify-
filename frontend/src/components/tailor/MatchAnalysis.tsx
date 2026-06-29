import { motion } from 'framer-motion';
import type { TailorResult } from '../../stores/useAppStore';

interface Props {
  result: TailorResult;
}

export default function MatchAnalysis({ result }: Props) {
  return (
    <div className="glass p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary-light">Match Analysis</h3>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`text-2xl font-bold px-4 py-1 rounded-xl ${
            result.match_score >= 70
              ? 'text-success bg-success/10'
              : result.match_score >= 40
                ? 'text-warning bg-warning/10'
                : 'text-danger bg-danger/10'
          }`}
        >
          {Math.round(result.match_score)}%
        </motion.div>
      </div>

      {result.matched_keywords.length > 0 && (
        <div>
          <p className="text-sm text-text-muted mb-2">Matched Keywords</p>
          <div className="flex flex-wrap gap-2">
            {result.matched_keywords.map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs bg-success/15 text-success border border-success/30"
              >
                ✓ {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.gap_keywords.length > 0 && (
        <div>
          <p className="text-sm text-text-muted mb-2">Gap Keywords</p>
          <div className="flex flex-wrap gap-2">
            {result.gap_keywords.map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs bg-danger/15 text-danger border border-danger/30"
              >
                ✗ {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.suggestions.length > 0 && (
        <div>
          <p className="text-sm text-text-muted mb-2">Suggestions</p>
          <ul className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li key={i} className="text-sm text-text flex gap-2">
                <span className="text-primary shrink-0">→</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
