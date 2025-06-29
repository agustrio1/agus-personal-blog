export const dynamic = "force-dynamic";

import { getSiteSettings } from "@/lib/get-settings"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { Calendar, ArrowRight, Sparkles, Star, Rocket, BarChart3 } from "lucide-react"
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
      <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto pt-32 pb-20 px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Selamat datang di blog & portfolio
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-700 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight drop-shadow-lg">
              {settings.blogName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-4 mx-auto md:mx-0 leading-relaxed">
              {settings.blogDescription}
            </p>
            <p className="text-base text-emerald-700 dark:text-emerald-300 font-semibold mb-8 mx-auto md:mx-0">
              Konsultasi gratis untuk semua kebutuhan website & digital Anda!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/posts" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
                Mulai Baca Artikel
              </Link>
              <Link href="/contact" className="px-8 py-4 rounded-2xl bg-white/80 dark:bg-black/30 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-200 font-bold text-lg shadow hover:bg-white/90 dark:hover:bg-black/50 transition-all duration-200">
                Konsultasi Gratis
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <Image
              src="/hero-illustration.svg"
              alt="Ilustrasi Hero"
              width={400}
              height={400}
              className="w-80 h-80 md:w-96 md:h-96 object-contain drop-shadow-xl"
              priority
            />
          </div>
        </section>

        {/* Section SEO Jasa Web */}
        <section className="max-w-4xl mx-auto px-4 mb-8">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Jasa Pembuatan Website Kediri, Surabaya, Jakarta, Bandung
          </h2>
          <p className="text-center text-gray-700 dark:text-gray-200">
            Kami melayani jasa pembuatan website profesional untuk bisnis dan personal di Kediri, Surabaya, Jakarta, dan Bandung. Konsultasi gratis, pengerjaan cepat, dan support penuh untuk kebutuhan digital Anda!
          </p>
        </section>

        {/* Value Proposition Section */}
        <section className="max-w-5xl mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 dark:bg-black/30 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center border border-white/20 dark:border-white/10">
              <Star className="w-10 h-10 text-yellow-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">Konten Berkualitas</h3>
              <p className="text-gray-600 dark:text-gray-300">Artikel dan insight mendalam, praktis, dan selalu up-to-date untuk pengembangan diri & bisnis Anda.</p>
            </div>
            <div className="bg-white/80 dark:bg-black/30 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center border border-white/20 dark:border-white/10">
              <BarChart3 className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">Strategi Berbasis Data</h3>
              <p className="text-gray-600 dark:text-gray-300">Analisis mendalam untuk merancang strategi konten dan produk yang memberikan hasil nyata.</p>
            </div>
            <div className="bg-white/80 dark:bg-black/30 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center border border-white/20 dark:border-white/10">
              <Rocket className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">Solusi Digital Inovatif</h3>
              <p className="text-gray-600 dark:text-gray-300">Membangun solusi digital yang cepat, aman, dan skalabel untuk menjawab tantangan bisnis modern.</p>
            </div>
          </div>
        </section>

        {/* Latest Posts */}
        <section className="max-w-5xl mx-auto px-4 mb-20">
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
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className={`group relative bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/80 dark:hover:bg-black/30 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-500 hover:-translate-y-1 ${
                  index === 0 ? "md:col-span-2 border-2 border-blue-200/50 dark:border-blue-800/50" : ""
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
          <div className="flex justify-center mt-10">
            <Link href="/posts" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
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
              { href: "/contact", title: "Kontak", desc: <><span>Mari berkolaborasi atau </span><span className="inline-block bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 rounded px-2 py-0.5 text-xs font-semibold ml-1">Konsultasi Gratis</span>!</>, icon: "📧" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group p-8 bg-white/80 dark:bg-black/30 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl hover:bg-white/90 dark:hover:bg-black/50 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center"
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
