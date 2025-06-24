"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import CharacterCount from "@tiptap/extension-character-count"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
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
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        listItem: {},
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      CharacterCount.configure({
        limit: 20000,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[400px]",
        style: "line-height: 1.75; letter-spacing: 0.025em;",
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
      <div className="relative">
        <EditorContent editor={editor} />
      </div>
      <div className="border-t p-2 text-sm text-gray-500 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span>{editor.storage.characterCount.words()} kata</span>
          <span>{editor.storage.characterCount.characters()} karakter</span>
        </div>
        <div className="text-xs text-gray-400">
          Tekan Ctrl+K untuk membuat link
        </div>
      </div>
    </div>
  )
}