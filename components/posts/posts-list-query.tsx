"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Calendar, User, Hash } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

interface Post {
  id: string
  title: string
  slug: string
  content: string
  createdAt: string
  category?: { name: string; slug: string } | null
  author?: { name: string } | null
}

async function fetchPosts(category?: string): Promise<{ posts: Post[] }> {
  const url = category ? `/api/posts?category=${category}` : "/api/posts"
  const res = await fetch(url)
  if (!res.ok) throw new Error("Gagal memuat data post")
  return res.json()
}

export function PostsListWithQuery({ categories }: { categories: Category[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", selected],
    queryFn: () => fetchPosts(selected || undefined),
  })

  return (
    <>
      {/* Category Filter */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelected(null)}
            className={`px-4 py-2.5 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border ${
              !selected
                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25"
                : "bg-white/60 dark:bg-black/20 text-gray-700 dark:text-gray-300 border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/30"
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.slug)}
              className={`px-4 py-2.5 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border ${
                selected === cat.slug
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25"
                  : "bg-white/60 dark:bg-black/20 text-gray-700 dark:text-gray-300 border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/30"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="space-y-6">
        {isLoading && (
          <div className="text-center py-16 text-blue-600 dark:text-blue-300">Loading...</div>
        )}
        {isError && (
          <div className="text-center py-16 text-red-500">{(error as Error).message}</div>
        )}
        {data?.posts?.length === 0 && !isLoading && !isError && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Belum ada post di kategori ini.</p>
          </div>
        )}
        {data?.posts?.map((post) => (
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
                <span className="flex items-center gap-1.5">
                  <Hash className="w-4 h-4" />
                  {post.category.name}
                </span>
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
    </>
  )
} 