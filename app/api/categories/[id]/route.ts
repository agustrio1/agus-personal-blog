import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import slugify from "slugify"

// GET - Get category by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: id }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data kategori" },
      { status: 500 }
    )
  }
}

// PUT - Update category (protected)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name } = await req.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Nama kategori diperlukan" },
        { status: 400 }
      )
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      )
    }

    // Generate new slug from name
    const newSlug = slugify(name, { 
      lower: true, 
      strict: true,
      locale: 'id'
    })

    // Check if new slug already exists (excluding current category)
    const slugExists = await prisma.category.findFirst({
      where: {
        slug: newSlug,
        id: { not: id }
      }
    })

    if (slugExists) {
      return NextResponse.json(
        { error: "Kategori dengan nama tersebut sudah ada" },
        { status: 400 }
      )
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id: id },
      data: {
        name: name.trim(),
        slug: newSlug
      }
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Gagal mengupdate kategori" },
      { status: 500 }
    )
  }
}

// DELETE - Delete category (protected)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: id },
      include: {
        posts: true,
        projects: true
      }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      )
    }

    // Check if category is being used
    if (existingCategory.posts.length > 0 || existingCategory.projects.length > 0) {
      return NextResponse.json(
        { error: "Kategori tidak dapat dihapus karena masih digunakan oleh post atau project" },
        { status: 400 }
      )
    }

    // Delete category
    await prisma.category.delete({
      where: { id: id }
    })

    return NextResponse.json(
      { message: "Kategori berhasil dihapus" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Gagal menghapus kategori" },
      { status: 500 }
    )
  }
} 