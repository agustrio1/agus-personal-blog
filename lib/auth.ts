// lib/auth.ts
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import * as argon2 from "argon2"
import { sendVerificationCode } from "@/lib/send-verification-code"
import { Adapter } from "next-auth/adapters"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as unknown as Adapter,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        bypass2FA: { label: "Bypass 2FA", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password diperlukan")
        }

        try {
          // Cari user berdasarkan email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            // Update login attempts untuk keamanan
            throw new Error("Email atau password salah")
          }

          // Cek apakah user terkunci karena terlalu banyak percobaan login
          const now = new Date()
          const lockoutTime = 15 * 60 * 1000 // 15 menit
          
          if (user.loginAttempts >= 5 && user.lastLoginAttempt) {
            const timeSinceLastAttempt = now.getTime() - user.lastLoginAttempt.getTime()
            if (timeSinceLastAttempt < lockoutTime) {
              throw new Error("Akun terkunci. Coba lagi dalam 15 menit")
            }
          }

          // Verifikasi password
          const isValidPassword = await argon2.verify(user.password, credentials.password)
          
          if (!isValidPassword) {
            // Update login attempts
            await prisma.user.update({
              where: { id: user.id },
              data: {
                loginAttempts: user.loginAttempts + 1,
                lastLoginAttempt: now
              }
            })
            throw new Error("Email atau password salah")
          }

          // Reset login attempts jika berhasil
          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: 0,
              lastLoginAttempt: null
            }
          })

          // Jika ada flag bypass2FA, langsung return user (untuk login setelah verifikasi)
          if (credentials.bypass2FA === "true") {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              isVerified: true
            }
          }

          // SELALU kirim kode verifikasi untuk setiap login (2FA)
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
            
          // Throw error untuk meminta kode verifikasi (2FA)
          throw new Error("Kode verifikasi telah dikirim ke email Anda. Silakan masukkan kode untuk melanjutkan login.")

        } catch (error) {
          throw error
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isVerified = user.isVerified
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.isVerified = token.isVerified as boolean
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
}