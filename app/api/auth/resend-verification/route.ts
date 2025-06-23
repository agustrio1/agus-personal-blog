import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendVerificationCode } from "@/lib/send-verification-code"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email diperlukan" },
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

    if (user.isVerified) {
      return NextResponse.json(
        { error: "User sudah terverifikasi" },
        { status: 400 }
      )
    }

    // Generate kode verifikasi baru
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 menit

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode,
        verificationCodeExpires: expiresAt
      }
    })

    await sendVerificationCode(user.email, verificationCode)

    return NextResponse.json(
      { message: "Kode verifikasi berhasil dikirim ulang" },
      { status: 200 }
    )

  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}