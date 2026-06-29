import { useState } from 'react';

interface Props {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export default function PasteEditor({ onSubmit, isLoading }: Props) {
  const [text, setText] = useState('');

  return (
    <div className="glass p-6 space-y-4">
      <textarea
        className="w-full h-48 bg-dark/50 border border-dark-border rounded-xl p-4 text-text resize-none focus:outline-none focus:border-primary transition-colors"
        placeholder="Paste your resume text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
      />
      <button
        className="glow-btn w-full"
        onClick={() => onSubmit(text)}
        disabled={!text.trim() || isLoading}
      >
        {isLoading ? 'Parsing...' : 'Parse Resume'}
      </button>
    </div>
  );
}
