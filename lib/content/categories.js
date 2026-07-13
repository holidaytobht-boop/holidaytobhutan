import {
  trekkingTours,
  culturalTours,
  pilgrimageTours,
  birdingTours,
  flyFishingTours,
  natureTours,
  meditationTours,
  yogaTours,
  foodTours,
  bikingTours,
  motorcycleTours,
} from '@/lib/content/tours'

/** Maps URL slug → static fallback content for tour category pages */
export const tourCategories = {
  'trekking-tours': trekkingTours,
  'cultural-tours': culturalTours,
  'pilgrimage-tours': pilgrimageTours,
  'birding-tours': birdingTours,
  'fly-fishing-tours': flyFishingTours,
  'nature-tours': natureTours,
  'meditation-tours': meditationTours,
  'yoga-tours': yogaTours,
  'food-tours': foodTours,
  'biking-tours': bikingTours,
  'motorcycle-tours': motorcycleTours,
}

export const tourCategorySlugs = Object.keys(tourCategories)
