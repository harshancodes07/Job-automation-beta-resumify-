import { motion } from 'framer-motion';
import { useAppStore } from '../stores/useAppStore';

export default function LandingPage() {
  const enter = useAppStore((s) => s.enter);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl"
      >
        <motion.h1
          className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Resumify
        </motion.h1>

        <motion.p
          className="text-xl text-text-muted mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Upload your resume, search for jobs across India, and get
          AI-tailored versions optimized for each position.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glow-btn text-lg px-10 py-4"
            onClick={() => enter()}
          >
            Get Started →
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[
            { icon: '📄', title: 'Smart Parsing', desc: 'AI extracts skills & experience from your resume' },
            { icon: '🔍', title: 'Job Search', desc: 'Find listings across Indian job platforms' },
            { icon: '✨', title: 'AI Tailoring', desc: 'Get optimized resumes for specific roles' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              whileHover={{ y: -5 }}
              className="glass glass-hover p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.15 }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-text-muted">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
