import { prisma } from "@/lib/db"
import { unstable_cache } from "next/cache"

// Optimasi: Cache settings dengan waktu yang lebih lama
export const getSiteSettings = unstable_cache(
  async () => {
    try {
    if (!prisma) {
      // Prisma tidak terinisialisasi
      return {
        blogName: "Agus Dev",
        blogDescription: "Solusi website modern, dan tips teknologi praktis untuk bisnis Anda.",
      }
    }
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 1 },
    })
    if (!settings) {
      return {
        blogName: "Agus Dev",
        blogDescription: "Solusi website modern, dan tips teknologi praktis untuk bisnis Anda.",
      }
    }
    return settings
  } catch {
    // Fallback jika koneksi DB gagal atau tabel tidak ada
    return {
      blogName: "Agus Dev",
      blogDescription: "Solusi website modern, dan tips teknologi praktis untuk bisnis Anda.",
    }
  }
} 
, ["site-settings"], {
    revalidate: 7200, // Cache selama 2 jam
    tags: ["site-settings"],
  }
)