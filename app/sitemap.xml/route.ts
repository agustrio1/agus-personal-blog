import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true }
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
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
  xml += "</urlset>"

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" }
  })
} 