export const revalidate = 60
export const dynamic = "force-static"

export const metadata = {
  title: "Semua Postingan | Blog",
  description: "Jelajahi semua artikel dan kategori di blog ini.",
}

import Link from "next/link"
import { prisma } from "@/lib/db"
import { Calendar, User, Hash, Search } from "lucide-react"

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams || {}
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  })

  const where: Record<string, unknown> = { published: true }
  if (params.category) {
    where.category = { slug: params.category }
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true, slug: true } },
      author: { select: { name: true } },
    },
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <div className="max-w-4xl mx-auto pt-28 pb-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <Search className="w-4 h-4" />
            Jelajahi artikel
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Semua Postingan
          </h1>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/posts"
              className={`px-4 py-2.5 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border ${
                !params.category
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25"
                  : "bg-white/60 dark:bg-black/20 text-gray-700 dark:text-gray-300 border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/30"
              }`}
            >
              Semua
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/posts?category=${cat.slug}`}
                className={`px-4 py-2.5 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border ${
                  params.category === cat.slug
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25"
                    : "bg-white/60 dark:bg-black/20 text-gray-700 dark:text-gray-300 border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/30"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="space-y-6">
          {posts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Belum ada post di kategori ini.</p>
            </div>
          )}

          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/80 dark:hover:bg-black/30 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-500 hover:-translate-y-1"
            >
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-4 leading-tight">
                  {post.title}
                </h2>
              </Link>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                {post.category && (
                  <Link
                    href={`/posts?category=${post.category.slug}`}
                    className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    <Hash className="w-4 h-4" />
                    {post.category.name}
                  </Link>
                )}
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {post.author?.name}
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {post.content.replace(/<[^>]+>/g, "").slice(0, 200)}...
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
