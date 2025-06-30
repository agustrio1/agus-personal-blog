import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  category?: string
}

export function Pagination({ currentPage, totalPages, category }: PaginationProps) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (page > 1) params.set("page", page.toString())

    const query = params.toString()
    return `/posts${query ? `?${query}` : ""}`
  }

  const pages = []
  const showPages = 5
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
  const endPage = Math.min(totalPages, startPage + showPages - 1)

  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <nav className="flex justify-center items-center gap-2 mt-12" aria-label="Pagination">
      {/* Previous button */}
      {currentPage > 1 && (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-xl hover:bg-white/90 dark:hover:bg-black/50 transition-all duration-200"
          prefetch={true}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </Link>
      )}

      {/* Page numbers */}
      <div className="flex gap-1">
        {pages.map((page) => (
          <Link
            key={page}
            href={createPageUrl(page)}
            className={`px-4 py-2 rounded-xl transition-all duration-200 ${
              page === currentPage
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white/80 dark:bg-black/30 border border-white/20 dark:border-white/10 hover:bg-white/90 dark:hover:bg-black/50"
            }`}
            prefetch={true}
          >
            {page}
          </Link>
        ))}
      </div>

      {/* Next button */}
      {currentPage < totalPages && (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-xl hover:bg-white/90 dark:hover:bg-black/50 transition-all duration-200"
          prefetch={true}
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  )
}
