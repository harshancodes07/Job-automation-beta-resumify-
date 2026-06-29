import { useState } from 'react';
import { motion } from 'framer-motion';
import { downloadTailored } from '../../api/tailorApi';
import { toast } from 'sonner';

interface Props {
  content: string;
}

export default function DownloadBar({ content }: Props) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (format: 'docx' | 'pdf') => {
    if (!content.trim()) {
      toast.error('No content to download');
      return;
    }
    setDownloading(format);
    try {
      const blob = await downloadTailored(content, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resumify_tailored.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} downloaded!`);
    } catch {
      toast.error(`Failed to download ${format.toUpperCase()}`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="flex gap-3">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex-1 px-5 py-3 rounded-xl text-sm font-medium bg-primary/20 text-primary-light border border-primary/30 hover:bg-primary/30 transition-all disabled:opacity-50"
        onClick={() => handleDownload('docx')}
        disabled={downloading !== null}
      >
        {downloading === 'docx' ? 'Generating...' : '📝 Download DOCX'}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex-1 px-5 py-3 rounded-xl text-sm font-medium bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25 transition-all disabled:opacity-50"
        onClick={() => handleDownload('pdf')}
        disabled={downloading !== null}
      >
        {downloading === 'pdf' ? 'Generating...' : '📄 Download PDF'}
      </motion.button>
    </div>
  );
}
