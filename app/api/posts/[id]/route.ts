import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import slugify from "slugify"
import * as cheerio from "cheerio"

// GET /api/posts/[id] - Get post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: (await params).id },
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

    return NextResponse.json({ post })

  } catch (error) {
    console.error("Get post error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}

// PUT /api/posts/[id] - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    let title: string | undefined, content: string | undefined, categoryId: string | undefined, published: boolean | undefined;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      title = formData.get("title") as string;
      content = formData.get("content") as string;
      categoryId = formData.get("categoryId") as string | undefined;
      const publishedRaw = formData.get("published");
      published = publishedRaw === "true";
    } else {
      const body = await request.json();
      title = body.title;
      content = body.content;
      categoryId = body.categoryId;
      published = body.published;
    }

    // Check if post exists and user owns it
    const existingPost = await prisma.post.findUnique({
      where: { id: (await params).id },
      include: { images: true }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post tidak ditemukan" },
        { status: 404 }
      )
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Tidak memiliki akses untuk mengedit post ini" },
        { status: 403 }
      )
    }

    // Generate new slug if title changed
    let slug = existingPost.slug
    if (title && title !== existingPost.title) {
      const baseSlug = slugify(title, { 
        lower: true, 
        strict: true,
        locale: 'id'
      })
      
      let newSlug = baseSlug
      let counter = 1
      
      while (await prisma.post.findFirst({ 
        where: { 
          slug: newSlug,
          id: { not: (await params).id }
        } 
      })) {
        newSlug = `${baseSlug}-${counter}`
        counter++
      }
      slug = newSlug
    }

    // Extract new image URLs from content
    const $ = cheerio.load(content || "")
    const newImageUrls = $('img').map((i, el) => $(el).attr('src')).get()

    // Update post and handle images
    const updatedPost = await prisma.post.update({
      where: { id: (await params).id },
      data: {
        title: title || existingPost.title,
        slug,
        content: content || existingPost.content,
        published: published !== undefined ? published : existingPost.published,
        categoryId: categoryId || null,
        images: {
          // Delete existing images that are not in the new content
          deleteMany: {
            url: {
              notIn: newImageUrls,
            },
          },
          // Create new images that are in the content but not in the DB
          connectOrCreate: newImageUrls.map((url) => ({
            where: {
              postId_url: { // This assumes you have a unique constraint on postId and url
                postId: existingPost.id,
                url,
              }
            },
            create: {
              url,
              alt: "", 
            },
          })),
        }
      },
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

    return NextResponse.json({
      message: "Post berhasil diperbarui",
      post: updatedPost
    })

  } catch (error) {
    console.error("Update post error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if post exists and user owns it
    const existingPost = await prisma.post.findUnique({
      where: { id: (await params).id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post tidak ditemukan" },
        { status: 404 }
      )
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Tidak memiliki akses untuk menghapus post ini" },
        { status: 403 }
      )
    }

    // Hapus semua PostImage yang relasi ke post ini
    await prisma.postImage.deleteMany({
      where: { postId: existingPost.id }
    })

    // Delete post (images will be deleted automatically due to cascade, tapi kita sudah delete eksplisit di atas)
    await prisma.post.delete({
      where: { id: (await params).id }
    })

    return NextResponse.json({
      message: "Post berhasil dihapus"
    })

  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
} 