"use client"

import { use } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, ExternalLink, Calendar, FolderOpen, Image as ImageIcon } from "lucide-react"
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
  updatedAt: string
}

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchProject() {
      setLoading(true)
      try {
        const res = await fetch(`/api/projects/${slug}`)
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Project tidak ditemukan")
          }
          throw new Error("Gagal mengambil data project")
        }
        const data = await res.json()
        setProject(data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [slug])

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Memuat data project...</p>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (error || !project) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-red-600 mb-4">{error || "Project tidak ditemukan"}</div>
              <Button asChild>
                <Link href="/dashboard/projects">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Projects
                </Link>
              </Button>
            </CardContent>
          </Card>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/projects">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-gray-600 mt-1">Detail project</p>
              </div>
            </div>
            <Button asChild>
              <Link href={`/dashboard/projects/${project.slug}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Image */}
              {project.imageUrl ? (
                <Card>
                  <CardContent className="p-0">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={800}
                      height={400}
                      className="w-full h-64 lg:h-80 object-cover rounded-lg"
                      style={{ objectFit: 'cover' }}
                      priority={false}
                    />
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Tidak ada gambar</p>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Deskripsi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                    <Badge variant={project.published ? "default" : "secondary"}>
                      {project.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  
                  {project.category && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Kategori</span>
                      <div className="flex items-center">
                        <FolderOpen className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm">{project.category.name}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Dibuat</span>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="text-sm">
                        {new Date(project.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Diupdate</span>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="text-sm">
                        {new Date(project.updatedAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Aksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.link && (
                    <Button className="w-full" asChild>
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Lihat Project
                      </a>
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/dashboard/projects/${project.slug}/edit`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Project
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 