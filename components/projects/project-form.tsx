"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, X, ExternalLink, FolderOpen, Trash2 } from "lucide-react"
import Image from "next/image"

interface Category {
  id: string
  name: string
  slug: string
}

interface ProjectFormData {
  title: string
  description: string
  imageUrl: string
  link: string
  categoryId: string
}

export function ProjectForm() {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    imageUrl: "",
    link: "",
    categoryId: ""
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingImage, setDeletingImage] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const router = useRouter()

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories?limit=100")
        if (res.ok) {
          const data = await res.json()
          setCategories(data.categories)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])

  const handleImageUpload = async (file: File) => {
    if (!file) return

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/projects/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal upload gambar")
      }

      setFormData(prev => ({ ...prev, imageUrl: data.url }))
      setImagePreview(data.url)
      setSuccess("Gambar berhasil diupload!")
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Gagal upload gambar")
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar")
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB")
        return
      }

      handleImageUpload(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: "" }))
    setImagePreview(null)
  }

  const deleteImageFromServer = async (imageUrl: string) => {
    setDeletingImage(true)
    setError("")

    try {
      const response = await fetch("/api/projects/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghapus gambar")
      }

      setSuccess("Gambar berhasil dihapus dari server!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Gagal menghapus gambar")
    } finally {
      setDeletingImage(false)
    }
  }

  const handleDeleteImage = async () => {
    if (imagePreview) {
      // Delete from server first
      await deleteImageFromServer(imagePreview)
    }
    // Then remove from form
    removeImage()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat project")
      }

      setSuccess("Project berhasil dibuat!")
      setTimeout(() => {
        router.push("/dashboard/projects")
      }, 1500)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Form Project</CardTitle>
          <CardDescription>
            Isi informasi project Anda dengan lengkap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Judul Project *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Masukkan judul project"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Jelaskan project Anda secara detail"
                rows={5}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        <FolderOpen className="w-4 h-4 mr-2" />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Gambar Project</Label>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={400}
                      height={200}
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                      style={{ objectFit: 'cover' }}
                      priority={false}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteImage}
                        disabled={deletingImage}
                      >
                        {deletingImage ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={removeImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      {uploading ? (
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {uploading ? "Uploading..." : "Upload gambar project"}
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB (akan dikonversi ke WebP)
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Link */}
            <div className="space-y-2">
              <Label htmlFor="link">Link Project</Label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://example.com"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading || uploading || deletingImage}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Project"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/projects")}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 