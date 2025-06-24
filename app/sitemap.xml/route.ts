import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      select: { slug: true },
    }),
  ])

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const staticPages = [
    "",
    "posts",
    "projects",
    "contact",
    "about"
  ]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
  staticPages.forEach(page => {
    xml += `<url><loc>${baseUrl}/${page}</loc></url>\n`
  })
  posts.forEach(post => {
    xml += `<url><loc>${baseUrl}/posts/${post.slug}</loc><lastmod>${post.updatedAt.toISOString()}</lastmod></url>\n`
  })
  categories.forEach(category => {
    xml += `<url><loc>${baseUrl}/posts?category=${category.slug}</loc></url>\n`
  })
  xml += "</urlset>"

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" }
  })
} 