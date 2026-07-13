const galleryImage = (file) => `/images/home/gallery/${file}`

export const homePageSeed = {
  photoGallery: {
    title: 'Photo Gallery',
    subtitle: 'Real moments from our guests across Bhutan',
    photos: [
      { name: 'Sarah & Tom', trip: "Paro · Tiger's Nest", image: galleryImage('PXL_20260428_030403263.TS-000.jpg') },
      { name: 'Akiko Tanaka', trip: 'Punakha Valley', image: galleryImage('20250428_053654869_iOS.jpg') },
      { name: 'Daniel Meyer', trip: 'Jomolhari Trek', image: galleryImage('_DSC8545.jpg') },
      { name: 'Maria Lopez', trip: 'Phobjikha Valley', image: galleryImage('_DSC6173.jpg') },
      { name: 'James Carter', trip: 'Dochula Pass', image: galleryImage('_DSC8697.jpg') },
      { name: 'The Nguyen Family', trip: 'Thimphu', image: galleryImage('20250426_110139977_iOS.jpg') },
      { name: 'Elena Rossi', trip: 'Bumthang', image: galleryImage('PXL_20260506_080818203.TS-000.jpg') },
      { name: "Liam O'Brien", trip: 'Druk Path Trek', image: galleryImage('20241103_051606749_iOS.jpg') },
      { name: 'Priya & Arjun', trip: 'Paro Festival', image: galleryImage('20260501_020921767_iOS.jpg') },
      { name: 'Mark Wilson', trip: 'Snowman Trek', image: galleryImage('20260413_053514352_iOS.jpg') },
      { name: 'Sophie Laurent', trip: 'Haa Valley', image: galleryImage('20250925_025236000_iOS.jpg') },
      { name: 'David Kim', trip: 'Gangtey', image: galleryImage('20260503_051358328_iOS.jpg') },
    ],
  },
  reviews: {
    googleReviewUrl: 'https://g.page/r/holiday-to-bhutan/review',
    aggregateRating: 5,
    totalReviews: 45,
    items: [
      {
        text: "An absolutely flawless trip. Our guide was incredibly knowledgeable and the hike to Tiger's Nest was the highlight of our lives. We felt cared for every step of the way.",
        name: 'Sarah & Tom',
        avatar: 'https://i.pravatar.cc/100?img=32',
        timeAgo: '2 months ago',
        verified: true,
      },
      {
        text: 'Every detail was taken care of. Bhutan is magical and this team made it effortless and deeply meaningful. The dzong visits and homestay evenings were unforgettable.',
        name: 'Akiko Tanaka',
        avatar: 'https://i.pravatar.cc/100?img=45',
        timeAgo: '4 months ago',
        verified: true,
      },
      {
        text: 'The Jomolhari trek was challenging and breathtaking. Outstanding crew, food and organisation throughout. Already planning our return trip with the same team.',
        name: 'Daniel Meyer',
        avatar: 'https://i.pravatar.cc/100?img=12',
        timeAgo: '5 months ago',
        verified: true,
      },
      {
        text: 'From airport pickup to farewell dinner, everything ran smoothly. Our children loved the festival day in Thimphu and the gentle pace of the cultural tour.',
        name: 'Maria Lopez',
        initial: 'M',
        avatarColor: '#e8710a',
        timeAgo: '6 months ago',
        verified: true,
      },
      {
        text: 'Luxury without losing authenticity. Beautiful lodges, thoughtful guides, and a itinerary that balanced rest with adventure. Highly recommend for first-time visitors.',
        name: 'James Carter',
        avatar: 'https://i.pravatar.cc/100?img=68',
        timeAgo: '7 months ago',
        verified: true,
      },
      {
        text: 'Professional, warm, and deeply respectful of Bhutanese culture. The team answered every question and adapted the plan when weather changed. Five stars all the way.',
        name: 'Elena Rossi',
        initial: 'E',
        avatarColor: '#1a73e8',
        timeAgo: '8 months ago',
        verified: true,
      },
    ],
  },
}
