import { prisma } from "@/lib/db"
import { unstable_cache } from "next/cache"

interface GetPostsOptions {
  category?: string
  page?: number
  limit?: number
}

// Type definition untuk post data
export interface PostWithMeta {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  createdAt: Date | string
  category: {
    name: string
    slug: string
  } | null
  author: {
    name: string
  } | null
  _count: {
    images: number
  }
}

// Type untuk where clause
interface PostWhereClause {
  published: boolean
  category?: {
    slug: string
  }
}

// Type untuk single post detail
export interface PostDetail {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  createdAt: Date | string
  updatedAt: Date | string
  category: {
    name: string
    slug: string
  } | null
  author: {
    name: string
    email: string
  } | null
  images: {
    url: string
    alt: string | null
    id: string
  }[]
}

// Cache query untuk 5 menit
export const getLatestPosts = unstable_cache(
  async () => {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        content: true,
        images: {
          select: { url: true },
          take: 1, 
        },
      },
    })
  },
  ["latest-posts"],
  {
    revalidate: 300, // 5 menit
    tags: ["posts"],
  },
)

// Cache query posts dengan pagination
export const getPostsWithPagination = unstable_cache(
  async ({ category, page = 1, limit = 10 }: GetPostsOptions) => {
    const skip = (page - 1) * limit

    const where: PostWhereClause = { published: true }
    if (category) {
      where.category = { slug: category }
    }

    try {
      // Parallel queries untuk performa
      const [posts, totalCount] = await Promise.all([
        prisma.post.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            createdAt: true,
            category: {
              select: { name: true, slug: true },
            },
            author: {
              select: { name: true },
            },
            _count: {
              select: { images: true },
            },
          },
        }),
        prisma.post.count({ where }),
      ])

      const totalPages = Math.ceil(totalCount / limit)

      return {
        posts: posts as PostWithMeta[],
        totalPages,
        currentPage: page,
        totalCount,
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      return {
        posts: [],
        totalPages: 0,
        currentPage: page,
        totalCount: 0,
      }
    }
  },
  ["posts-pagination"],
  {
    revalidate: 300, // 5 menit
    tags: ["posts"],
  },
)

// Cache untuk single post (untuk prefetching)
export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<PostDetail | null> => {
    try {
      const post = await prisma.post.findUnique({
        where: { slug, published: true },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          excerpt: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: { name: true, slug: true },
          },
          author: {
            select: { name: true, email: true },
          },
          images: {
            select: { url: true, alt: true, id: true },
          },
        },
      })

      return post as PostDetail | null
    } catch (error) {
      console.error("Error fetching post by slug:", error)
      return null
    }
  },
  ["post-by-slug"],
  {
    revalidate: 3600, // 1 jam
    tags: ["posts"],
  },
)

// Cache untuk related posts berdasarkan kategori
export const getRelatedPosts = unstable_cache(
  async (categorySlug: string, currentPostId: string) => {
    try {
      return await prisma.post.findMany({
        where: {
          published: true,
          category: { slug: categorySlug },
          id: { not: currentPostId },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          createdAt: true,
          images: {
            select: { url: true },
            take: 1,
          },
        },
      })
    } catch (error) {
      console.error("Error fetching related posts:", error)
      return []
    }
  },
  ["related-posts"],
  {
    revalidate: 1800, // 30 menit
    tags: ["posts"],
  },
)
