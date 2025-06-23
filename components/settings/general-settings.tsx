"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface GeneralSettingsData {
  blogName: string
  blogDescription: string
}

export function GeneralSettings() {
  const [formData, setFormData] = useState<GeneralSettingsData>({
    blogName: "",
    blogDescription: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true)
      try {
        const res = await fetch("/api/settings/general")
        if (!res.ok) throw new Error("Gagal memuat pengaturan.")
        const data = await res.json()
        setFormData({
          blogName: data.blogName || "",
          blogDescription: data.blogDescription || "",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.")
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch("/api/settings/general", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Gagal menyimpan pengaturan.")
      }
      setSuccess("Pengaturan berhasil disimpan!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Memuat pengaturan...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Informasi Situs</h3>
          <p className="text-sm text-muted-foreground">
            Pengaturan ini akan memengaruhi SEO dan tampilan publik blog Anda.
          </p>
        </div>
        <div className="space-y-2 max-w-lg">
          <Label htmlFor="blogName">Judul Blog</Label>
          <Input
            id="blogName"
            value={formData.blogName}
            onChange={e => setFormData({ ...formData, blogName: e.target.value })}
          />
        </div>
        <div className="space-y-2 max-w-lg">
          <Label htmlFor="blogDescription">Deskripsi Blog</Label>
          <Textarea
            id="blogDescription"
            value={formData.blogDescription}
            onChange={e => setFormData({ ...formData, blogDescription: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Simpan Pengaturan"
        )}
      </Button>

      {success && <p className="text-sm text-green-600 mt-2">{success}</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </form>
  )
} 