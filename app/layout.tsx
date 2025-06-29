import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { getSiteSettings } from "@/lib/get-settings"
import TopProgressBar from "@/components/ui/top-progress-bar";

const inter = Inter({ subsets: ["latin"] })

// Fungsi untuk menghasilkan metadata dinamis
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings()

    const title = settings?.blogName || "Personal Blog"
    const description = settings?.blogDescription || "A modern personal blog with authentication"
    const url = "https://agusdev.my.id"; // Ganti dengan domain Anda
    const image = "https://agusdev.my.id/og-image.png"; // Ganti dengan OG image Anda

    return {
      title,
      description,
      keywords: [
        "jasa web kediri",
        "jasa pembuatan website surabaya",
        "jasa website jakarta",
        "jasa web bandung",
        "jasa pembuatan website profesional",
        "konsultasi website gratis",
        "web developer indonesia"
      ],
      metadataBase: new URL(url),
      openGraph: {
        title,
        description,
        url,
        siteName: title,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: "id_ID",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: url,
      },
      robots: {
        index: true,
        follow: true,
        nocache: false,
      },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Personal Blog",
              "url": "https://agusdev.my.id",
              "logo": "https://agusdev.my.id/og-image.png"
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers blogName={settings.blogName || "Personal Blog"}>
        <TopProgressBar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
