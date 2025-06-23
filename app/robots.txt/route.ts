import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const robots = `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`
  return new NextResponse(robots, {
    headers: { "Content-Type": "text/plain" }
  })
} 