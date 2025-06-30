// Utility functions untuk date handling yang aman
export function formatDate(date: string | Date, locale = "id-ID"): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    // Validasi date object
    if (isNaN(dateObj.getTime())) {
      return "Tanggal tidak valid"
    }

    return dateObj.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Tanggal tidak valid"
  }
}

export function getISOString(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    // Validasi date object
    if (isNaN(dateObj.getTime())) {
      return new Date().toISOString()
    }

    return dateObj.toISOString()
  } catch (error) {
    console.error("Error getting ISO string:", error)
    return new Date().toISOString()
  }
}

export function formatRelativeTime(date: string | Date, locale = "id-ID"): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

    if (diffInSeconds < 60) return "Baru saja"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`

    return formatDate(dateObj, locale)
  } catch (error) {
    console.error("Error formatting relative time:", error)
    return formatDate(date, locale)
  }
}

export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  try {
    const text = content.replace(/<[^>]+>/g, "")
    const wordCount = text.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  } catch (error) {
    console.error("Error calculating reading time:", error)
    return 1
  }
}
