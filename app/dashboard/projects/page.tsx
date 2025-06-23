"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Briefcase, Edit, Trash2, ExternalLink, Image as ImageIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  imageUrl?: string | null
  link?: string | null
  published: boolean
  category?: { id: string; name: string; slug: string } | null
  createdAt: string
}

function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true)
      try {
        const res = await fetch("/api/projects")
        if (!res.ok) throw new Error("Gagal mengambil data project")
        const data = await res.json()
        setProjects(data.projects)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const handleDeleteProject = async (project: Project) => {
    setDeleting(project.id)
    setError("")

    try {
      // Delete project image from ImageKit if exists
      if (project.imageUrl) {
        try {
          await fetch("/api/projects/delete-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl: project.imageUrl }),
          })
        } catch (error) {
          console.error("Failed to delete image:", error)
          // Continue with project deletion even if image deletion fails
        }
      }

      // Delete project from database
      const res = await fetch(`/api/projects/${project.slug}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Gagal menghapus project")
      }

      setSuccess("Project berhasil dihapus!")
      setProjects(projects.filter(p => p.id !== project.id))
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Projects</h1>
            <p className="text-gray-600 mt-1">
              Tampilkan portfolio dan project Anda
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Project
            </Link>
          </Button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">Memuat data...</div>
        ) : projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-200">
                <div className="relative">
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={800}
                      height={400}
                      className="w-full h-48 object-cover rounded-t-lg"
                      style={{ objectFit: 'cover' }}
                      priority={false}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      asChild
                    >
                      <Link href={`/dashboard/projects/${project.slug}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={deleting === project.id}
                        >
                          {deleting === project.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Project</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus project &quot;{project.title}&quot;? 
                            Tindakan ini tidak dapat dibatalkan dan akan menghapus project beserta gambarnya secara permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProject(project)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Hapus Project
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.published
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {project.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {project.title}
                      </h3>
                      {project.category && (
                        <p className="text-sm text-gray-500 mt-1">
                          {project.category.name}
                        </p>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex gap-2">
                        {project.link && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                          >
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View
                            </a>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <Link href={`/dashboard/projects/${project.slug}`}>
                            Details
                          </Link>
                        </Button>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(project.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada projects
              </h3>
              <p className="text-gray-500 mb-6">
                Mulai dengan menambahkan project pertama Anda
              </p>
              <Button asChild>
                <Link href="/dashboard/projects/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Project Pertama
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function ProjectsPage() {
  return (
    <AuthGuard>
      <ProjectsContent />
    </AuthGuard>
  )
} 