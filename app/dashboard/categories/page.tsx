"use client"

import { useState, useEffect, useCallback } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FolderOpen, MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { PaginationControls } from "@/components/dashboard/pagination-controls"

interface Category {
  id: string
  name: string
  slug: string
  createdAt: string
  _count: {
    posts: number
    projects: number
  }
}

function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const fetchCategories = useCallback(async (page: number) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/categories?page=${page}&limit=10`)
      if (!response.ok) throw new Error("Gagal mengambil data")
      const data = await response.json()
      setCategories(data.data)
      setCurrentPage(data.page)
      setTotalPages(data.totalPages)
      setTotalItems(data.total)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Terjadi kesalahan")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories(currentPage)
  }, [currentPage, fetchCategories])

  const handleDelete = async () => {
    if (!selectedCategory) return
    setIsDeleting(true)
    setError("")
    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Gagal menghapus kategori")
      }
      // Reload categories. If it was the last item on a page, go to the previous page.
      if (categories.length === 1 && currentPage > 1) {
        fetchCategories(currentPage - 1)
      } else {
        fetchCategories(currentPage)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Terjadi kesalahan")
      }
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setSelectedCategory(null)
    }
  }

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Kategori</h1>
          <p className="text-gray-600 mt-1">Buat dan kelola kategori untuk konten Anda</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/categories/new">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kategori
          </Link>
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Daftar Kategori</CardTitle>
              <CardDescription>
                Ditemukan {totalItems} kategori.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 text-gray-400 mx-auto animate-spin mb-4" />
              <p>Memuat data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : categories.length > 0 ? (
            <><div className="overflow-x-auto rounded-lg" aria-label="Tabel kategori">
                  <Table className="min-w-[600px] md:min-w-full text-sm">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Kategori</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Jumlah Konten</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.slug}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{category._count.posts} Posts</Badge>
                            <Badge variant="secondary" className="ml-2">{category._count.projects} Projects</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Aksi kategori">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/categories/${category.id}`} aria-label={`Edit kategori ${category.name}`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openDeleteDialog(category)} aria-label={`Hapus kategori ${category.name}`}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Hapus</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div><PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)} /></>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada kategori</h3>
              <p className="text-gray-500 mb-6">Mulai dengan membuat kategori pertama Anda</p>
              <Button asChild>
                <Link href="/dashboard/categories/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Kategori Pertama
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Ini akan menghapus kategori
              <strong> {selectedCategory?.name}</strong> secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCategory(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <CategoriesContent />
      </DashboardLayout>
    </AuthGuard>
  )
} 