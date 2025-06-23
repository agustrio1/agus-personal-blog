"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save, Send } from "lucide-react"

// Types
interface Category {
  id: string
  name: string
}

interface PostData {
  title: string
  content: string
  categoryId?: string
  published: boolean
}

interface PostFormProps {
  initialData?: PostData & { id: string }
  isEditing?: boolean
}

export function PostForm({ initialData, isEditing = false }: PostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "<p>Mulai menulis di sini...</p>")
  const [published, setPublished] = useState(initialData?.published || false)
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "none")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch categories
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories?limit=100") // Fetch all categories
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error("Failed to fetch categories", error)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("published", String(published))
      if (categoryId && categoryId !== "none") {
        formData.append("categoryId", categoryId)
      }

      const url = isEditing ? `/api/posts/${initialData?.id}` : "/api/posts"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Gagal ${isEditing ? 'memperbarui' : 'membuat'} post`)
      }

      router.push("/dashboard/posts")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-semibold">Judul Post</Label>
                <Input
                  id="title"
                  placeholder="Judul Artikel Anda"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl h-14 font-bold"
                  required
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Konten</CardTitle>
              <CardDescription>Tulis konten artikel Anda di sini menggunakan editor canggih kami.</CardDescription>
            </CardHeader>
            <CardContent>
                <TiptapEditor content={content} onChange={setContent} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa Kategori</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="published" className="text-base">Publikasikan</Label>
                  <p className="text-sm text-muted-foreground">
                    Jadikan post ini terlihat oleh publik.
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Aksi</CardTitle>
            </CardHeader>
            <CardContent>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                ) : isEditing ? (
                  <><Save className="mr-2 h-4 w-4" /> Simpan Perubahan</>
                ) : (
                  <><Send className="mr-2 h-4 w-4" /> Buat Post</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
} 