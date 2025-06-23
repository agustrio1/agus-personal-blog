import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import slugify from "slugify"

// GET /api/projects - List projects with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("categoryId") || ""

    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }
    if (categoryId) {
      where.categoryId = categoryId
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.project.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error("Projects list error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

// POST /api/projects - Create new project (admin only)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { title, description, imageUrl, link, categoryId } = body
    if (!title || !description) {
      return NextResponse.json({ error: "Title dan description diperlukan" }, { status: 400 })
    }
    // Generate slug unik
    const baseSlug = slugify(title, { lower: true, strict: true, locale: "id" })
    let slug = baseSlug
    let counter = 1
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        imageUrl: imageUrl || null,
        link: link || null,
        authorId: session.user.id,
        categoryId: categoryId || null,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    })
    return NextResponse.json({ message: "Project berhasil dibuat", project }, { status: 201 })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
} 