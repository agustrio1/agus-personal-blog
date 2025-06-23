import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

const DEFAULT_SETTINGS = {
  blogName: "Personal Blog",
  blogDescription: "A modern personal blog with authentication",
}

// GET /api/settings/general - Get site settings
export async function GET() {
  try {
    if (!prisma) {
      // Prisma tidak terinisialisasi
      return NextResponse.json(DEFAULT_SETTINGS)
    }
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 1 },
    })
    if (!settings) {
      return NextResponse.json(DEFAULT_SETTINGS)
    }
    return NextResponse.json(settings)
  } catch {
    // Jika error apapun, fallback ke default
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

// POST /api/settings/general - Update site settings
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 })
    }
    // console.log("DEBUG: prisma instance:", prisma)
    const body = await request.json()
    const { blogName, blogDescription } = body

    let settings;
    const existing = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    if (existing) {
      settings = await prisma.siteSetting.update({
        where: { id: 1 },
        data: { blogName, blogDescription },
      });
    } else {
      settings = await prisma.siteSetting.create({
        data: { id: 1, blogName, blogDescription },
      });
    }

    return NextResponse.json({ message: "Pengaturan berhasil disimpan", settings })
  } catch {
    console.error("Error updating site settings:")
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
} 