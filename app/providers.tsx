"use client"

import { SessionProvider } from "next-auth/react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsAppCTA } from "@/components/ui/whatsapp-cta"

export function Providers({
  children,
  blogName,
}: {
  children: React.ReactNode
  blogName: string
}) {
  return (
    <>
      <Navbar blogName={blogName} />
      <SessionProvider>
        {children}
      </SessionProvider>
      <Footer />
      <WhatsAppCTA />
    </>
  )
} 