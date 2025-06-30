import Link from "next/link"
import Image from "next/image"
import { Sparkles } from "lucide-react"

interface HeroSectionProps {
  settings: {
    blogName: string
    blogDescription: string
  }
}

export function HeroSection({ settings }: HeroSectionProps) {
  return (
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
          <Link
            href="/posts"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
            prefetch={true}
          >
            Mulai Baca Artikel
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-2xl bg-white/80 dark:bg-black/30 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-200 font-bold text-lg shadow hover:bg-white/90 dark:hover:bg-black/50 transition-all duration-200"
            prefetch={true}
          >
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
  )
}
