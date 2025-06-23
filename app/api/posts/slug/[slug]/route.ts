import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/posts/slug/[slug] - Get post by slug (public access)
export async function GET(
  request: NextRequest,
  { params }:  { params: Promise<{ slug: string }> }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: (await params).slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          select: {
            id: true,
            url: true,
            alt: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: "Post tidak ditemukan" },
        { status: 404 }
      )
    }

    // Only return published posts for public access
    if (!post.published) {
      return NextResponse.json(
        { error: "Post tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })

  } catch (error) {
    console.error("Get post by slug error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
} 