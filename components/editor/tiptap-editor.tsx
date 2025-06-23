"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import CharacterCount from "@tiptap/extension-character-count"
import TextAlign from "@tiptap/extension-text-align"
import { Toolbar } from "./toolbar"

interface TiptapEditorProps {
  content: string
  onChange: (richText: string) => void
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: false, // Allows images to be on their own line
        allowBase64: false, // Disallow base64 images
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CharacterCount.configure({
        limit: 20000,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-md">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="border-t p-2 text-sm text-gray-500 flex justify-end">
        {editor.storage.characterCount.words()} kata
      </div>
    </div>
  )
} 