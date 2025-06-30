import { prisma } from "@/lib/db"
import { unstable_cache } from "next/cache"

// Cache categories dengan post count
export const getCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            posts: {
              where: { published: true },
            },
          },
        },
      },
    })
  },
  ["categories"],
  {
    revalidate: 3600, // 1 jam
    tags: ["categories"],
  },
)
