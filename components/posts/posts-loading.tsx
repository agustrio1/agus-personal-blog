export function PostsLoading() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <article
          key={i}
          className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-6 md:p-8 animate-pulse"
        >
          {/* Title skeleton */}
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 w-3/4"></div>

          {/* Meta info skeleton */}
          <div className="flex gap-4 mb-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>

          {/* Reading time skeleton */}
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-4"></div>
        </article>
      ))}
    </div>
  )
}
