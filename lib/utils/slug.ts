import slugify from "slugify"

export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'id',
    remove: /[*+~.()'"!:@]/g
  })
}

export function generateUniqueSlug(text: string, existingSlugs: string[]): string {
  const slug = generateSlug(text)
  let counter = 1
  let uniqueSlug = slug

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  return uniqueSlug
} 