import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import slugify from "slugify"

// GET /api/projects/[slug] - Get project by slug
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    })
    if (!project) {
      return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 })
    }
    return NextResponse.json(project)
  } catch (error) {
    console.error("Get project by slug error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

// PUT /api/projects/[slug] - Update project (admin/author only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { title, description, imageUrl, link, categoryId } = body
    const project = await prisma.project.findUnique({ where: { slug } })
    if (!project) {
      return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 })
    }
    // Hanya admin atau author yang boleh update
    if (project.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    // Generate slug baru jika title berubah
    let newSlug = slug
    if (title && title !== project.title) {
      const baseSlug = slugify(title, { lower: true, strict: true, locale: "id" })
      newSlug = baseSlug
      let counter = 1
      while (await prisma.project.findFirst({ where: { slug: newSlug, id: { not: project.id } } })) {
        newSlug = `${baseSlug}-${counter}`
        counter++
      }
    }
    const updated = await prisma.project.update({
      where: { id: project.id },
      data: {
        title: title || project.title,
        slug: newSlug,
        description: description || project.description,
        imageUrl: imageUrl !== undefined ? imageUrl : project.imageUrl,
        link: link !== undefined ? link : project.link,
        categoryId: categoryId || null,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    })
    return NextResponse.json({ message: "Project berhasil diupdate", project: updated })
  } catch (error) {
    console.error("Update project error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

// DELETE /api/projects/[slug] - Delete project (admin/author only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const project = await prisma.project.findUnique({ where: { slug } })
    if (!project) {
      return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 })
    }
    // Hanya author yang boleh delete (ADMIN check dihilangkan karena session.user.role tidak tersedia)
    if (project.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    await prisma.project.delete({ where: { id: project.id } })
    return NextResponse.json({ message: "Project berhasil dihapus" })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
} 