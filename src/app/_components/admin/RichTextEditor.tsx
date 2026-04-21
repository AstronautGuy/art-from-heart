"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Strikethrough, List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex border-b border-gray-200 bg-gray-50 p-1 space-x-1 rounded-t-md">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bold") ? "bg-gray-200 text-slate-900" : "text-gray-500"}`}
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("italic") ? "bg-gray-200 text-slate-900" : "text-gray-500"}`}
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("strike") ? "bg-gray-200 text-slate-900" : "text-gray-500"}`}
      >
        <Strikethrough className="h-4 w-4" />
      </button>
      <div className="w-px bg-gray-300 my-1 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bulletList") ? "bg-gray-200 text-slate-900" : "text-gray-500"}`}
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("orderedList") ? "bg-gray-200 text-slate-900" : "text-gray-500"}`}
      >
        <ListOrdered className="h-4 w-4" />
      </button>
    </div>
  );
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base focus:outline-none max-w-none p-4 min-h-[150px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white focus-within:ring-1 focus-within:ring-slate-500 focus-within:border-slate-500">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
