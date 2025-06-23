import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import slugify from "slugify"

// GET - Get all categories with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    const [categories, total] = await prisma.$transaction([
      prisma.category.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: { posts: true, projects: true },
          },
        },
        skip,
        take: limit,
      }),
      prisma.category.count(),
    ])

    return NextResponse.json({
      categories: categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data kategori" },
      { status: 500 }
    )
  }
}

// POST - Create new category (protected)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name } = await request.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Nama kategori diperlukan" },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = slugify(name, { 
      lower: true, 
      strict: true,
      locale: 'id'
    })

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "Kategori dengan nama tersebut sudah ada" },
        { status: 400 }
      )
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Gagal membuat kategori" },
      { status: 500 }
    )
  }
} 