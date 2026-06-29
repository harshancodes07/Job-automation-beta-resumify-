import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

interface Props {
  content: string;
  onChange: (text: string) => void;
}

export default function TailoredEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Your tailored resume will appear here...' }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none min-h-[300px] p-4 focus:outline-none text-sm leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getText());
    },
  });

  useEffect(() => {
    if (editor && content) {
      const html = content
        .split('\n')
        .map((line) => {
          const trimmed = line.trim();
          if (!trimmed) return '<br>';
          if (trimmed.startsWith('# ')) return `<h1>${trimmed.slice(2)}</h1>`;
          if (trimmed.startsWith('## ')) return `<h2>${trimmed.slice(3)}</h2>`;
          if (trimmed.startsWith('- ') || trimmed.startsWith('* '))
            return `<li>${trimmed.slice(2)}</li>`;
          return `<p>${trimmed}</p>`;
        })
        .join('');
      editor.commands.setContent(html);
    }
  }, [editor, content]);

  return (
    <div className="glass overflow-hidden">
      <div className="border-b border-dark-border px-4 py-2 flex items-center gap-1">
        <span className="text-xs text-text-muted">Editable — modify before downloading</span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
