"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PostForm } from "@/components/dashboard/posts/post-form"
import { Loader2 } from "lucide-react"

interface PostData {
  id: string;
  title: string;
  content: string;
  published: boolean;
  categoryId?: string;
}

export default function EditPostPage() {
  const params = useParams()
  const { id } = params
  const [post, setPost] = useState<PostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      async function fetchPost() {
        try {
          const response = await fetch(`/api/posts/${id}`)
          if (!response.ok) {
            throw new Error("Gagal memuat post")
          }
          const data = await response.json()
          setPost(data.post)
        } catch (err) {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan")
        } finally {
          setLoading(false)
        }
      }
      fetchPost()
    }
  }, [id])

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-4 mb-8">
                <h1 className="text-3xl font-bold">Edit Post</h1>
                <p className="text-gray-500">Perbarui artikel Anda menggunakan form di bawah ini.</p>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-10">{error}</div>
            ) : post ? (
                <PostForm initialData={post} isEditing={true} />
            ) : (
                <div className="text-center text-gray-500 py-10">Post tidak ditemukan.</div>
            )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 