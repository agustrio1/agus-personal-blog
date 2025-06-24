"use client"

import { useRouter, useSearchParams } from "next/navigation"

export function CategoryFilter({ categories }: {
  categories: { id: string, name: string, slug: string }[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")

  const handleCategoryClick = (slug?: string) => {
    const params = new URLSearchParams(searchParams)
    if (slug) {
      params.set("category", slug)
    } else {
      params.delete("category")
    }
    router.push(`/posts${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => handleCategoryClick(undefined)}
        className={`px-4 py-2.5 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border ${
          !activeCategory
            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25"
            : "bg-white/60 dark:bg-black/20 text-gray-700 dark:text-gray-300 border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/30"
        }`}
      >
        Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCategoryClick(cat.slug)}
          className={`px-4 py-2.5 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border ${
            activeCategory === cat.slug
              ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25"
              : "bg-white/60 dark:bg-black/20 text-gray-700 dark:text-gray-300 border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/30"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
} 