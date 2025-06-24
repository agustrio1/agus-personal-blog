import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full mt-20">
      {/* Simple separator line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-8" />

      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
          {/* Copyright */}
          <div className="flex items-center gap-2">
            <span>&copy; {currentYear}</span>
            <Link
              href="/"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            >
             Agus Dev
            </Link>
          </div>

          {/* Simple links */}
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200">
              Tentang
            </Link>
            <Link
              href="/contact"
              className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
            >
              Kontak
            </Link>
            <a
              href="https://wa.me/6281262465409"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
