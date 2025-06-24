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
  AlignRight,
  Link2,
  Unlink,
  Space,
  Minus
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { useCallback, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  editor: Editor | null
}

export function Toolbar({ editor }: Props) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")

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

  const openLinkDialog = useCallback(() => {
    const { from, to } = editor?.state.selection || { from: 0, to: 0 };
    const selectedText = editor?.state.doc.textBetween(from, to) || "";
    
    // Check if there's already a link
    const linkMark = editor?.getAttributes('link');
    if (linkMark?.href) {
      setLinkUrl(linkMark.href);
      setLinkText(selectedText);
    } else {
      setLinkUrl("");
      setLinkText(selectedText);
    }
    
    setIsLinkDialogOpen(true);
  }, [editor]);

  const addLink = useCallback(() => {
    if (linkUrl) {
      // If there's selected text, use it; otherwise use the link text from dialog
      const { from, to } = editor?.state.selection || { from: 0, to: 0 };
      const hasSelection = from !== to;
      
      if (hasSelection) {
        // Add link to selected text
        editor?.chain().focus().setLink({ href: linkUrl }).run();
      } else if (linkText) {
        // Insert new text with link
        editor?.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
      }
    }
    
    setIsLinkDialogOpen(false);
    setLinkUrl("");
    setLinkText("");
  }, [editor, linkUrl, linkText]);

  const removeLink = useCallback(() => {
    editor?.chain().focus().unsetLink().run();
  }, [editor]);

  const addLineBreak = useCallback(() => {
    editor?.chain().focus().setHardBreak().run();
  }, [editor]);

  const addHorizontalRule = useCallback(() => {
    editor?.chain().focus().setHorizontalRule().run();
  }, [editor]);

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="border-b p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
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

        {/* Headings */}
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

        {/* Text Alignment */}
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
        
        {/* Lists */}
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

        <div className="mx-2 h-8 w-[1px] bg-gray-200" />

        {/* Links */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={openLinkDialog}
          className={editor.isActive('link') ? 'bg-accent' : ''}
        >
          <Link2 className="h-4 w-4" />
        </Button>
        {editor.isActive('link') && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeLink}
          >
            <Unlink className="h-4 w-4" />
          </Button>
        )}

        <div className="mx-2 h-8 w-[1px] bg-gray-200" />

        {/* Media & Spacing */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLineBreak}
          title="Line Break"
        >
          <Space className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addHorizontalRule}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Link</DialogTitle>
            <DialogDescription>
              Masukkan URL dan teks untuk link Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="text" className="text-right">
                Teks
              </Label>
              <Input
                id="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Teks yang akan ditampilkan"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Batal
            </Button>
            <Button type="button" onClick={addLink}>
              Tambah Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}