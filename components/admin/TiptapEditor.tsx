'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  Type 
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string, json: any) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[400px] p-4 bg-white rounded-b-2xl border-x border-b border-slate-100 text-slate-700',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const MenuBar = () => {
    return (
      <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-100 rounded-t-2xl border-b-0">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg transition-all ${editor.isActive('heading', { level: 1 }) ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:bg-white'}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:bg-white'}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg transition-all ${editor.isActive('heading', { level: 3 }) ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:bg-white'}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-slate-200 mx-1 self-center" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded-lg transition-all ${editor.isActive('paragraph') ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:bg-white'}`}
          title="Paragraph"
        >
          <Type className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-all ${editor.isActive('bold') ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:bg-white'}`}
          title="Bold"
        >
          <BoldIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-all ${editor.isActive('italic') ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:bg-white'}`}
          title="Italic"
        >
          <ItalicIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-all ${editor.isActive('bulletList') ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:bg-white'}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="editor-container">
      <MenuBar />
      <EditorContent editor={editor} />
      <style jsx global>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
