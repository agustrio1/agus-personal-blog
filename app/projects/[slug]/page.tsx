// Optimasi: Static generation dengan ISR
export const revalidate = 3600 // 1 jam
export const dynamic = "force-static"

import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Calendar, User, ExternalLink, ArrowLeft, Code, Globe } from "lucide-react"
import { ShareButton } from "@/components/share-button"
import Image from "next/image"
import { getProjectBySlug, getAllProjects } from "@/lib/get-projects"

// Static params generation untuk ISR
export async function generateStaticParams() {
  try {
    const projects = await getAllProjects()
    return projects.map((project) => ({
      slug: project.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

// Optimized metadata generation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {
      title: "Project Tidak Ditemukan",
      description: "Project yang Anda cari tidak ditemukan.",
    }
  }

  const baseUrl = "https://agusdev.my.id"
  const projectUrl = `${baseUrl}/projects/${slug}`
  const description = project.description.slice(0, 160)
  const imageUrl = project.imageUrl || `${baseUrl}/og-project-default.png`

  return {
    title: `${project.title} | Portfolio Project - Agus Dev`,
    description,
    keywords: ["web development", "portfolio", "project showcase", project.title],
    authors: [{ name: project.author?.name || "Agus Dev" }],
    alternates: {
      canonical: projectUrl,
    },
    openGraph: {
      title: project.title,
      description,
      url: projectUrl,
      siteName: "Agus Dev Portfolio",
      type: "article",
      publishedTime: new Date(project.createdAt).toISOString(),
      modifiedTime: new Date(project.updatedAt).toISOString(),
      authors: [project.author?.name || "Agus Dev"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: [imageUrl],
      creator: "@agusdev",
    },
  }
}

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  // Structured data untuk SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.imageUrl || "https://agusdev.my.id/og-project-default.png",
    author: {
      "@type": "Person",
      name: project.author?.name || "Agus Dev",
      url: "https://agusdev.my.id/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Agus Dev Portfolio",
      logo: {
        "@type": "ImageObject",
        url: "https://agusdev.my.id/logo.png",
      },
    },
    dateCreated: new Date(project.createdAt).toISOString(),
    dateModified: new Date(project.updatedAt).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://agusdev.my.id/projects/${slug}`,
    },
    url: project.link,
  }

  return (
    <>
      {/* Structured Data untuk SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="max-w-5xl mx-auto pt-28 pb-16 px-4">
          {/* Back Button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 mb-8 group"
            prefetch={true}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Kembali ke daftar project
          </Link>

          <article className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/5 dark:shadow-white/5">
            {/* Project Image */}
            {project.imageUrl && (
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
                <Image
                  src={project.imageUrl || "/placeholder.svg"}
                  alt={project.title}
                  width={1200}
                  height={675}
                  className="w-full h-full object-cover"
                  style={{ objectFit: "cover" }}
                  priority
                  sizes="(max-width: 768px) 100vw, 1200px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2NzUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {project.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <time dateTime={new Date(project.createdAt).toISOString()} className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{project.author?.name || "Admin"}</span>
                </div>

                <div className="ml-auto flex items-center gap-3">
                  <ShareButton title={project.title} url={`/projects/${project.slug}`} />

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/25 hover:scale-105"
                    >
                      <Globe className="w-5 h-5" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>

              {/* Project Description */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  Tentang Project
                </h2>
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-strong:text-gray-900 dark:prose-strong:text-white">
                  <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">{project.description}</p>
                </div>
              </div>

              {/* Project Links Section */}
              {project.link && (
                <div className="bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-200/30 dark:border-purple-800/30">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Project Links
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-black/40 backdrop-blur-sm border border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-2xl font-medium transition-all duration-300 hover:bg-white dark:hover:bg-black/60 hover:shadow-lg group"
                    >
                      <Globe className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      Kunjungi Website
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* CTA Section */}
          <div className="mt-12 bg-white/40 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-8 text-center shadow-xl shadow-black/5 dark:shadow-white/5">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tertarik dengan project ini?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Jika Anda memiliki project serupa atau ingin berkolaborasi, jangan ragu untuk menghubungi saya. Mari
              diskusikan bagaimana kita bisa bekerja sama!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/25"
                prefetch={true}
              >
                Hubungi Saya
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-2xl font-medium transition-all duration-300 hover:bg-white/80 dark:hover:bg-black/30"
                prefetch={true}
              >
                Lihat Project Lain
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
