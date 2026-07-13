// Default destination catalogue — seeded into MongoDB on first run.
export const destinations = [
  {
    slug: 'paro',
    name: 'Paro',
    summary: "Tiger's Nest & the valley",
    image: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=800&q=80',
    tagline: "Home of the Tiger's Nest and Bhutan's only airport",
    heroImage: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=1600&q=80',
    altitude: '2,200 m',
    bestTime: 'Mar–May & Sep–Nov',
    overview:
      'Paro is one of the most beautiful valleys in Bhutan, with emerald rice fields, a winding river and over 150 temples and monasteries dating back to the 14th century.',
    places: [
      { slug: 'tigers-nest-taktsang', name: "Tiger's Nest (Taktsang)", desc: "Bhutan's most iconic monastery, clinging to a cliff 900 m above the valley.", image: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=800&q=80' },
      { slug: 'rinpung-dzong', name: 'Rinpung Dzong', desc: 'A grand 15th-century fortress-monastery overlooking the Paro river.', image: 'https://images.unsplash.com/photo-1567604130959-7ea7ab2a7807?auto=format&fit=crop&w=800&q=80' },
      { slug: 'national-museum-ta-dzong', name: 'National Museum (Ta Dzong)', desc: 'A circular watchtower housing Bhutanese art, relics and artefacts.', image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    slug: 'thimphu',
    name: 'Thimphu',
    summary: 'The vibrant capital',
    image: 'https://images.unsplash.com/photo-1567604130959-7ea7ab2a7807?auto=format&fit=crop&w=800&q=80',
    tagline: 'The lively capital where tradition meets modern Bhutan',
    heroImage: 'https://images.unsplash.com/photo-1567604130959-7ea7ab2a7807?auto=format&fit=crop&w=1600&q=80',
    altitude: '2,320 m',
    bestTime: 'Mar–May & Sep–Nov',
    overview:
      'Thimphu is the capital and largest city of Bhutan — the only capital in the world without a single traffic light.',
    places: [
      { slug: 'buddha-dordenma', name: 'Buddha Dordenma', desc: 'A 51-metre golden Buddha overlooking the city.', image: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=800&q=80' },
      { slug: 'tashichho-dzong', name: 'Tashichho Dzong', desc: 'The seat of government and the central monastic body.', image: 'https://images.unsplash.com/photo-1567604130959-7ea7ab2a7807?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    slug: 'punakha',
    name: 'Punakha',
    summary: 'Grand dzong & rivers',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80',
    tagline: 'The ancient capital at the meeting of two rivers',
    heroImage: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1600&q=80',
    altitude: '1,200 m',
    bestTime: 'Oct–Apr',
    overview:
      'Punakha was the capital of Bhutan until 1955 and remains the winter home of the monastic order.',
    places: [
      { slug: 'punakha-dzong', name: 'Punakha Dzong', desc: "Bhutan's most majestic fortress, set between two converging rivers.", image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    slug: 'bumthang',
    name: 'Bumthang',
    summary: 'Spiritual heartland',
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80',
    tagline: 'The spiritual heartland of Bhutan',
    heroImage: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=80',
    altitude: '2,600–4,000 m',
    bestTime: 'Mar–May & Sep–Nov',
    overview: 'Bumthang is made up of four magical valleys and is considered the religious heart of Bhutan.',
    places: [
      { slug: 'jakar-dzong', name: 'Jakar Dzong', desc: 'The "Castle of the White Bird" watching over the valley.', image: 'https://images.unsplash.com/photo-1567604130959-7ea7ab2a7807?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    slug: 'phobjikha',
    name: 'Phobjikha',
    summary: 'Valley of black-necked cranes',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
    tagline: 'The glacial valley of the black-necked cranes',
    heroImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80',
    altitude: '3,000 m',
    bestTime: 'Oct–Feb (crane season)',
    overview:
      'Phobjikha is a wide, glacial valley on the western slopes of the Black Mountains.',
    places: [
      { slug: 'gangtey-monastery', name: 'Gangtey Monastery', desc: 'A beautiful 17th-century monastery overlooking the valley.', image: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    slug: 'haa',
    name: 'Haa Valley',
    summary: 'Remote & untouched',
    image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80',
    tagline: 'A remote, untouched valley off the beaten path',
    heroImage: 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1600&q=80',
    altitude: '2,700 m',
    bestTime: 'Apr–Sep',
    overview:
      "One of Bhutan's smallest and least-visited districts, Haa is a hidden gem of forested hills and sacred temples.",
    places: [
      { slug: 'chele-la-pass', name: 'Chele La Pass', desc: "Bhutan's highest road pass with sweeping Himalayan views.", image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80' },
    ],
  },
]
