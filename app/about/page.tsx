import Link from "next/link"
import { Mail, ExternalLink, Code, Heart, Coffee } from "lucide-react"

export const metadata = {
  title: "Tentang Blog & Portfolio",
  description: "Tentang penulis blog, portfolio, dan layanan pengembangan web secara profesional dan personal.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <div className="max-w-4xl mx-auto pt-28 pb-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/80 dark:bg-emerald-900/30 backdrop-blur-sm rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Tentang saya
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-emerald-800 to-blue-800 dark:from-white dark:via-emerald-200 dark:to-blue-200 bg-clip-text text-transparent">
            Tentang Blog & Portfolio
          </h1>
        </div>

        <div className="space-y-8">
          {/* Main Content */}
          <section className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/5 dark:shadow-white/5">
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">👋</div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Halo! Saya Agus</h2>
                  <p className="text-gray-600 dark:text-gray-400 m-0">Web Developer & Problem Solver</p>
                </div>
              </div>

              <p className="text-xl leading-relaxed mb-6">
                Saya membantu bisnis, UMKM, dan personal brand membangun website & aplikasi yang modern, cepat, dan aman. Dengan pengalaman di berbagai project, saya siap menjadi partner digital Anda untuk mewujudkan solusi yang tepat guna dan mudah dikembangkan.
              </p>

              <p className="leading-relaxed mb-6">
                Layanan yang saya tawarkan meliputi:
              </p>
              <ul className="mb-6 list-disc list-inside text-gray-700 dark:text-gray-300">
                <li><strong>Pembuatan website & aplikasi</strong> (Laravel, Next.js, Express.js)</li>
                <li><strong>Desain antarmuka modern</strong> (React.js, Tailwind CSS)</li>
                <li><strong>Database handal</strong> (MySQL, PostgreSQL)</li>
                <li><strong>Deploy & optimasi server</strong> (VPS, cloud, Git)</li>
              </ul>

              <p className="leading-relaxed mb-6">
                Saya percaya, komunikasi yang jelas, pengerjaan tepat waktu, dan hasil yang bisa diandalkan adalah kunci kepuasan klien. Setiap project adalah kesempatan untuk belajar, berinovasi, dan tumbuh bersama.
              </p>

              <p className="leading-relaxed">
                Jika Anda ingin berdiskusi, konsultasi, atau mulai project baru, jangan ragu untuk menghubungi saya. Saya siap membantu mewujudkan ide digital Anda, baik untuk bisnis, portfolio, maupun kebutuhan custom lainnya.
              </p>
            </div>
          </section>

          {/* Skills & Focus */}
          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-xl shadow-black/5 dark:shadow-white/5">
              <div className="flex items-center gap-3 mb-6">
                <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Keahlian Utama</h3>
              </div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Framework:</span> Laravel, Next.js, Express.js
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Frontend:</span> React.js, Tailwind CSS
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Database:</span> MySQL, PostgreSQL
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Tools:</span> Git, VPS, Linux Server
                </div>
              </div>
            </section>

            <section className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-xl shadow-black/5 dark:shadow-white/5">
              <div className="flex items-center gap-3 mb-6">
                <Coffee className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nilai & Komitmen</h3>
              </div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Fokus:</span> Website modern, performa tinggi, desain responsif
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Kualitas:</span> Clean code, maintainable, scalable
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Komunikasi:</span> Terbuka, jelas, dan responsif
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Komitmen:</span> Hasil berkualitas, support after project, dan tumbuh bersama klien
                </div>
              </div>
            </section>
          </div>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-emerald-600/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-black/5 dark:shadow-white/5">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Siap Kolaborasi atau Konsultasi?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Yuk, mulai diskusi atau konsultasi gratis. Saya selalu terbuka untuk obrolan santai maupun project serius. Klik salah satu tombol di bawah untuk terhubung!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/25"
              >
                <ExternalLink className="w-4 h-4" />
                Lihat Portfolio
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-600/25"
              >
                <Mail className="w-4 h-4" />
                Hubungi Saya
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
