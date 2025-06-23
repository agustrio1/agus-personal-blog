import { prisma } from "@/lib/db"

export async function getSiteSettings() {
  try {
    if (!prisma) {
      // Prisma tidak terinisialisasi
      return {
        blogName: "Personal Blog",
        blogDescription: "A modern personal blog with authentication",
      }
    }
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 1 },
    })
    if (!settings) {
      return {
        blogName: "Personal Blog",
        blogDescription: "A modern personal blog with authentication",
      }
    }
    return settings
  } catch {
    // Fallback jika koneksi DB gagal atau tabel tidak ada
    return {
      blogName: "Personal Blog",
      blogDescription: "A modern personal blog with authentication",
    }
  }
} 