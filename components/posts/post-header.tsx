import Link from "next/link"
import { Calendar, User, Hash, ArrowLeft, Clock } from "lucide-react"
import { ShareButton } from "@/components/share-button"
import { formatDate, calculateReadingTime } from "@/utils/date-helpers"

interface PostHeaderProps {
  post: {
    title: string
    slug: string
    content: string
    createdAt: Date | string
    author?: { name: string } | null
    category?: { name: string; slug: string } | null
  }
}

export function PostHeader({ post }: PostHeaderProps) {
  const readingTime = calculateReadingTime(post.content)

  return (
    <>
      {/* Back Button */}
      <Link
        href="/posts"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 mb-8 group"
        prefetch={true}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
        Kembali ke daftar post
      </Link>

      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <time dateTime={new Date(post.createdAt).toISOString()} className="font-medium">
              {formatDate(post.createdAt)}
            </time>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className="font-medium">{readingTime} menit baca</span>
          </div>

          {post.category && (
            <Link
              href={`/posts?category=${post.category.slug}`}
              className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              prefetch={true}
            >
              <Hash className="w-5 h-5" />
              <span className="font-medium">{post.category.name}</span>
            </Link>
          )}

          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span className="font-medium">{post.author?.name || "Admin"}</span>
          </div>

          <div className="ml-auto">
            <ShareButton title={post.title} url={`/posts/${post.slug}`} />
          </div>
        </div>
      </header>
    </>
  )
}
