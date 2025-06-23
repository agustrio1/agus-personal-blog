import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import * as argon2 from "argon2"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, currentPassword, newPassword } = body

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })
    }

    // Handle Name Update
    if (name) {
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { name },
      })
      return NextResponse.json({
        message: "Nama berhasil diperbarui.",
        user: { name: updatedUser.name },
      })
    }

    // Handle Password Update
    if (currentPassword && newPassword) {
      // Verifikasi password saat ini
      const isPasswordValid = await argon2.verify(user.password, currentPassword)
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Password saat ini salah." }, { status: 400 })
      }

      // Hash password baru
      const hashedPassword = await argon2.hash(newPassword)

      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
      })

      return NextResponse.json({ message: "Password berhasil diperbarui." })
    }

    return NextResponse.json({ error: "Tidak ada data yang valid untuk diupdate." }, { status: 400 })
  } catch (error) {
    console.error("Error updating profile settings:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
} 