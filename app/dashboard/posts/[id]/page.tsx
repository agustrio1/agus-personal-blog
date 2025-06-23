"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, User, FolderOpen } from "lucide-react"

interface PostDetail {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  author?: { name: string; email: string };
  category?: { name: string; slug: string };
  images?: { id: string; url: string; alt: string }[];
}

export default function PostDetailPage() {
  const params = useParams()
  const { id: slug } = params
  const [post, setPost] = useState<PostDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      async function fetchPost() {
        try {
          const response = await fetch(`/api/posts/slug/${slug}`)
          if (!response.ok) {
            throw new Error("Post tidak ditemukan")
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
  }, [slug])

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold">Lihat Post</h1>
            <p className="text-gray-500">Detail artikel yang dipilih.</p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : post ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl font-bold mb-2">{post.title}</CardTitle>
                <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500 mb-2">
                  <span className="flex items-center"><User className="w-4 h-4 mr-1" />{post.author?.name}</span>
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(post.createdAt).toLocaleDateString("id-ID")}</span>
                  {post.category && (
                    <span className="flex items-center"><FolderOpen className="w-4 h-4 mr-1" />{post.category.name}</span>
                  )}
                  <Badge variant={post.published ? "default" : "secondary"} className={post.published ? "bg-green-100 text-green-700 border border-green-200" : "bg-amber-100 text-amber-700 border border-amber-200"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* {post.images && post.images.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    {post.images.map((img) => (
                      <div key={img.id} className="w-40 h-28 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                        <img src={img.url} alt={img.alt || post.title} className="object-cover w-full h-full" />
                      </div>
                    ))}
                  </div>
                )} */}
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
              </CardContent>
            </Card>
          ) : (
            <div className="text-center text-gray-500 py-10">Post tidak ditemukan.</div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 