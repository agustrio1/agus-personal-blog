import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, FolderOpen, Briefcase, Eye, Calendar, Plus, ArrowUpRight, Activity } from "lucide-react"
import Link from "next/link"

async function DashboardContent() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <div>Unauthorized</div>
  }

  // Fetch statistics
  const [postsCount, categoriesCount, projectsCount] = await Promise.all([
    prisma.post.count(),
    prisma.category.count(),
    prisma.project.count(),
  ])

  // Fetch recent posts
  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      category: true,
    },
  })

  const stats = [
    {
      title: "Total Posts",
      value: postsCount,
      description: "Artikel yang telah dibuat",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      title: "Kategori",
      value: categoriesCount,
      description: "Kategori yang tersedia",
      icon: FolderOpen,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50",
    },
    {
      title: "Projects",
      value: projectsCount,
      description: "Project yang dipublikasi",
      icon: Briefcase,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      title: "Status",
      value: "Aktif",
      description: "Blog berjalan dengan baik",
      icon: Activity,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
    },
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <div className="space-y-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Selamat datang kembali, <span className="font-semibold text-indigo-600">{session.user.name}</span>! 👋
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="group">
                <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Lihat Blog
              </Button>
              <Button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 group"
                asChild
              >
                <Link href="/dashboard/posts/new">
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                  Buat Post
                </Link>
              </Button>
            </div>
        </div>

          {/* Statistics Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card
                  key={stat.title}
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                    <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-gray-700">
                      {stat.title}
                    </CardTitle>
                    <div
                      className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="flex items-baseline justify-between">
                      <div className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
                        {stat.value}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600">{stat.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Posts - Takes 2 columns */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Post Terbaru</CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        Artikel yang baru-baru ini dibuat
                      </CardDescription>
              </div>
                    <Button variant="outline" className="group" asChild>
                      <Link href="/dashboard/posts">
                        Lihat Semua
                        <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </Link>
                    </Button>
              </div>
                </CardHeader>
                <CardContent>
                  {recentPosts.length > 0 ? (
                    <div className="space-y-4">
                      {recentPosts.map((post) => (
                        <div
                          key={post.id}
                          className="group flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-white hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                              {post.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(post.createdAt).toLocaleDateString("id-ID")}
                              </span>
                              {post.category && (
                                <span className="flex items-center">
                                  <FolderOpen className="w-4 h-4 mr-1" />
                                  {post.category.name}
                                </span>
                              )}
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  post.published
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : "bg-amber-100 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {post.published ? "Published" : "Draft"}
                </span>
              </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            asChild
                          >
                            <Link href={`/dashboard/posts/${post.slug}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada post</h3>
                      <p className="text-gray-500 mb-6">Mulai menulis artikel pertama Anda</p>
                      <Button
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        asChild
                      >
                        <Link href="/dashboard/posts/new">
                          <Plus className="w-4 h-4 mr-2" />
                          Buat Post Pertama
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Aksi Cepat</CardTitle>
                  <CardDescription className="text-gray-600">Akses cepat ke fitur-fitur utama</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-200"
                    asChild
                  >
                    <Link href="/dashboard/posts/new">
                      <div className="p-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 mr-3">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      Buat Post Baru
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start group hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-200"
                    asChild
                  >
                    <Link href="/dashboard/projects/new">
                      <div className="p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 mr-3">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      Tambah Project
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start group hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-200"
                    asChild
                  >
                    <Link href="/dashboard/categories/new">
                      <div className="p-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 mr-3">
                        <FolderOpen className="w-4 h-4 text-white" />
                      </div>
                      Buat Kategori
                    </Link>
                  </Button>
            </CardContent>
          </Card>

              {/* Blog Statistics */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Statistik Blog</CardTitle>
                  <CardDescription className="text-gray-600">Ringkasan performa blog Anda</CardDescription>
            </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Total Posts</span>
                    <span className="font-bold text-blue-600">{postsCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Published Posts</span>
                    <span className="font-bold text-green-600">{recentPosts.filter((p) => p.published).length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Draft Posts</span>
                    <span className="font-bold text-amber-600">{recentPosts.filter((p) => !p.published).length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Categories</span>
                    <span className="font-bold text-purple-600">{categoriesCount}</span>
                  </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      </div>
    </DashboardLayout>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
