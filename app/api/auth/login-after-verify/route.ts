import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import * as argon2 from "argon2"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password diperlukan" },
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

    // Verifikasi password
    const isValidPassword = await argon2.verify(user.password, password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Password salah" },
        { status: 401 }
      )
    }

    // Reset login attempts jika berhasil
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lastLoginAttempt: null
      }
    })

    return NextResponse.json(
      { 
        message: "Login berhasil",
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
    console.error("Login after verify error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
} 