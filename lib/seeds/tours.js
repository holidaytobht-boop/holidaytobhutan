// Lightweight catalogue of tour categories and their packages.
// In a real deployment this would come from a database.

export const tours = [
  {
    slug: 'trekking-tours',
    name: 'Trekking Tours',
    summary: 'Ancient trails through pristine valleys, glacial lakes and towering Himalayan peaks.',
    image: '/images/tours/trekking%20herobanner.jpg',
    packages: [
      { slug: 'druk-path-trek', name: 'Druk Path Trek', durationDays: 6, fromPriceUsd: 1800, image: '/images/tours/drukpath%20trek.jpg', heroImage: '/images/tours/drukpath%20trek.jpg' },
      { slug: 'jomolhari-trek', name: 'Jomolhari Trek', durationDays: 9, fromPriceUsd: 2750, image: '/images/tours/jomolhari%20trek.jpg', heroImage: '/images/tours/jomolhari%20trek.jpg' },
      { slug: 'snowman-trek', name: 'Snowman Trek', durationDays: 25, fromPriceUsd: 7100, image: '/images/tours/trekking%20herobanner.jpg', heroImage: '/images/tours/trekking%20herobanner.jpg' },
    ],
  },
  {
    slug: 'cultural-tours',
    name: 'Cultural Tours',
    summary: 'Fortress monasteries, sacred festivals and timeless mountain villages.',
    image: '/images/tours/Paro.jpg',
    packages: [
      { slug: 'glimpses-of-bhutan', name: 'Glimpses of Bhutan', durationDays: 5, fromPriceUsd: 1050, image: '/images/tours/Thimphu.jpg', heroImage: '/images/tours/Thimphu.jpg' },
      { slug: 'cultural-heart-of-bhutan', name: 'Cultural Heart of Bhutan', durationDays: 8, fromPriceUsd: 1650, image: '/images/home/herobanner1.jpg', heroImage: '/images/home/herobanner1.jpg' },
      { slug: 'western-bhutan-discovery', name: 'Western Bhutan Discovery', durationDays: 7, fromPriceUsd: 1450, image: '/images/tours/thimphu1.jpg', heroImage: '/images/tours/thimphu1.jpg' },
    ],
  },
  {
    slug: 'pilgrimage-tours',
    name: 'Pilgrimage Tours',
    summary: "Walk the sacred trail of Guru Rinpoche through Bhutan's holiest sites.",
    packages: [
      { slug: 'sacred-sites-pilgrimage', name: 'Sacred Sites Pilgrimage', durationDays: 7, fromPriceUsd: 1450 },
      { slug: 'guru-rinpoche-trail', name: 'Guru Rinpoche Trail', durationDays: 9, fromPriceUsd: 1950 },
      { slug: 'bumthang-spiritual-circuit', name: 'Bumthang Spiritual Circuit', durationDays: 8, fromPriceUsd: 1800 },
    ],
  },
  {
    slug: 'birding-tours',
    name: 'Birding Tours',
    summary: 'Over 700 bird species across pristine Himalayan forests and valleys.',
    packages: [
      { slug: 'spring-birding-expedition', name: 'Spring Birding Expedition', durationDays: 10, fromPriceUsd: 2650 },
      { slug: 'black-necked-crane-watch', name: 'Black-Necked Crane Watch', durationDays: 6, fromPriceUsd: 1400 },
      { slug: 'eastern-bhutan-birding', name: 'Eastern Bhutan Birding', durationDays: 12, fromPriceUsd: 3300 },
    ],
  },
  {
    slug: 'fly-fishing-tours',
    name: 'Fly Fishing Tours',
    summary: 'Cast for wild brown trout in crystal-clear, glacier-fed Himalayan rivers.',
    packages: [
      { slug: 'himalayan-trout-adventure', name: 'Himalayan Trout Adventure', durationDays: 7, fromPriceUsd: 2150 },
      { slug: 'mo-chhu-river-fishing', name: 'Mo Chhu River Fishing', durationDays: 5, fromPriceUsd: 1500 },
      { slug: 'highland-lakes-fly-fishing', name: 'Highland Lakes Fly Fishing', durationDays: 8, fromPriceUsd: 2750 },
    ],
  },
  {
    slug: 'nature-tours',
    name: 'Nature Tours',
    summary: "Lush valleys, ancient forests and rare wildlife in the world's only carbon-negative country.",
    packages: [
      { slug: 'valleys-forests-discovery', name: 'Valleys & Forests Discovery', durationDays: 8, fromPriceUsd: 1650 },
      { slug: 'phobjikha-nature-escape', name: 'Phobjikha Nature Escape', durationDays: 5, fromPriceUsd: 1150 },
      { slug: 'himalayan-wilderness-tour', name: 'Himalayan Wilderness Tour', durationDays: 10, fromPriceUsd: 2300 },
    ],
  },
  {
    slug: 'meditation-tours',
    name: 'Meditation Tours',
    summary: 'Stillness and clarity in sacred monasteries and serene mountain retreats.',
    packages: [
      { slug: 'mindful-bhutan-retreat', name: 'Mindful Bhutan Retreat', durationDays: 7, fromPriceUsd: 1550 },
      { slug: 'monastery-meditation-journey', name: 'Monastery Meditation Journey', durationDays: 9, fromPriceUsd: 1950 },
      { slug: 'silent-valley-retreat', name: 'Silent Valley Retreat', durationDays: 6, fromPriceUsd: 1350 },
    ],
  },
  {
    slug: 'yoga-tours',
    name: 'Yoga Tours',
    summary: 'Practice yoga amid the Himalayas, balancing body, breath and breathtaking scenery.',
    packages: [
      { slug: 'himalayan-yoga-retreat', name: 'Himalayan Yoga Retreat', durationDays: 7, fromPriceUsd: 1550 },
      { slug: 'yoga-wellness-escape', name: 'Yoga & Wellness Escape', durationDays: 6, fromPriceUsd: 1650 },
      { slug: 'valley-vinyasa-journey', name: 'Valley Vinyasa Journey', durationDays: 8, fromPriceUsd: 1800 },
    ],
  },
  {
    slug: 'food-tours',
    name: 'Food Tours',
    summary: 'The fiery, soulful flavours of Bhutan from farmhouse kitchens to vibrant markets.',
    packages: [
      { slug: 'flavours-of-bhutan', name: 'Flavours of Bhutan', durationDays: 6, fromPriceUsd: 1300 },
      { slug: 'farm-to-table-journey', name: 'Farm to Table Journey', durationDays: 7, fromPriceUsd: 1450 },
      { slug: 'bhutanese-culinary-trail', name: 'Bhutanese Culinary Trail', durationDays: 8, fromPriceUsd: 1800 },
    ],
  },
  {
    slug: 'biking-tours',
    name: 'Biking Tours',
    summary: 'Prayer-flag passes, forest singletrack and timeless mountain villages on two wheels.',
    packages: [
      { slug: 'western-valleys-cycling', name: 'Western Valleys Cycling', durationDays: 7, fromPriceUsd: 1950 },
      { slug: 'dochula-mountain-biking', name: 'Dochula Mountain Biking', durationDays: 6, fromPriceUsd: 1700 },
      { slug: 'central-bhutan-bike-tour', name: 'Central Bhutan Bike Tour', durationDays: 9, fromPriceUsd: 2450 },
    ],
  },
  {
    slug: 'motorcycle-tours',
    name: 'Motorcycle Tours',
    summary: 'Ride the legendary Himalayan highways and high passes of the Thunder Dragon Kingdom.',
    packages: [
      { slug: 'thunder-dragon-ride', name: 'Thunder Dragon Ride', durationDays: 9, fromPriceUsd: 2750 },
      { slug: 'himalayan-passes-motorcycle-tour', name: 'Himalayan Passes Motorcycle Tour', durationDays: 11, fromPriceUsd: 3300 },
      { slug: 'east-west-motorcycle-expedition', name: 'East-West Motorcycle Expedition', durationDays: 14, fromPriceUsd: 4200 },
    ],
  },
]

export const findTourBySlug = (slug) => tours.find((tour) => tour.slug === slug)
