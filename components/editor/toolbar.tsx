"use client"

import type { Editor } from "@tiptap/react"
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { useCallback } from "react"

type Props = {
  editor: Editor | null
}

export function Toolbar({ editor }: Props) {
  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    input.onchange = async () => {
      const files = input.files;
      if (files && files[0]) {
        const file = files[0];
        const formData = new FormData();
        formData.append("image", file);

        // Upload ke backend (endpoint: /api/posts/upload-image)
        const res = await fetch("/api/posts/upload-image", {
          method: "POST",
          body: formData,
        });

        // Cek apakah response OK
        if (!res.ok) {
          const text = await res.text();
          alert("Upload gagal: " + text);
          return;
        }

        // Cek content-type JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          alert("Upload gagal (bukan JSON): " + text);
          return;
        }

        // Parse JSON
        const data = await res.json();
        if (data.url) {
          editor?.chain().focus().setImage({ src: data.url }).run();
        } else {
          alert("Upload gagal: URL tidak ditemukan");
        }
      }
    };
    input.click();
  }, [editor]);

  if (!editor) {
    return null
  }

  return (
    <div className="border-b p-2 flex flex-wrap gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      
      <div className="mx-2 h-8 w-[1px] bg-gray-200" />

      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>

      <div className="mx-2 h-8 w-[1px] bg-gray-200" />

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: 'left' })}
        onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: 'center' })}
        onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: 'right' })}
        onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>
      
      <div className="mx-2 h-8 w-[1px] bg-gray-200" />
      
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      
      <button type="button" onClick={addImage} className="p-2 rounded-md hover:bg-gray-100">
        <ImageIcon className="h-4 w-4" />
      </button>
    </div>
  )
} 