import { notFound } from 'next/navigation'
import TourCategoryPage from '@/components/site/TourCategoryPage'
import { tourCategories, tourCategorySlugs } from '@/lib/content/categories'

export function generateStaticParams() {
  return tourCategorySlugs.map((categorySlug) => ({ categorySlug }))
}

export default async function Page({ params }) {
  const { categorySlug } = await params
  const fallback = tourCategories[categorySlug]
  if (!fallback) notFound()
  return <TourCategoryPage slug={categorySlug} fallback={fallback} />
}
