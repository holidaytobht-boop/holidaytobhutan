const KNOWN_TOUR_PATHS = {
  'trekking-tours': '/trekking-tours',
  'cultural-tours': '/cultural-tours',
  'pilgrimage-tours': '/pilgrimage-tours',
  'birding-tours': '/birding-tours',
  'fly-fishing-tours': '/fly-fishing-tours',
  'nature-tours': '/nature-tours',
  'meditation-tours': '/meditation-tours',
  'yoga-tours': '/yoga-tours',
  'food-tours': '/food-tours',
  'biking-tours': '/biking-tours',
  'motorcycle-tours': '/motorcycle-tours',
}

export const tourCategoryPath = (slug) => KNOWN_TOUR_PATHS[slug] || `/tours/c/${slug}`

export const cleanTourTitle = (title = '') => title.replace(' of Bhutan', '').replace(' Tours', ' Tours')
