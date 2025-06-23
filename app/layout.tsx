import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { getSiteSettings } from "@/lib/get-settings"

const inter = Inter({ subsets: ["latin"] })

// Fungsi untuk menghasilkan metadata dinamis
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings()

    const title = settings?.blogName || "Personal Blog"
    const description = settings?.blogDescription || "A modern personal blog with authentication"

    return {
      title,
      description,
    }
  } catch (error) {
    console.error("Failed to generate metadata:", error)
    // Fallback metadata jika terjadi error
    return {
      title: "Personal Blog",
      description: "A modern personal blog with authentication",
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://example.com/projects" />
        <link rel="canonical" href="https://example.com/projects/[slug]" />
      </head>
      <body className={inter.className}>
        <Providers blogName={settings.blogName || "Personal Blog"}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
