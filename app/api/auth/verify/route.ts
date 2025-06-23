import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email dan kode verifikasi diperlukan" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      )
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return NextResponse.json(
        { error: "Kode verifikasi tidak valid" },
        { status: 400 }
      )
    }

    if (new Date() > user.verificationCodeExpires) {
      return NextResponse.json(
        { error: "Kode verifikasi telah kedaluwarsa" },
        { status: 400 }
      )
    }

    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: "Kode verifikasi salah" },
        { status: 400 }
      )
    }

    // Update user - hapus kode verifikasi setelah berhasil
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: null,
        verificationCodeExpires: null
      }
    })

    return NextResponse.json(
      { 
        message: "Verifikasi berhasil",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isVerified: true
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}