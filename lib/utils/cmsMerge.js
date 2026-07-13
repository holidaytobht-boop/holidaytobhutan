export function pickCmsString(apiVal, fallbackVal = '') {
  if (typeof apiVal === 'string' && apiVal.trim()) return apiVal.trim()
  return fallbackVal
}

export function mergeHomeHero(apiHome, fallback) {
  if (!apiHome?.slides?.length) return fallback

  const slides = apiHome.slides
    .map((s) => ({
      headline: s.headline?.trim() || '',
      subheading: s.subheading?.trim() || '',
      image: s.image?.trim() || '',
    }))
    .filter((s) => s.headline || s.subheading || s.image)

  if (!slides.length) return fallback

  return {
    eyebrow: pickCmsString(apiHome.eyebrow, fallback.eyebrow),
    slides,
  }
}

export function mergePageHero(apiHero, fallback) {
  if (!apiHero) return fallback

  const hasContent = ['eyebrow', 'title', 'subtitle', 'image', 'ctaText', 'ctaLink'].some(
    (key) => typeof apiHero[key] === 'string' && apiHero[key].trim()
  )

  if (!hasContent) return fallback

  return {
    eyebrow: pickCmsString(apiHero.eyebrow, fallback.eyebrow),
    title: pickCmsString(apiHero.title, fallback.title),
    subtitle: pickCmsString(apiHero.subtitle, fallback.subtitle),
    image: pickCmsString(apiHero.image, fallback.image),
    ctaText: pickCmsString(apiHero.ctaText, fallback.ctaText),
    ctaLink: pickCmsString(apiHero.ctaLink, fallback.ctaLink),
  }
}
