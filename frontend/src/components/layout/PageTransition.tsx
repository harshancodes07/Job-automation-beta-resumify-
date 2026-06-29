import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  keyVal: string;
}

export default function PageTransition({ children, keyVal }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyVal}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
