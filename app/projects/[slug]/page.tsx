"use client"
import Link from "next/link"
import { Mail, MessageCircle, ExternalLink, Send, Coffee } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <div className="max-w-3xl mx-auto pt-28 pb-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4" />
            Mari terhubung
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-emerald-800 dark:from-white dark:via-blue-200 dark:to-emerald-200 bg-clip-text text-transparent">
            Kontak
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Senang bisa terhubung! Mari berdiskusi tentang project atau sekadar say hi.
          </p>
        </div>

        <div className="space-y-8">
          {/* Main Contact Card */}
          <section className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl shadow-black/5 dark:shadow-white/5">
            <div className="text-6xl mb-6">📧</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Email Saya</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
              Untuk kolaborasi, pertanyaan teknis, atau sekadar ingin berkenalan, silakan kirim email ke:
            </p>
            <a
              href="mailto:agus@email.com"
              className="inline-flex items-center gap-3 text-2xl font-bold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-2xl px-8 py-4 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <Mail className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              agus@email.com
            </a>
            <p className="text-gray-500 dark:text-gray-400">
              Saya akan membalas secepat mungkin. Terima kasih sudah berkunjung ke blog & portfolio ini!
            </p>
          </section>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-xl shadow-black/5 dark:shadow-white/5 group hover:bg-white/80 dark:hover:bg-black/30 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Diskusi Project</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Punya ide website atau aplikasi web? Mari diskusikan bagaimana saya bisa membantu mewujudkannya.
              </p>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-300 group-hover:gap-3"
              >
                <ExternalLink className="w-4 h-4" />
                Lihat Portfolio Saya
              </Link>
            </section>

            <section className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-xl shadow-black/5 dark:shadow-white/5 group hover:bg-white/80 dark:hover:bg-black/30 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">☕</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Ngobrol Santai</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Ingin bertukar pikiran tentang teknologi web, atau sekadar berkenalan? Saya selalu terbuka untuk obrolan
                santai.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors duration-300 group-hover:gap-3"
              >
                <Coffee className="w-4 h-4" />
                Kenali Saya Lebih Dekat
              </Link>
            </section>
          </div>

          {/* Response Time Info */}
          <section className="bg-gradient-to-r from-emerald-600/10 via-blue-600/10 to-purple-600/10 dark:from-emerald-600/20 dark:via-blue-600/20 dark:to-purple-600/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-8 text-center shadow-xl shadow-black/5 dark:shadow-white/5">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Send className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Waktu Respon</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Biasanya saya membalas email dalam 24 jam. Untuk project urgent atau diskusi mendalam, kita bisa atur
              waktu video call yang lebih fleksibel.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
