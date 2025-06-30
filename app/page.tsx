export const dynamic = "force-dynamic"
export const revalidate = 60 // Cache selama 60 detik

import { getSiteSettings } from "@/lib/get-settings"
import { getLatestPosts } from "@/lib/get-posts"
import Link from "next/link"
import { ArrowRight, Star, Rocket, BarChart3 } from "lucide-react"
import { Suspense } from "react"
import { PostCard } from "@/components/post-card"
import { HeroSection } from "@/components/hero-section"

// Komponen loading untuk posts
function PostsLoading() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white/60 dark:bg-black/20 rounded-3xl p-6 md:p-8 animate-pulse">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-48 h-32 md:h-36 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-32"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function Home() {
  const rawSettings = await getSiteSettings()
  const settings = {
    blogName: rawSettings.blogName ?? "Blog Saya",
    blogDescription: rawSettings.blogDescription ?? "Selamat datang di blog saya.",
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        {/* Hero Section - Dipisah ke komponen terpisah */}
        <HeroSection settings={settings} />

        {/* Section SEO Jasa Web */}
        <section className="max-w-4xl mx-auto px-4 mb-8">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Jasa Pembuatan Website Kediri, Surabaya, Jakarta, Bandung
          </h2>
          <p className="text-center text-gray-700 dark:text-gray-200">
            Kami melayani jasa pembuatan website profesional untuk bisnis dan personal di Kediri, Surabaya, Jakarta, dan
            Bandung. Konsultasi gratis, pengerjaan cepat, dan support penuh untuk kebutuhan digital Anda!
          </p>
        </section>

        {/* Value Proposition Section */}
        <section className="max-w-5xl mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 dark:bg-black/30 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center border border-white/20 dark:border-white/10">
              <Star className="w-10 h-10 text-yellow-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">Konten Berkualitas</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Artikel dan insight mendalam, praktis, dan selalu up-to-date untuk pengembangan diri & bisnis Anda.
              </p>
            </div>
            <div className="bg-white/80 dark:bg-black/30 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center border border-white/20 dark:border-white/10">
              <BarChart3 className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">Strategi Berbasis Data</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Analisis mendalam untuk merancang strategi konten dan produk yang memberikan hasil nyata.
              </p>
            </div>
            <div className="bg-white/80 dark:bg-black/30 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center border border-white/20 dark:border-white/10">
              <Rocket className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">Solusi Digital Inovatif</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Membangun solusi digital yang cepat, aman, dan skalabel untuk menjawab tantangan bisnis modern.
              </p>
            </div>
          </div>
        </section>

        {/* Latest Posts dengan Suspense */}
        <section className="max-w-5xl mx-auto px-4 mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Postingan Terbaru</h2>
            <Link
              href="/posts"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-300 group"
              prefetch={true}
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          <Suspense fallback={<PostsLoading />}>
            <LatestPosts />
          </Suspense>

          <div className="flex justify-center mt-10">
            <Link
              href="/posts"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              prefetch={true}
            >
              Lihat Semua Artikel
            </Link>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="max-w-5xl mx-auto px-4 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { href: "/projects", title: "Portfolio", desc: "Lihat project terbaru & studi kasus", icon: "🚀" },
              { href: "/about", title: "Tentang", desc: "Kenali lebih dekat siapa saya & visi blog ini", icon: "👋" },
              {
                href: "/contact",
                title: "Kontak",
                desc: (
                  <>
                    <span>Mari berkolaborasi atau </span>
                    <span className="inline-block bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 rounded px-2 py-0.5 text-xs font-semibold ml-1">
                      Konsultasi Gratis
                    </span>
                    !
                  </>
                ),
                icon: "📧",
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group p-8 bg-white/80 dark:bg-black/30 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl hover:bg-white/90 dark:hover:bg-black/50 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center"
                prefetch={true}
              >
                <div className="text-4xl mb-4">{link.icon}</div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {link.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-base">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

// Komponen terpisah untuk Latest Posts
async function LatestPosts() {
  const posts = await getLatestPosts()

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} featured={index === 0} />
      ))}
    </div>
  )
}
