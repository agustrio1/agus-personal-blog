import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const staticPages = ["", "posts", "projects", "contact", "about"]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

  // Static pages
  staticPages.forEach(page => {
    xml += `  <url>\n`
    xml += `    <loc>${baseUrl}/${page ? `${page}/` : ""}</loc>\n`
    xml += `  </url>\n`
  })

  // Blog posts
  posts.forEach(post => {
    xml += `  <url>\n`
    xml += `    <loc>${baseUrl}/posts/${post.slug}/</loc>\n`
    xml += `    <lastmod>${post.updatedAt.toISOString()}</lastmod>\n`
    xml += `  </url>\n`
  })

  xml += `</urlset>`

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" }
  })
}
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const staticPages = ["", "posts", "projects", "contact", "about"]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

  // Static pages
  staticPages.forEach(page => {
    xml += `  <url>\n`
    xml += `    <loc>${baseUrl}/${page ? `${page}/` : ""}</loc>\n`
    xml += `  </url>\n`
  })

  // Blog posts
  posts.forEach(post => {
    xml += `  <url>\n`
    xml += `    <loc>${baseUrl}/posts/${post.slug}/</loc>\n`
    xml += `    <lastmod>${post.updatedAt.toISOString()}</lastmod>\n`
    xml += `  </url>\n`
  })

  xml += `</urlset>`

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" }
  })
}
