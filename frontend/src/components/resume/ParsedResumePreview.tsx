import { motion } from 'framer-motion';
import type { ResumeData } from '../../stores/useAppStore';

interface Props {
  data: ResumeData;
}

export default function ParsedResumePreview({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary-light">Parsed Resume</h3>
        <span className="text-success text-sm">✓ Successfully parsed</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {data.name && (
          <div>
            <span className="text-text-muted">Name:</span>{' '}
            <span className="text-text font-medium">{data.name}</span>
          </div>
        )}
        {data.email && (
          <div>
            <span className="text-text-muted">Email:</span>{' '}
            <span className="text-text">{data.email}</span>
          </div>
        )}
      </div>

      {data.skills.length > 0 && (
        <div>
          <p className="text-text-muted text-sm mb-2">Skills:</p>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs bg-primary/20 text-primary-light border border-primary/30"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.experience.length > 0 && (
        <div>
          <p className="text-text-muted text-sm mb-2">
            Experience: {data.experience.length} position{data.experience.length !== 1 ? 's' : ''}
          </p>
          {data.experience.slice(0, 2).map((exp, i) => (
            <p key={i} className="text-sm text-text">
              {exp.title} at {exp.company} ({exp.dates})
            </p>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div>
          <p className="text-text-muted text-sm mb-2">Education:</p>
          {data.education.map((edu, i) => (
            <p key={i} className="text-sm text-text">
              {edu.degree} — {edu.institution} ({edu.year})
            </p>
          ))}
        </div>
      )}
    </motion.div>
  );
}
