"use client"

import Link from "next/link"
import { Github, Instagram } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="max-w-lg mx-auto pt-24 pb-16 px-4">
      <section className="bg-white/80 rounded-2xl shadow-xl p-8 mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">Kontak</h1>
        <p className="text-gray-700 mb-6 text-lg">
          Senang bisa terhubung! Untuk kolaborasi, pertanyaan, atau sekadar say hi, silakan kirim email ke:
        </p>
        <a href="mailto:aguswebdigital@gmail.com" className="inline-block text-xl font-semibold text-blue-700 hover:underline bg-blue-50 rounded-xl px-6 py-3 mb-4 shadow">
          aguswebdigital@gmail.com
        </a>
        <div className="flex flex-wrap justify-center gap-4 mb-6 mt-2">
          <a href="https://github.com/agustrio1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-all">
            <Github className="w-5 h-5" />
            GitHub
          </a>
          <a href="https://instagram.com/agusdev08" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-medium transition-all">
            <Instagram className="w-5 h-5" />
            Instagram
          </a>
        </div>
        <p className="text-gray-600 mt-6">
          Saya akan membalas secepat mungkin. Terima kasih sudah berkunjung ke blog & portfolio ini!
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/about" className="text-emerald-600 hover:underline">Tentang Saya</Link>
          <Link href="/projects" className="text-blue-600 hover:underline">Lihat Project Portfolio</Link>
        </div>
      </section>
    </main>
  )
} 