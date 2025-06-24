import Link from "next/link"
import { prisma } from "@/lib/db"
import type { Metadata } from "next"
import { User, ExternalLink, Rocket } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Semua Project | Blog",
  description: "Jelajahi semua project portfolio di blog ini.",
  alternates: {
    canonical: `https://agusdev.my.id/projects/`
  }
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
    },
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <div className="max-w-6xl mx-auto pt-28 pb-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100/80 dark:bg-purple-900/30 backdrop-blur-sm rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
            <Rocket className="w-4 h-4" />
            Portfolio showcase
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 dark:from-white dark:via-purple-200 dark:to-blue-200 bg-clip-text text-transparent">
            Semua Project
          </h1>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:gap-10">
          {projects.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🚀</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Belum ada project yang dipublikasikan.</p>
            </div>
          )}

          {projects.map((project, index) => (
            <article
              key={project.id}
              className={`group bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl overflow-hidden hover:bg-white/80 dark:hover:bg-black/30 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-500 hover:-translate-y-1 ${
                index === 0 ? "border-2 border-purple-200/50 dark:border-purple-800/50" : ""
              }`}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Project Image */}
                {project.imageUrl && (
                  <div className="w-full sm:w-40 h-40 bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                      style={{ objectFit: 'cover' }}
                      priority={false}
                    />
                  </div>
                )}

                {/* Project Content */}
                <div className="flex-1 p-8 md:p-10">
                  <Link href={`/projects/${project.slug}`}>
                    <h2
                      className={`font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 mb-4 leading-tight ${
                        index === 0 ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                      }`}
                    >
                      {project.title}
                    </h2>
                  </Link>

                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <User className="w-4 h-4" />
                    <span>{project.author?.name}</span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 line-clamp-3">
                    {project.description.slice(0, 200)}...
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/25"
                    >
                      Detail Project
                    </Link>

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-2xl font-medium transition-all duration-300 hover:bg-white/80 dark:hover:bg-black/30"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
