import { prisma } from "@/lib/db"
import { unstable_cache } from "next/cache"

// Type definitions
export interface ProjectWithAuthor {
  id: string
  title: string
  slug: string
  description: string
  imageUrl: string | null
  link: string | null
  createdAt: Date
  author: {
    name: string
  } | null
}

export interface ProjectDetail extends ProjectWithAuthor {
  updatedAt: Date
}

// Cache untuk semua projects
export const getAllProjects = unstable_cache(
  async (): Promise<ProjectWithAuthor[]> => {
    try {
      return await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          imageUrl: true,
          link: true,
          createdAt: true,
          author: {
            select: { name: true },
          },
        },
      })
    } catch (error) {
      console.error("Error fetching projects:", error)
      return []
    }
  },
  ["all-projects"],
  {
    revalidate: 1800, // 30 menit
    tags: ["projects"],
  },
)

// Cache untuk single project
export const getProjectBySlug = unstable_cache(
  async (slug: string): Promise<ProjectDetail | null> => {
    try {
      const project = await prisma.project.findUnique({
        where: { slug },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          imageUrl: true,
          link: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: { name: true },
          },
        },
      })

      return project as ProjectDetail | null
    } catch (error) {
      console.error("Error fetching project by slug:", error)
      return null
    }
  },
  ["project-by-slug"],
  {
    revalidate: 3600, // 1 jam
    tags: ["projects"],
  },
)

// Cache untuk featured projects (untuk homepage jika diperlukan)
export const getFeaturedProjects = unstable_cache(
  async (limit = 3): Promise<ProjectWithAuthor[]> => {
    try {
      return await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          imageUrl: true,
          link: true,
          createdAt: true,
          author: {
            select: { name: true },
          },
        },
      })
    } catch (error) {
      console.error("Error fetching featured projects:", error)
      return []
    }
  },
  ["featured-projects"],
  {
    revalidate: 3600, // 1 jam
    tags: ["projects"],
  },
)
