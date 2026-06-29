import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

interface Props {
  onFile: (file: File) => void;
  isLoading: boolean;
}

export default function FileDropzone({ onFile, isLoading }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) onFile(accepted[0]);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`glass glass-hover p-10 text-center transition-all duration-300 ${
          isDragActive ? 'border-primary shadow-[0_0_40px_rgba(108,92,231,0.3)]' : ''
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="flex flex-col items-center gap-4">
        <div className="text-5xl">
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              ⟳
            </motion.div>
          ) : (
            '📄'
          )}
        </div>
        <div>
          {isLoading ? (
            <p className="text-primary-light text-lg font-medium">Parsing your resume with AI...</p>
          ) : isDragActive ? (
            <p className="text-primary-light text-lg font-medium">Drop your resume here</p>
          ) : (
            <>
              <p className="text-lg font-medium mb-1">Drag & drop your resume</p>
              <p className="text-text-muted text-sm">PDF or DOCX — up to 10MB</p>
            </>
          )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
