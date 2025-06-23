"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        if (result.error.includes("Kode verifikasi telah dikirim")) {
          setSuccess("Kode verifikasi dikirim! Mengalihkan ke halaman verifikasi...")
          const verifyUrl = `/verify-email?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
          setTimeout(() => {
            router.push(verifyUrl)
          }, 1500)
        } else {
          setError(result.error)
        }
      } else {
        router.push("/dashboard")
      }
    } catch {
      setError("Terjadi kesalahan yang tidak terduga")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-4 pb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Selamat Datang Kembali
            </CardTitle>
            <CardDescription className="text-gray-600">
              Masuk ke akun personal blog Anda
        </CardDescription>
          </div>
      </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Alamat Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all duration-200"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input
                id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all duration-200"
                required
              />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
            </div>
          </div>

          {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="default" className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group" 
              disabled={loading}
            >
            {loading ? (
              <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Memproses...
              </>
            ) : (
                <>
                  Masuk ke Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
            )}
          </Button>
        </form>

        
      </CardContent>
    </Card>
    </div>
  )
}
