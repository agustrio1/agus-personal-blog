import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import slugify from "slugify"
import * as cheerio from "cheerio"

// GET /api/posts - List posts with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("categoryId") || ""
    const published = searchParams.get("published") || ""

    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } }
      ]
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (published !== "") {
      where.published = published === "true"
    }

    // Get posts with relations
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
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
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      posts,
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
    console.error("Posts list error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create new post with images (multipart/form-data)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const categoryId = formData.get("categoryId") as string
    const published = formData.get("published") === "true"

    if (!title || !content) {
      return NextResponse.json({ error: "Title dan content diperlukan" }, { status: 400 })
    }

    // Tolak jika ada base64 image di content
    if (/<img[^>]+src=["']data:image\//.test(content)) {
      return NextResponse.json({
        error: "Gambar tidak boleh berupa base64. Upload gambar ke ImageKit dan gunakan URL CDN."
      }, { status: 400 })
    }

    // Generate slug unik
    const baseSlug = slugify(title, { lower: true, strict: true, locale: "id" })
    let slug = baseSlug
    let counter = 1
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Simpan post dulu (tanpa images)
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        published,
        authorId: session.user.id,
        categoryId: categoryId || null,
      },
    })

    // Ekstrak semua URL gambar dari konten
    const $ = cheerio.load(content)
    const imageUrls = $('img').map((i, el) => $(el).attr('src')).get()

    // Simpan semua URL gambar ke PostImage
    await prisma.postImage.createMany({
      data: imageUrls.map((url: string) => ({
        url,
        alt: "",
        postId: post.id,
      })),
      skipDuplicates: true,
    })

    // Ambil post lengkap dengan images
    const createdPost = await prisma.post.findUnique({
      where: { id: post.id },
      include: { images: true },
    })

    return NextResponse.json({ message: "Post berhasil dibuat", post: createdPost }, { status: 201 })
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}