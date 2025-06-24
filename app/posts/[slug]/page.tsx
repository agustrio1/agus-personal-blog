import { prisma } from "@/lib/db"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Calendar, User, Hash, ArrowLeft } from "lucide-react"
import { ShareButton } from "@/components/share-button"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, content: true },
  })
  if (!post) return {}
  return {
    title: post.title,
    description: post.content.replace(/<[^>]+>/g, "").slice(0, 160),
    alternates: {
      canonical: `https://agusdev.my.id/posts/${(await params).slug}`
    }
  }
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true, slug: true } },
      images: { select: { url: true, alt: true, id: true } },
    },
  })

  if (!post || !post.published) return notFound()

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <div className="max-w-4xl mx-auto pt-28 pb-16 px-4">
        {/* Back Button */}
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Kembali ke daftar post
        </Link>

        <article className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/5 dark:shadow-white/5">
          {/* Featured Image */}
          {/* {post.images?.[0] && (
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
              <img
                src={post.images[0].url || "/placeholder.svg"}
                alt={post.images[0].alt || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )} */}

          <div className="p-8 md:p-12">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">
                  {new Date(post.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {post.category && (
                <Link
                  href={`/posts?category=${post.category.slug}`}
                  className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  <Hash className="w-5 h-5" />
                  <span className="font-medium">{post.category.name}</span>
                </Link>
              )}

              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{post.author?.name}</span>
              </div>

              <div className="ml-auto">
                <ShareButton
                  title={post.title}
                  url={`/posts/${post.slug}`}
                />
              </div>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-blockquote:border-blue-500 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </main>
  )
}
