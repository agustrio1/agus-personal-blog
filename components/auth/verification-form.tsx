"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, RefreshCw, CheckCircle, Mail } from "lucide-react"

export function VerificationForm() {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const password = searchParams.get("password")

  useEffect(() => {
    if (!email) {
      router.push("/login")
    }
  }, [email, router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Step 1: Verifikasi kode
      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok) {
        setError(verifyData.error || "Verifikasi gagal")
        return
      }

      setSuccess("Verifikasi berhasil! Melanjutkan login...")
      
      // Step 2: Login tanpa 2FA
      if (password) {
        const loginResponse = await fetch("/api/auth/login-after-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        const loginData = await loginResponse.json()

        if (!loginResponse.ok) {
          setError(loginData.error || "Login gagal setelah verifikasi")
          return
        }

        // Step 3: Buat session dengan NextAuth (tanpa 2FA)
        const result = await signIn("credentials", {
          email,
          password,
          bypass2FA: "true",
          redirect: false,
          callbackUrl: "/dashboard"
        })

        if (result?.error) {
          setError("Gagal membuat session")
        } else {
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        }
      } else {
        // Jika tidak ada password, redirect ke login
        setTimeout(() => {
          router.push("/login")
        }, 1000)
      }
    } catch {
      setError("Terjadi kesalahan yang tidak terduga")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Kode verifikasi berhasil dikirim ulang")
        setCountdown(60)
      } else {
        setError(data.error || "Gagal mengirim ulang kode")
      }
    } catch {
      setError("Terjadi kesalahan yang tidak terduga")
    } finally {
      setResendLoading(false)
    }
  }

  if (!email) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-6 pb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="text-center space-y-3">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Verifikasi 2FA
            </CardTitle>
            <CardDescription className="text-gray-600 leading-relaxed">
              Masukkan kode verifikasi 6 digit yang telah dikirim ke email Anda
            </CardDescription>
            <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-3 mt-4">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{email}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="code" className="text-sm font-medium text-gray-700 text-center block">
                Masukkan Kode Verifikasi
              </Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-3xl font-mono tracking-[0.5em] h-16 border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl transition-all duration-200"
                maxLength={6}
                required
              />
              <p className="text-xs text-gray-500 text-center">{6 - code.length} digit lagi</p>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-emerald-200 bg-emerald-50">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-700">{success}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={loading || code.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Verifikasi & Login
                </>
              )}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Tidak menerima kode?</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleResend}
              disabled={resendLoading || countdown > 0}
              className="w-full h-11 border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-200"
            >
              {resendLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : countdown > 0 ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Kirim ulang dalam {countdown}s
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Kirim Ulang Kode
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
