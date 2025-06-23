import { getSiteSettings } from "@/lib/get-settings"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Calendar, ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"

export default async function Home() {
  const settings = await getSiteSettings()
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      content: true,
      images: { select: { url: true } },
    },
  })

  return (
    <>
      <Navbar blogName={settings.blogName || ""} />
      <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto pt-32 pb-16 px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Selamat datang di blog & portfolio
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
              {settings.blogName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {settings.blogDescription}
            </p>
          </div>

          {/* Latest Posts */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Postingan Terbaru</h2>
              <Link
                href="/posts"
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-300 group"
              >
                Lihat Semua
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="grid gap-6 md:gap-8">
              {posts.map((post, index) => (
                <article
                  key={post.id}
                  className={`group relative bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/80 dark:hover:bg-black/30 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-500 hover:-translate-y-1 ${
                    index === 0 ? "md:p-10 border-2 border-blue-200/50 dark:border-blue-800/50" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {post.images?.[0] && (
                      <div className="md:w-48 h-32 md:h-36 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden flex-shrink-0">
                        <Image
                          src={post.images[0].url || "/placeholder.svg"}
                          alt={post.title}
                          width={300}
                          height={150}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ objectFit: 'cover' }}
                          priority={false}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Link href={`/posts/${post.slug}`}>
                        <h3
                          className={`font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3 leading-tight ${
                            index === 0 ? "text-xl md:text-2xl" : "text-lg md:text-xl"
                          }`}
                        >
                          {post.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                        {post.content.replace(/<[^>]+>/g, "").slice(0, 150)}...
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { href: "/projects", title: "Portfolio", desc: "Lihat project terbaru", icon: "🚀" },
              { href: "/about", title: "Tentang", desc: "Kenali lebih dekat", icon: "👋" },
              { href: "/contact", title: "Kontak", desc: "Mari berkolaborasi", icon: "📧" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group p-6 bg-white/40 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl hover:bg-white/60 dark:hover:bg-black/30 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-2xl mb-3">{link.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {link.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
