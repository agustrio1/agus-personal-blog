import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET - Get category by slug (public)
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }>}) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: (await params).slug },
      include: {
        posts: {
          where: { published: true },
          orderBy: { createdAt: 'desc' }
        },
        projects: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category by slug:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data kategori" },
      { status: 500 }
    )
  }
} 