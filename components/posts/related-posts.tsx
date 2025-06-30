import Link from "next/link"
import Image from "next/image"
import { Calendar } from "lucide-react"
import { formatDate } from "@/utils/date-helpers"

interface RelatedPost {
  id: string
  title: string
  slug: string
  createdAt: Date | string
  content: string
  images?: { url: string }[]
}

interface RelatedPostsProps {
  posts: RelatedPost[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">Artikel Terkait</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl overflow-hidden hover:bg-white/80 dark:hover:bg-black/30 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-300 hover:-translate-y-1"
          >
            {post.images?.[0] && (
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
                <Image
                  src={post.images[0].url || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            )}
            <div className="p-6">
              <Link href={`/posts/${post.slug}`} prefetch={true}>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3 leading-tight line-clamp-2">
                  {post.title}
                </h3>
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <Calendar className="w-4 h-4" />
                <time dateTime={new Date(post.createdAt).toISOString()}>{formatDate(post.createdAt)}</time>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                {post.content.replace(/<[^>]+>/g, "").slice(0, 100)}...
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
