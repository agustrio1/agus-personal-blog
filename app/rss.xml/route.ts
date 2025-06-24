import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET () {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!
    const posts = await prisma.post.findMany({
        where: {published: true},
        orderBy: {createdAt: "desc"},
        take: 20,
        select: {
            slug: true,
            title: true,
            content: true,
            createdAt: true
        }
    })

    const items = posts.map((post) => `
     <item>
       <title><![CDATA[${post.title}]]></title>
       <link>${siteUrl}/posts/%{post.slug}</link>
       <guid>${siteUrl}/posts/%{post.slug}</guid>
       <pubDate>${post.createdAt.toUTCString()}</pubDate>
       <description><![CDATA[${post.content || ""}]]></description>
    </item>
    `)

    const xml = `
    <?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Agus Dev</title>
        <link>${siteUrl}</link>
        <description>Artikel seputar web devlopment dan solusi digital dari AgusDev.</description>
        ${items}
      </channel>
    </rss>
    `.trim()

    return new NextResponse(xml, {
        headers: {
            "Content-Type": "appication/rss+xml"
        }
    })
}