"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useDebounce } from "use-debounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye, FolderOpen, Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

// Define types based on API response
interface Post {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  createdAt: string;
  category: { name: string } | null;
  author: { name: string } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function PostsClient() {
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [debouncedSearch] = useDebounce(search, 500)
  const router = useRouter()

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          search: debouncedSearch,
        })
        const response = await fetch(`/api/posts?${params.toString()}`)
        if (!response.ok) {
          throw new Error("Gagal memuat data post")
        }
        const data = await response.json()
        setPosts(data.posts)
        setPagination(data.pagination)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [page, debouncedSearch])

  const handleDelete = async (postId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus post ini?")) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
        })
        if (!response.ok) {
          throw new Error("Gagal menghapus post")
        }
        setPosts(posts.filter(p => p.id !== postId))
      } catch (err) {
        alert(err instanceof Error ? err.message : "Terjadi kesalahan")
      }
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (pagination?.totalPages ?? 1)) {
      setPage(newPage)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Post</h1>
          <p className="text-gray-500">Buat, edit, dan kelola semua post blog Anda.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/posts/new">
            <Plus className="mr-2 h-4 w-4" /> Buat Post Baru
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Daftar Post</CardTitle>
              <CardDescription>Total {pagination?.total ?? 0} post ditemukan.</CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Cari post berdasarkan judul..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {post.category ? (
                            <span className="flex items-center">
                              <FolderOpen className="w-4 h-4 mr-2 text-gray-500" />
                              {post.category.name}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                            {new Date(post.createdAt).toLocaleDateString("id-ID")}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Buka menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/posts/${post.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/posts/${post.slug}`)}>
                                <Eye className="mr-2 h-4 w-4" /> Lihat
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(post.id)}>
                                <Trash className="mr-2 h-4 w-4" /> Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Tidak ada post ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {pagination && pagination.totalPages > 1 && (
           <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-gray-600">
              Halaman {pagination.page} dari {pagination.totalPages}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={!pagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Sebelumnya</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={!pagination.hasNext}
              >
                 <span className="mr-2">Berikutnya</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
} 