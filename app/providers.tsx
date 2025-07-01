"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsAppProvider } from "@/components/cta/whatsapp-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function Providers({
  children,
  blogName,
}: {
  children: React.ReactNode
  blogName: string
}) {
  const pathname = usePathname()

  // Define routes where navbar and WhatsApp CTA should be hidden
  const hideNavbarRoutes = ["/login", "/register", "/auth"]

  // Define routes where WhatsApp CTA should be hidden (login, auth, and all dashboard pages)
  const hideWhatsAppRoutes = ["/login", "/register", "/auth", "/dashboard", "/admin"]

  // Check if current path should hide navbar (login page or any dashboard page)
  const shouldHideNavbar =
    hideNavbarRoutes.some((route) => pathname.startsWith(route)) || pathname.startsWith("/dashboard")

  // Check if current path should hide WhatsApp CTA (login, auth, or any dashboard page)
  const shouldHideWhatsApp = hideWhatsAppRoutes.some((route) => pathname.startsWith(route))

  // Check if current path is dashboard/admin area
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin")

  // QueryClient untuk React Query
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 menit
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <>
      {/* Show navbar on all pages except login/auth pages */}
      {!shouldHideNavbar && <Navbar blogName={blogName} />}

      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <div className={`min-h-screen flex flex-col ${!shouldHideNavbar ? "pt-20" : ""}`}>
            <main className="flex-1">{children}</main>
            {/* Show footer on all pages except dashboard */}
            {!isDashboard && <Footer />}
          </div>
        </SessionProvider>
      </QueryClientProvider>

      {/* Show WhatsApp CTA on all pages except login, auth, and dashboard/admin */}
      {!shouldHideWhatsApp && (
        <WhatsAppProvider
          variant="cta"
          phoneNumber="+6281262465409"
          businessName="CS AgusDev"
          ctaText="Butuh Bantuan? Klik Disini!"
          welcomeMessage="Selamat datang di AgusDev! Silakan beritahu apa yang dapat kami bantu untuk Anda."
        />
      )}
    </>
  )
}
