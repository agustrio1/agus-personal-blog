interface PostContentProps {
  post: {
    title: string
    content: string
    images?: { url: string; alt?: string | null; id: string }[]
  }
}

export function PostContent({ post }: PostContentProps) {
  return (
    <article className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/5 dark:shadow-white/5">
      <div className="p-8 md:p-12">
        {/* Content */}
        <div
          className="prose prose-lg max-w-none 
            prose-headings:text-gray-900 dark:prose-headings:text-white 
            prose-p:text-gray-700 dark:prose-p:text-gray-300 
            prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-700 dark:hover:prose-a:text-blue-300
            prose-strong:text-gray-900 dark:prose-strong:text-white 
            prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700
            prose-blockquote:border-blue-500 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:p-4 prose-blockquote:rounded-lg
            prose-ul:text-gray-700 dark:prose-ul:text-gray-300
            prose-ol:text-gray-700 dark:prose-ol:text-gray-300
            prose-li:text-gray-700 dark:prose-li:text-gray-300
            prose-img:rounded-lg prose-img:shadow-lg
            prose-hr:border-gray-200 dark:prose-hr:border-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  )
}
