import { NextResponse } from "next/server"

export async function GET() {
  const content = `
/* TEAM */
Developer: Agus
Site: https://agusdev.my.id
Github: https://github.com/agustrio1
Twitter:https://twitter.con/@GakUsahTanya1

/* SITE */
Last update: ${new Date().toISOString().split("T")[0]}
Standards: HTML5, CSS3, JavaScript, Next.js
Components: shadcn/ui, Prisma, Tiptap, ImageKit

/* THANKS */
Thanks to all contributors and open source community!
  `.trim()

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain"
    }
  })
} 