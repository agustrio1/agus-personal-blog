export function PostLoading() {
  return (
    <article className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/5 dark:shadow-white/5 animate-pulse">
      {/* Featured Image Skeleton */}
      <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>

      <div className="p-8 md:p-12">
        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    </article>
  )
}
