import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getPostBySlug, getRelatedPosts } from "@/lib/get-posts"
import { PostContent } from "@/components/posts/post-content"
import { PostHeader } from "@/components/posts/post-header"
import { RelatedPosts } from "@/components/posts/related-posts"
import { PostLoading } from "@/components/posts/post-loading"

// Static params generation untuk ISR
export async function generateStaticParams() {
  const { prisma } = await import("@/lib/db")

  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
      take: 100, // Generate top 100 posts statically
      orderBy: { createdAt: "desc" },
    })

    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

// Optimized metadata generation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Tidak Ditemukan",
      description: "Post yang Anda cari tidak ditemukan.",
    }
  }

  const baseUrl = "https://agusdev.my.id"
  const postUrl = `${baseUrl}/posts/${slug}`
  const description =  post.content.replace(/<[^>]+>/g, "").slice(0, 160)
  const imageUrl = post.images?.[0]?.url || `${baseUrl}/og-post-default.png`

  return {
    title: `${post.title} | Blog Agus Dev`,
    description,
    keywords: [post.category?.name || "", "web development", "tutorial", "programming", "digital marketing"].filter(
      Boolean,
    ),
    authors: [{ name: post.author?.name || "Agus Dev" }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: postUrl,
      siteName: "Blog Agus Dev",
      type: "article",
      publishedTime: new Date(post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      authors: [post.author?.name || "Agus Dev"],
      section: post.category?.name,
      tags: post.category?.name ? [post.category.name] : [],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [imageUrl],
      creator: "@agusdev",
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

interface PostDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Structured data object dengan proper typing
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description:  post.content.replace(/<[^>]+>/g, "").slice(0, 160),
    image: post.images?.[0]?.url || "https://agusdev.my.id/og-post-default.png",
    author: {
      "@type": "Person",
      name: post.author?.name || "Agus Dev",
      url: "https://agusdev.my.id/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Agus Dev Blog",
      logo: {
        "@type": "ImageObject",
        url: "https://agusdev.my.id/logo.png",
      },
    },
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://agusdev.my.id/posts/${slug}`,
    },
    articleSection: post.category?.name,
    keywords: post.category?.name,
    wordCount: post.content.replace(/<[^>]+>/g, "").split(/\s+/).length,
    timeRequired: `PT${Math.ceil(post.content.replace(/<[^>]+>/g, "").split(/\s+/).length / 200)}M`,
  }

  return (
    <>
      {/* Structured Data untuk SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="max-w-4xl mx-auto pt-28 pb-16 px-4">
          {/* Post Header */}
          <PostHeader post={post} />

          {/* Post Content */}
          <Suspense fallback={<PostLoading />}>
            <PostContent post={post} />
          </Suspense>

          {/* Related Posts */}
          <Suspense fallback={<div className="mt-16 animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-3xl" />}>
            <RelatedPostsWrapper categorySlug={post.category?.slug} currentPostId={post.id} />
          </Suspense>
        </div>
      </main>
    </>
  )
}

// Wrapper untuk Related Posts
async function RelatedPostsWrapper({ categorySlug, currentPostId }: { categorySlug?: string; currentPostId: string }) {
  if (!categorySlug) return null

  const relatedPosts = await getRelatedPosts(categorySlug, currentPostId)

  if (relatedPosts.length === 0) return null

  return <RelatedPosts posts={relatedPosts} />
}

// Enable ISR
export const revalidate = 3600 // 1 hour
export const dynamic = "force-static"
export const dynamicParams = true
