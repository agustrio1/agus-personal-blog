export const revalidate = 300 // Cache 5 menit
export const dynamic = "force-static"

import type { Metadata } from "next"
import { Suspense } from "react"
import { Search } from "lucide-react"
import { CategoryFilter } from "@/components/posts/category-filter"
import { PostsList } from "@/components/posts/posts-list"
import { PostsLoading } from "@/components/posts/posts-loading"
import { getCategories } from "@/lib/get-categories"

// SEO Metadata yang dioptimalkan
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = "https://agusdev.my.id"

  return {
    title: "Semua Postingan | Blog Agus Dev - Artikel Web Development & Digital Marketing",
    description:
      "Jelajahi koleksi lengkap artikel tentang web development, digital marketing, dan teknologi terbaru. Tips praktis untuk developer dan bisnis online.",
    keywords: [
      "artikel web development",
      "tutorial programming",
      "digital marketing tips",
      "blog teknologi indonesia",
      "web developer kediri",
      "jasa website profesional",
    ],
    alternates: {
      canonical: `${baseUrl}/posts`,
    },
    openGraph: {
      title: "Semua Postingan | Blog Agus Dev",
      description:
        "Jelajahi koleksi lengkap artikel tentang web development, digital marketing, dan teknologi terbaru.",
      url: `${baseUrl}/posts`,
      siteName: "Agus Dev Blog",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-posts.png`,
          width: 1200,
          height: 630,
          alt: "Blog Posts - Agus Dev",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Semua Postingan | Blog Agus Dev",
      description: "Jelajahi koleksi lengkap artikel tentang web development dan digital marketing.",
      images: [`${baseUrl}/og-posts.png`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

interface PostsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = (await searchParams) || {}
  const currentPage = Number.parseInt(params.page || "1")

  return (
    <>
      {/* Structured Data untuk SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Agus Dev Blog",
            description: "Blog tentang web development, digital marketing, dan teknologi",
            url: "https://agusdev.my.id/posts",
            author: {
              "@type": "Person",
              name: "Agus Dev",
            },
            publisher: {
              "@type": "Organization",
              name: "Agus Dev",
              url: "https://agusdev.my.id",
            },
          }),
        }}
      />

      <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="max-w-4xl mx-auto pt-28 pb-16 px-4">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <Search className="w-4 h-4" />
              Jelajahi artikel
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Semua Postingan
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Temukan artikel terbaru tentang web development, digital marketing, dan tips bisnis online
            </p>
          </header>

          {/* Category Filter dengan Suspense */}
          <div className="mb-12">
            <Suspense fallback={<CategoryFilterLoading />}>
              <CategoryFilterWrapper />
            </Suspense>
          </div>

          {/* Posts List dengan Suspense */}
          <Suspense fallback={<PostsLoading />}>
            <PostsList category={params.category} page={currentPage} />
          </Suspense>
        </div>
      </main>
    </>
  )
}

// Wrapper untuk Category Filter
async function CategoryFilterWrapper() {
  const categories = await getCategories()
  return <CategoryFilter categories={categories} />
}

// Loading component untuk Category Filter
function CategoryFilterLoading() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      ))}
    </div>
  )
}
