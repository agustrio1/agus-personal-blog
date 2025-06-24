import Link from "next/link"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main 404 Card */}
        <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/5 dark:shadow-white/5 mb-8">
          {/* Animated 404 Illustration */}
          <div className="mb-8">
            <div className="relative inline-block">
              <svg
                className="w-80 h-80 md:w-96 md:h-96 mx-auto"
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Circle with pulse */}
                <circle cx="250" cy="250" r="200" fill="url(#backgroundGradient)" className="opacity-10">
                  <animate attributeName="r" values="200;220;200" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.1;0.2;0.1" dur="4s" repeatCount="indefinite" />
                </circle>

                {/* Ground/Platform */}
                <ellipse cx="250" cy="400" rx="150" ry="20" fill="url(#groundGradient)" className="opacity-30" />

                {/* Character Shadow */}
                <ellipse cx="250" cy="395" rx="40" ry="8" fill="#000000" className="opacity-20">
                  <animate attributeName="rx" values="40;45;40" dur="3s" repeatCount="indefinite" />
                </ellipse>

                {/* Character Body */}
                <ellipse cx="250" cy="320" rx="35" ry="70" fill="url(#bodyGradient)">
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 0,-5; 0,0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </ellipse>

                {/* Character Arms */}
                <ellipse cx="220" cy="280" rx="12" ry="35" fill="url(#bodyGradient)" transform="rotate(-20 220 280)">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="-20 220 280; -15 220 280; -20 220 280"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </ellipse>
                <ellipse cx="280" cy="280" rx="12" ry="35" fill="url(#bodyGradient)" transform="rotate(45 280 280)">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="45 280 280; 50 280 280; 45 280 280"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </ellipse>

                {/* Character Head */}
                <circle cx="250" cy="220" r="35" fill="url(#headGradient)">
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 0,-5; 0,0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Character Hair */}
                <path d="M220 200 Q250 180 280 200 Q270 190 250 185 Q230 190 220 200" fill="url(#hairGradient)">
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 0,-5; 0,0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Character Eyes */}
                <circle cx="240" cy="215" r="4" fill="#2D3748">
                  <animate attributeName="ry" values="4;0.5;4" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="260" cy="215" r="4" fill="#2D3748">
                  <animate attributeName="ry" values="4;0.5;4" dur="3.2s" repeatCount="indefinite" />
                </circle>

                {/* Character Mouth */}
                <ellipse cx="250" cy="230" rx="8" ry="4" fill="#E53E3E" className="opacity-80">
                  <animate attributeName="rx" values="8;10;8" dur="4s" repeatCount="indefinite" />
                </ellipse>

                {/* Magnifying Glass Handle */}
                <rect
                  x="320"
                  y="320"
                  width="8"
                  height="80"
                  rx="4"
                  fill="url(#handleGradient)"
                  transform="rotate(45 320 320)"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="45 320 320; 50 320 320; 45 320 320"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </rect>

                {/* Magnifying Glass Lens */}
                <circle
                  cx="300"
                  cy="180"
                  r="50"
                  fill="url(#lensGradient)"
                  fillOpacity="0.3"
                  stroke="url(#lensStroke)"
                  strokeWidth="6"
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 5,-5; 0,0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Glass Reflection */}
                <circle cx="285" cy="165" r="18" fill="white" className="opacity-60">
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 5,-5; 0,0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate attributeName="opacity" values="0.6;0.8;0.6" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* 404 Text inside lens */}
                <text
                  x="300"
                  y="190"
                  textAnchor="middle"
                  className="fill-blue-600 dark:fill-blue-400 font-bold"
                  style={{ fontSize: "32px" }}
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 5,-5; 0,0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  404
                </text>

                {/* Floating Question Marks */}
                <text x="150" y="150" className="fill-purple-500 opacity-60" style={{ fontSize: "24px" }}>
                  <animate attributeName="y" values="150;130;150" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />?
                </text>
                <text x="380" y="120" className="fill-pink-500 opacity-50" style={{ fontSize: "20px" }}>
                  <animate attributeName="y" values="120;100;120" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite" />?
                </text>
                <text x="100" y="300" className="fill-indigo-500 opacity-70" style={{ fontSize: "18px" }}>
                  <animate attributeName="y" values="300;280;300" dur="3.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="3.5s" repeatCount="indefinite" />?
                </text>

                {/* Search particles */}
                <circle cx="350" cy="100" r="4" fill="url(#particleGradient)">
                  <animate attributeName="cy" values="100;80;100" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="380" cy="140" r="3" fill="url(#particleGradient2)">
                  <animate attributeName="cy" values="140;120;140" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="320" cy="80" r="3.5" fill="url(#particleGradient3)">
                  <animate attributeName="cy" values="80;60;80" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.2s" repeatCount="indefinite" />
                </circle>

                {/* Floating Stars */}
                <g>
                  <path
                    d="M120 100 L125 110 L135 110 L127 118 L130 128 L120 122 L110 128 L113 118 L105 110 L115 110 Z"
                    fill="url(#starGradient)"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0 120 100; 360 120 100"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
                  </path>
                </g>

                <g>
                  <path
                    d="M400 250 L405 260 L415 260 L407 268 L410 278 L400 272 L390 278 L393 268 L385 260 L395 260 Z"
                    fill="url(#starGradient2)"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="360 400 250; 0 400 250"
                      dur="6s"
                      repeatCount="indefinite"
                    />
                    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" />
                  </path>
                </g>

                {/* Gradients */}
                <defs>
                  <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="groundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6B7280" />
                    <stop offset="100%" stopColor="#4B5563" />
                  </linearGradient>
                  <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                  <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#92400E" />
                    <stop offset="100%" stopColor="#78350F" />
                  </linearGradient>
                  <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                  <linearGradient id="lensGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E0F2FE" />
                    <stop offset="100%" stopColor="#BAE6FD" />
                  </linearGradient>
                  <linearGradient id="lensStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                  <linearGradient id="particleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F472B6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                  <linearGradient id="particleGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="particleGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                  <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                  <linearGradient id="starGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FB7185" />
                    <stop offset="100%" stopColor="#F43F5E" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
              Oops! Sepertinya halaman yang Anda cari sedang bersembunyi
            </p>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Jangan khawatir, bahkan detektif terbaik pun kadang kehilangan jejak. Mari kita bantu Anda menemukan jalan
              kembali ke konten yang menarik!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/25 hover:scale-105 group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Kembali ke Beranda
            </Link>

            <Link
              href="/posts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-2xl font-medium transition-all duration-300 hover:bg-white/80 dark:hover:bg-black/30 group"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Jelajahi Artikel
            </Link>

            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-2xl font-medium transition-all duration-300 hover:bg-white/80 dark:hover:bg-black/30 group"
            >
              🚀<span className="group-hover:scale-110 transition-transform duration-300">Lihat Portfolio</span>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">Atau coba kunjungi:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/about"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Tentang Saya
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Link
                href="/contact"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Kontak
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <a
                href="mailto:agus@email.com"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Email Saya
              </a>
            </div>
          </div>
        </div>

        {/* Fun Fact Card */}
        <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-black/5 dark:shadow-white/5">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="text-2xl animate-bounce">💡</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tahukah Anda?</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {`Error 404 pertama kali muncul di CERN pada tahun 1992. Nama "404" berasal dari nomor ruangan tempat server web pertama berada!`}
          </p>
        </div>
      </div>
    </main>
  )
}
