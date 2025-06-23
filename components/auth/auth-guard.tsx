"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireVerification?: boolean
}

export function AuthGuard({ children, requireVerification = true }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (requireVerification && session?.user && !session.user.isVerified) {
      const email = session.user.email
      if (email) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`)
      }
      return
    }
  }, [session, status, router, requireVerification])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  if (requireVerification && session?.user && !session.user.isVerified) {
    return null
  }

  return <>{children}</>
}