export const revalidate = 1800; // 30 menit
export const dynamic = "force-static";

import Link from "next/link";
import type { Metadata } from "next";
import { User, ExternalLink, Rocket } from "lucide-react";
import Image from "next/image";
import { getAllProjects } from "@/lib/get-projects";

// SEO Metadata yang dioptimalkan
export const metadata: Metadata = {
  title: "Portfolio Projects | Blog Agus Dev - Showcase Karya Terbaik",
  description:
    "Jelajahi koleksi project portfolio terbaik dari web development, aplikasi mobile, dan solusi digital inovatif.",
  keywords: [
    "portfolio web developer",
    "project showcase",
    "web development portfolio",
    "aplikasi mobile",
    "digital solutions",
    "developer kediri",
  ],
  alternates: {
    canonical: "https://agusdev.my.id/projects",
  },
  openGraph: {
    title: "Portfolio Projects | Blog Agus Dev",
    description:
      "Jelajahi koleksi project portfolio terbaik dari web development dan solusi digital.",
    url: "https://agusdev.my.id/projects",
    siteName: "Agus Dev Blog",
    type: "website",
    images: [
      {
        url: "https://agusdev.my.id/og-projects.png",
        width: 1200,
        height: 630,
        alt: "Portfolio Projects - Agus Dev",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio Projects | Blog Agus Dev",
    description:
      "Jelajahi koleksi project portfolio terbaik dari web development dan solusi digital.",
    images: ["https://agusdev.my.id/og-image.png"],
  },
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <>
      {/* Structured Data untuk SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Portfolio Projects",
            description:
              "Koleksi project portfolio web development dan solusi digital",
            url: "https://agusdev.my.id/projects",
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: projects.length,
              itemListElement: projects.map((project, index) => ({
                "@type": "CreativeWork",
                position: index + 1,
                name: project.title,
                description: project.description.slice(0, 160),
                url: `https://agusdev.my.id/projects/${project.slug}`,
                dateCreated: new Date(project.createdAt).toISOString(),
                author: {
                  "@type": "Person",
                  name: project.author?.name || "Agus Dev",
                },
              })),
            },
          }),
        }}
      />

      <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="max-w-6xl mx-auto pt-28 pb-16 px-4">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100/80 dark:bg-purple-900/30 backdrop-blur-sm rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
              <Rocket className="w-4 h-4" />
              Portfolio showcase
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 dark:from-white dark:via-purple-200 dark:to-blue-200 bg-clip-text text-transparent">
              Portfolio Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Koleksi project terbaik dari web development, aplikasi mobile, dan
              solusi digital inovatif
            </p>
          </header>

          {/* Projects Grid */}
          <div className="grid gap-8 md:gap-10">
            {projects.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Belum ada project yang dipublikasikan
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Project akan muncul di sini setelah dipublikasikan
                </p>
              </div>
            )}

            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={index === 0}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

// Komponen ProjectCard yang dioptimalkan
function ProjectCard({
  project,
  featured = false,
}: {
  project: any;
  featured?: boolean;
}) {
  return (
    <article
      className={`group bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl overflow-hidden hover:bg-white/80 dark:hover:bg-black/30 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-500 hover:-translate-y-1 ${
        featured
          ? "border-2 border-purple-200/50 dark:border-purple-800/50"
          : ""
      }`}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Project Image */}
        {project.imageUrl && (
          <div className="w-full lg:w-80 h-48 lg:h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden flex-shrink-0">
            <Image
              src={project.imageUrl || "/file.svg"}
              alt={project.title}
              width={320}
              height={256}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ objectFit: "cover" }}
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 320px"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
            />
          </div>
        )}

        {/* Project Content */}
        <div className="flex-1 p-8 md:p-10">
          <Link href={`/projects/${project.slug}`} prefetch={true}>
            <h2
              className={`font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 mb-4 leading-tight ${
                featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
              }`}
            >
              {project.title}
            </h2>
          </Link>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <User className="w-4 h-4" />
            <span>{project.author?.name || "Admin"}</span>
            <span>•</span>
            <time dateTime={new Date(project.createdAt).toISOString()}>
              {new Date(project.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 line-clamp-3">
            {project.description.slice(0, 200)}...
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/25"
              prefetch={true}
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
  );
}
