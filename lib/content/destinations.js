const img = (id, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const destinations = {
  eyebrow: 'Destinations',
  title: 'Destinations in Bhutan',
  subtitle:
    'From the cliffs of Paro to the cranes of Phobjikha \u2014 explore the regions that make Bhutan unforgettable.',
  heroImage: img('photo-1506905925346-21bda4d32df4', 1600),
  ctaLabel: 'Explore Destinations',
  introTitle: 'Explore the Regions of Bhutan',
  introSubtitle: 'Iconic valleys, fortress dzongs and hidden gems',
  introText:
    'Each valley in Bhutan has its own character, climate and story. Wander the sacred sites of Paro, feel the energy of the capital Thimphu, cross the rivers of Punakha, and discover the remote beauty of Bumthang, Phobjikha and Haa. Whatever your journey, these are the places that will stay with you forever.',
  packagesTitle: 'Top Destinations',
  packagesSubtitle: 'The valleys and towns at the heart of every journey',
  packages: [
    { title: 'Paro', summary: "Tiger's Nest & the valley", img: img('photo-1570366583862-f91883984fde'), path: '/destinations/paro' },
    { title: 'Thimphu', summary: 'The vibrant capital', img: img('photo-1567604130959-7ea7ab2a7807'), path: '/destinations/thimphu' },
    { title: 'Punakha', summary: 'Grand dzong & rivers', img: img('photo-1528181304800-259b08848526'), path: '/destinations/punakha' },
    { title: 'Bumthang', summary: 'Spiritual heartland', img: img('photo-1483728642387-6c3bdd6c93e5'), path: '/destinations/bumthang' },
    { title: 'Phobjikha', summary: 'Valley of black-necked cranes', img: img('photo-1540541338287-41700207dee6'), path: '/destinations/phobjikha' },
    { title: 'Haa Valley', summary: 'Remote & untouched', img: img('photo-1455587734955-081b22074882'), path: '/destinations/haa' },
  ],
  highlightsTitle: 'What You\u2019ll Experience',
  highlightsSubtitle: 'The unforgettable sights across these regions',
  highlights: [
    { title: 'Sacred Monasteries', img: img('photo-1570366583862-f91883984fde') },
    { title: 'Majestic Dzongs', img: img('photo-1567604130959-7ea7ab2a7807') },
    { title: 'Himalayan Valleys', img: img('photo-1540541338287-41700207dee6') },
    { title: 'Alpine Lakes', img: img('photo-1506905925346-21bda4d32df4') },
  ],
}

export const destinationDetails = {
  paro: {
    name: 'Paro',
    tagline: 'Home of the Tiger\u2019s Nest and Bhutan\u2019s only airport',
    heroImage: img('photo-1570366583862-f91883984fde', 1600),
    altitude: '2,200 m',
    bestTime: 'Mar\u2013May & Sep\u2013Nov',
    overview:
      'Paro is one of the most beautiful valleys in Bhutan, with emerald rice fields, a winding river and over 150 temples and monasteries dating back to the 14th century. It is the gateway to the kingdom, home to the only international airport, and the starting point for the legendary hike to Taktsang \u2014 the Tiger\u2019s Nest.',
    places: [
      { name: 'Tiger\u2019s Nest (Taktsang)', desc: 'Bhutan\u2019s most iconic monastery, clinging to a cliff 900 m above the valley.', img: img('photo-1570366583862-f91883984fde') },
      { name: 'Rinpung Dzong', desc: 'A grand 15th-century fortress-monastery overlooking the Paro river.', img: img('photo-1567604130959-7ea7ab2a7807') },
      { name: 'National Museum (Ta Dzong)', desc: 'A circular watchtower housing Bhutanese art, relics and artefacts.', img: img('photo-1605640840605-14ac1855827b') },
      { name: 'Kyichu Lhakhang', desc: 'One of the oldest and most sacred temples in the kingdom.', img: img('photo-1528181304800-259b08848526') },
      { name: 'Drukgyel Dzong', desc: 'Ruins of a victory fortress with views of Mount Jomolhari.', img: img('photo-1519681393784-d120267933ba') },
      { name: 'Paro Town', desc: 'A charming main street of traditional shops, cafes and craft stores.', img: img('photo-1571536802807-30451e3955d8') },
    ],
  },
  thimphu: {
    name: 'Thimphu',
    tagline: 'The lively capital where tradition meets modern Bhutan',
    heroImage: img('photo-1567604130959-7ea7ab2a7807', 1600),
    altitude: '2,320 m',
    bestTime: 'Mar\u2013May & Sep\u2013Nov',
    overview:
      'Thimphu is the capital and largest city of Bhutan \u2014 the only capital in the world without a single traffic light. It blends bustling markets, cosy cafes and nightlife with ancient dzongs and giant Buddha statues, offering the perfect window into modern Bhutanese life.',
    places: [
      { name: 'Buddha Dordenma', desc: 'A 51-metre golden Buddha overlooking the city, housing 100,000 statues.', img: img('photo-1570366583862-f91883984fde') },
      { name: 'Tashichho Dzong', desc: 'The seat of government and the central monastic body.', img: img('photo-1567604130959-7ea7ab2a7807') },
      { name: 'Memorial Chorten', desc: 'A white stupa where locals gather daily to pray and circumambulate.', img: img('photo-1528181304800-259b08848526') },
      { name: 'Centenary Farmers\u2019 Market', desc: 'A vibrant weekend market full of local produce and handicrafts.', img: img('photo-1571536802807-30451e3955d8') },
      { name: 'Motithang Takin Preserve', desc: 'Home to the takin, Bhutan\u2019s unusual national animal.', img: img('photo-1464822759023-fed622ff2c3b') },
      { name: 'Folk Heritage Museum', desc: 'A restored farmhouse showing rural Bhutanese life of the past.', img: img('photo-1605640840605-14ac1855827b') },
    ],
  },
  punakha: {
    name: 'Punakha',
    tagline: 'The ancient capital at the meeting of two rivers',
    heroImage: img('photo-1528181304800-259b08848526', 1600),
    altitude: '1,200 m',
    bestTime: 'Oct\u2013Apr',
    overview:
      'Punakha was the capital of Bhutan until 1955 and remains the winter home of the monastic order. Set in a warm, fertile valley where the Pho Chhu and Mo Chhu rivers meet, it is famous for its breathtaking dzong, suspension bridges and gentle valley walks.',
    places: [
      { name: 'Punakha Dzong', desc: 'Bhutan\u2019s most majestic fortress, set between two converging rivers.', img: img('photo-1528181304800-259b08848526') },
      { name: 'Punakha Suspension Bridge', desc: 'One of the longest suspension bridges in Bhutan, draped in prayer flags.', img: img('photo-1519681393784-d120267933ba') },
      { name: 'Chimi Lhakhang', desc: 'The famous fertility temple reached through terraced rice fields.', img: img('photo-1567604130959-7ea7ab2a7807') },
      { name: 'Khamsum Yulley Chorten', desc: 'A hilltop stupa with panoramic views over the valley.', img: img('photo-1464822759023-fed622ff2c3b') },
    ],
  },
  bumthang: {
    name: 'Bumthang',
    tagline: 'The spiritual heartland of Bhutan',
    heroImage: img('photo-1483728642387-6c3bdd6c93e5', 1600),
    altitude: '2,600\u20134,000 m',
    bestTime: 'Mar\u2013May & Sep\u2013Nov',
    overview:
      'Bumthang is made up of four magical valleys and is considered the religious heart of Bhutan, dotted with some of the kingdom\u2019s oldest and holiest temples. Famous for its apple orchards, buckwheat, cheese and honey, it is a place of myth, pilgrimage and serene mountain scenery.',
    places: [
      { name: 'Jakar Dzong', desc: 'The \u201cCastle of the White Bird\u201d watching over the valley.', img: img('photo-1567604130959-7ea7ab2a7807') },
      { name: 'Jambay Lhakhang', desc: 'A 7th-century temple and site of the famous fire festival.', img: img('photo-1570366583862-f91883984fde') },
      { name: 'Kurjey Lhakhang', desc: 'A sacred complex marking where Guru Rinpoche meditated.', img: img('photo-1528181304800-259b08848526') },
      { name: 'Burning Lake (Mebar Tsho)', desc: 'A holy gorge pool steeped in legend and prayer flags.', img: img('photo-1506905925346-21bda4d32df4') },
    ],
  },
  phobjikha: {
    name: 'Phobjikha',
    tagline: 'The glacial valley of the black-necked cranes',
    heroImage: img('photo-1540541338287-41700207dee6', 1600),
    altitude: '3,000 m',
    bestTime: 'Oct\u2013Feb (crane season)',
    overview:
      'Phobjikha (also called Gangtey) is a wide, glacial valley on the western slopes of the Black Mountains. Each winter it welcomes hundreds of rare black-necked cranes that migrate from Tibet, making it one of the most important wildlife sanctuaries in the Himalayas.',
    places: [
      { name: 'Gangtey Monastery', desc: 'A beautiful 17th-century monastery overlooking the valley.', img: img('photo-1570366583862-f91883984fde') },
      { name: 'Black-Necked Crane Centre', desc: 'Learn about the rare cranes that winter in the valley.', img: img('photo-1540541338287-41700207dee6') },
      { name: 'Gangtey Nature Trail', desc: 'A gentle, scenic walk through meadows and pine forest.', img: img('photo-1464822759023-fed622ff2c3b') },
      { name: 'Phobjikha Valley', desc: 'Vast wetlands and pastures with grazing yaks and big skies.', img: img('photo-1455587734955-081b22074882') },
    ],
  },
  haa: {
    name: 'Haa Valley',
    tagline: 'A remote, untouched valley off the beaten path',
    heroImage: img('photo-1455587734955-081b22074882', 1600),
    altitude: '2,700 m',
    bestTime: 'Apr\u2013Sep',
    overview:
      'One of Bhutan\u2019s smallest and least-visited districts, Haa is a hidden gem of forested hills, traditional farmhouses and sacred temples. Reached over the dramatic Chele La \u2014 the highest motorable pass in Bhutan \u2014 it offers an authentic glimpse of rural Bhutanese life.',
    places: [
      { name: 'Chele La Pass', desc: 'Bhutan\u2019s highest road pass with sweeping Himalayan views.', img: img('photo-1519681393784-d120267933ba') },
      { name: 'Lhakhang Karpo (White Temple)', desc: 'An ancient temple said to be built by a white pigeon.', img: img('photo-1570366583862-f91883984fde') },
      { name: 'Lhakhang Nagpo (Black Temple)', desc: 'A sacred temple beside a holy pond near the white temple.', img: img('photo-1528181304800-259b08848526') },
      { name: 'Haa Town & Valley', desc: 'A quiet valley of farmhouses, fields and warm hospitality.', img: img('photo-1464822759023-fed622ff2c3b') },
    ],
  },
}
