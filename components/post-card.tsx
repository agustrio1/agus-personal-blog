import Link from "next/link"
import Image from "next/image"
import { Calendar } from "lucide-react"

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    createdAt: Date
    content: string
    images?: { url: string }[]
  }
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article
      className={`group relative bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/80 dark:hover:bg-black/30 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-500 hover:-translate-y-1 ${
        featured ? "md:col-span-2 border-2 border-blue-200/50 dark:border-blue-800/50" : ""
      }`}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {post.images?.[0] && (
          <div className="md:w-48 h-32 md:h-36 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden flex-shrink-0">
            <Image
              src={post.images[0].url || "/placeholder.svg"}
              alt={post.title}
              width={300}
              height={150}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ objectFit: "cover" }}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 300px"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
            />
          </div>
        )}
        <div className="flex-1">
          <Link href={`/posts/${post.slug}`} prefetch={true}>
            <h3
              className={`font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3 leading-tight ${
                featured ? "text-xl md:text-2xl" : "text-lg md:text-xl"
              }`}
            >
              {post.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Calendar className="w-4 h-4" />
            {new Date(post.createdAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
            {post.content.replace(/<[^>]+>/g, "").slice(0, 120)}...
          </p>
        </div>
      </div>
    </article>
  )
}
