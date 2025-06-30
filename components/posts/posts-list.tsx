import Link from "next/link"
import { Calendar, User, Hash } from "lucide-react"
import { getPostsWithPagination, type PostWithMeta } from "@/lib/get-posts"
import { Pagination } from "@/components/posts/pagination"

// Helper function untuk safe date formatting
function formatDate(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return "Tanggal tidak valid"
  }
}

function getISOString(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

interface PostsListProps {
  category?: string
  page?: number
}

export async function PostsList({ category, page = 1 }: PostsListProps) {
  const { posts, totalPages, currentPage } = await getPostsWithPagination({
    category,
    page,
    limit: 10,
  })

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Belum ada post di kategori ini</h2>
        <p className="text-gray-500 dark:text-gray-400">Coba pilih kategori lain atau kembali ke semua post</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {posts.map((post: PostWithMeta) => (
          <article
            key={post.id}
            className="group bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/80 dark:hover:bg-black/30 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-500 hover:-translate-y-1"
          >
            <Link href={`/posts/${post.slug}`} prefetch={true}>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-4 leading-tight">
                {post.title}
              </h2>
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time dateTime={getISOString(post.createdAt)}>{formatDate(post.createdAt)}</time>
              </div>

              {post.category && (
                <Link
                  href={`/posts?category=${post.category.slug}`}
                  className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  prefetch={true}
                >
                  <Hash className="w-4 h-4" />
                  {post.category.name}
                </Link>
              )}

              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author?.name || "Admin"}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
              {post.excerpt || post.content.replace(/<[^>]+>/g, "").slice(0, 200)}...
            </p>

            {/* Reading time estimate */}
            <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
              ⏱️ {Math.ceil(post.content.replace(/<[^>]+>/g, "").length / 200)} menit baca
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} category={category} />}
    </>
  )
}
