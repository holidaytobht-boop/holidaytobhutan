const img = (id, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const trekkingTours = {
  title: 'Trekking Tours of Bhutan',
  subtitle:
    'Walk ancient trails through pristine valleys, glacial lakes and the towering peaks of the eastern Himalayas.',
  heroImage: '/images/tours/trekking%20herobanner.jpg',
  introTitle: 'Trek the Last Himalayan Kingdom',
  introSubtitle: 'Untouched trails guided by experienced local crews',
  introText:
    "Bhutan's treks range from gentle valley walks to some of the most remote and demanding high-altitude crossings on earth. With no roads and few trekkers, the trails remain wonderfully untouched \u2014 winding past sacred lakes, yak herder camps and villages unchanged for centuries. Our experienced guides, cooks and porters take care of every detail so you can focus on the breathtaking scenery.",
  packagesTitle: 'Trekking Packages',
  packages: [
    { title: 'Druk Path Trek', summary: '6 Days \u00b7 Max 4,200m \u00b7 Moderate', img: '/images/tours/drukpath%20trek.jpg' },
    { title: 'Jomolhari Trek', summary: '9 Days \u00b7 Max 4,930m \u00b7 Challenging', img: '/images/tours/jomolhari%20trek.jpg' },
    { title: 'Snowman Trek', summary: '25 Days \u00b7 Max 5,320m \u00b7 Expert', img: '/images/tours/trekking%20herobanner.jpg' },
  ],
  highlightsTitle: 'Trekking Highlights',
  highlightsSubtitle: 'Experiences woven into every trekking journey',
  highlights: [
    {
      title: 'Sacred Alpine Lakes',
      summary: 'Crystal-clear waters high in the Himalayas',
      description:
        'Glacial lakes dot the high passes of Bhutan — still, sacred and surrounded by snow peaks, where prayer flags flutter in the thin mountain air.',
      img: img('photo-1506905925346-21bda4d32df4'),
    },
    { title: 'High Mountain Passes', summary: 'Prayer flags at 5,000 m and above', img: img('photo-1483728642387-6c3bdd6c93e5') },
    { title: 'Remote Valleys', summary: 'Villages untouched by modern roads', img: img('photo-1464822759023-fed622ff2c3b') },
    { title: 'Himalayan Peaks', summary: 'Glaciers and snow-capped summits', img: img('photo-1454496522488-7a8e488e8606') },
    { title: 'Yak Herder Camps', summary: 'Traditional life on the high pastures', img: img('photo-1551632811-561732d1e306') },
  ],
}

export const culturalTours = {
  title: 'Cultural Tours of Bhutan',
  subtitle:
    'Step into a living Buddhist kingdom of fortress monasteries, sacred festivals and timeless mountain villages.',
  heroImage: '/images/tours/Paro.jpg',
  introTitle: "Discover Bhutan's Living Culture",
  introSubtitle: 'Authentic, immersive journeys guided by locals',
  introText:
    "Bhutan is one of the last places on earth where ancient traditions remain a part of everyday life. Our cultural tours take you beyond the postcard views \u2014 into majestic dzongs, candle-lit temples, bustling weekend markets and warm family homes. Travel with licensed Bhutanese guides who share the stories, rituals and flavours of the Thunder Dragon Kingdom.",
  packagesTitle: 'Cultural Tour Packages',
  packages: [
    { title: 'Glimpses of Bhutan', summary: '5 Days \u00b7 Paro & Thimphu', img: '/images/tours/Thimphu.jpg' },
    { title: 'Cultural Heart of Bhutan', summary: '8 Days \u00b7 Paro \u00b7 Thimphu \u00b7 Punakha', img: '/images/home/herobanner1.jpg' },
    { title: 'Western Bhutan Discovery', summary: '7 Days \u00b7 Dzongs, temples & valleys', img: '/images/tours/thimphu1.jpg' },
  ],
  highlightsTitle: 'Cultural Highlights',
  highlightsSubtitle: 'Experiences woven into every cultural journey',
  highlights: [
    { title: 'Majestic Dzongs', img: img('photo-1567604130959-7ea7ab2a7807') },
    { title: 'Sacred Monasteries', img: img('photo-1570366583862-f91883984fde') },
    { title: 'Vibrant Festivals', img: img('photo-1605640840605-14ac1855827b') },
    { title: 'Village & Local Life', img: img('photo-1528181304800-259b08848526') },
  ],
}

export const pilgrimageTours = {
  title: 'Pilgrimage Tours of Bhutan',
  subtitle:
    'Walk the sacred trail of Guru Rinpoche through Bhutan\u2019s holiest temples, monasteries and meditation caves.',
  heroImage: img('photo-1567604130959-7ea7ab2a7807', 1600),
  introTitle: 'Journey to the Sacred Heart of Bhutan',
  introSubtitle: 'Blessings, prayer and ancient pilgrimage sites',
  introText:
    'For centuries, devotees have travelled to Bhutan to follow in the footsteps of Guru Rinpoche, the saint who brought Buddhism to the Himalayas. Our pilgrimage journeys visit the kingdom\u2019s most sacred sites \u2014 cliffside monasteries, holy lakes and meditation caves \u2014 with time for prayer, ritual and quiet reflection alongside local monks.',
  packagesTitle: 'Pilgrimage Tour Packages',
  packages: [
    { title: 'Sacred Sites Pilgrimage', summary: '7 Days \u00b7 Holy temples & dzongs', img: img('photo-1570366583862-f91883984fde') },
    { title: 'Guru Rinpoche Trail', summary: '9 Days \u00b7 In the saint\u2019s footsteps', img: img('photo-1567604130959-7ea7ab2a7807') },
    { title: 'Bumthang Spiritual Circuit', summary: '8 Days \u00b7 The religious heartland', img: img('photo-1605640840605-14ac1855827b') },
  ],
  highlightsTitle: 'Pilgrimage Highlights',
  highlightsSubtitle: 'Sacred experiences along the way',
  highlights: [
    { title: 'Tiger\u2019s Nest Monastery', img: img('photo-1570366583862-f91883984fde') },
    { title: 'Holy Meditation Caves', img: img('photo-1528181304800-259b08848526') },
    { title: 'Prayer & Rituals', img: img('photo-1567604130959-7ea7ab2a7807') },
    { title: 'Sacred Relics', img: img('photo-1605640840605-14ac1855827b') },
  ],
}

export const birdingTours = {
  title: 'Birding Tours of Bhutan',
  subtitle:
    'Discover over 700 bird species across pristine Himalayan forests, river valleys and high passes.',
  heroImage: img('photo-1540541338287-41700207dee6', 1600),
  introTitle: 'A Birdwatcher\u2019s Himalayan Paradise',
  introSubtitle: 'Rare endemics in untouched habitats',
  introText:
    'With more than 70% forest cover and habitats ranging from subtropical jungle to alpine meadow, Bhutan is one of the world\u2019s great birding destinations. Spot the rare black-necked crane, dazzling Himalayan monal and elusive rufous-necked hornbill with expert local guides who know exactly where to find them.',
  packagesTitle: 'Birding Tour Packages',
  packages: [
    { title: 'Spring Birding Expedition', summary: '10 Days \u00b7 Peak season', img: img('photo-1540541338287-41700207dee6') },
    { title: 'Black-Necked Crane Watch', summary: '6 Days \u00b7 Phobjikha Valley', img: img('photo-1455587734955-081b22074882') },
    { title: 'Eastern Bhutan Birding', summary: '12 Days \u00b7 Endemic species', img: img('photo-1464822759023-fed622ff2c3b') },
  ],
  highlightsTitle: 'Birding Highlights',
  highlightsSubtitle: 'Feathered treasures of the Himalayas',
  highlights: [
    { title: 'Black-Necked Cranes', img: img('photo-1455587734955-081b22074882') },
    { title: 'Himalayan Monal', img: img('photo-1540541338287-41700207dee6') },
    { title: 'Rufous-Necked Hornbill', img: img('photo-1464822759023-fed622ff2c3b') },
    { title: 'Pristine Forests', img: img('photo-1483728642387-6c3bdd6c93e5') },
  ],
}

export const flyFishingTours = {
  title: 'Fly Fishing Tours of Bhutan',
  subtitle:
    'Cast for wild brown trout and golden mahseer in crystal-clear, glacier-fed Himalayan rivers.',
  heroImage: img('photo-1506905925346-21bda4d32df4', 1600),
  introTitle: 'Untouched Rivers, Wild Trout',
  introSubtitle: 'Catch-and-release angling in remote waters',
  introText:
    'Bhutan\u2019s rivers are among the least-fished on earth \u2014 cold, clear and brimming with wild brown trout. Practising strict catch-and-release, our guided fly-fishing journeys take you to pristine waters framed by forest and snow peaks, blending world-class angling with the kingdom\u2019s rich culture and warm hospitality.',
  packagesTitle: 'Fly Fishing Tour Packages',
  packages: [
    { title: 'Himalayan Trout Adventure', summary: '7 Days \u00b7 Wild brown trout', img: img('photo-1506905925346-21bda4d32df4') },
    { title: 'Mo Chhu River Fishing', summary: '5 Days \u00b7 Punakha valley', img: img('photo-1528181304800-259b08848526') },
    { title: 'Highland Lakes Fly Fishing', summary: '8 Days \u00b7 Remote alpine waters', img: img('photo-1464822759023-fed622ff2c3b') },
  ],
  highlightsTitle: 'Fly Fishing Highlights',
  highlightsSubtitle: 'What makes angling in Bhutan unique',
  highlights: [
    { title: 'Wild Brown Trout', img: img('photo-1506905925346-21bda4d32df4') },
    { title: 'Glacier-Fed Rivers', img: img('photo-1528181304800-259b08848526') },
    { title: 'Catch & Release', img: img('photo-1464822759023-fed622ff2c3b') },
    { title: 'Riverside Camps', img: img('photo-1455587734955-081b22074882') },
  ],
}

export const natureTours = {
  title: 'Nature Tours of Bhutan',
  subtitle:
    'Explore lush valleys, ancient forests and rare wildlife in the world\u2019s only carbon-negative country.',
  heroImage: img('photo-1455587734955-081b22074882', 1600),
  introTitle: 'Into Bhutan\u2019s Living Wilderness',
  introSubtitle: 'Pristine landscapes and protected wildlife',
  introText:
    'More than half of Bhutan is protected as national parks and reserves, home to takins, red pandas, snow leopards and a riot of rhododendrons. Our nature journeys follow gentle trails through glacial valleys and old-growth forest, revealing the kingdom\u2019s extraordinary biodiversity at an unhurried, soul-restoring pace.',
  packagesTitle: 'Nature Tour Packages',
  packages: [
    { title: 'Valleys & Forests Discovery', summary: '8 Days \u00b7 Scenic nature trails', img: img('photo-1455587734955-081b22074882') },
    { title: 'Phobjikha Nature Escape', summary: '5 Days \u00b7 Glacial valley', img: img('photo-1540541338287-41700207dee6') },
    { title: 'Himalayan Wilderness Tour', summary: '10 Days \u00b7 National parks', img: img('photo-1483728642387-6c3bdd6c93e5') },
  ],
  highlightsTitle: 'Nature Highlights',
  highlightsSubtitle: 'The wild beauty of the Thunder Dragon',
  highlights: [
    { title: 'Glacial Valleys', img: img('photo-1540541338287-41700207dee6') },
    { title: 'Rhododendron Forests', img: img('photo-1483728642387-6c3bdd6c93e5') },
    { title: 'Rare Wildlife', img: img('photo-1464822759023-fed622ff2c3b') },
    { title: 'National Parks', img: img('photo-1455587734955-081b22074882') },
  ],
}

export const meditationTours = {
  title: 'Meditation Tours of Bhutan',
  subtitle:
    'Find stillness and clarity in sacred monasteries and serene mountain retreats.',
  heroImage: img('photo-1570366583862-f91883984fde', 1600),
  introTitle: 'Quiet the Mind in the Last Shangri-La',
  introSubtitle: 'Guided practice in sacred surroundings',
  introText:
    'There are few better places to turn inward than Bhutan, where meditation has been practised in cliffside hermitages for over a thousand years. Guided by experienced monks and teachers, our retreats blend daily meditation, mindful walks and monastery visits with the deep peace of the Himalayas.',
  packagesTitle: 'Meditation Tour Packages',
  packages: [
    { title: 'Mindful Bhutan Retreat', summary: '7 Days \u00b7 Guided meditation', img: img('photo-1570366583862-f91883984fde') },
    { title: 'Monastery Meditation Journey', summary: '9 Days \u00b7 Stay with monks', img: img('photo-1567604130959-7ea7ab2a7807') },
    { title: 'Silent Valley Retreat', summary: '6 Days \u00b7 Deep stillness', img: img('photo-1506905925346-21bda4d32df4') },
  ],
  highlightsTitle: 'Meditation Highlights',
  highlightsSubtitle: 'Experiences to still and centre the mind',
  highlights: [
    { title: 'Guided Meditation', img: img('photo-1570366583862-f91883984fde') },
    { title: 'Monastery Stays', img: img('photo-1567604130959-7ea7ab2a7807') },
    { title: 'Mindful Walks', img: img('photo-1540541338287-41700207dee6') },
    { title: 'Spiritual Teachers', img: img('photo-1605640840605-14ac1855827b') },
  ],
}

export const yogaTours = {
  title: 'Yoga Tours of Bhutan',
  subtitle:
    'Practise yoga amid the Himalayas, balancing body, breath and breathtaking scenery.',
  heroImage: img('photo-1540541338287-41700207dee6', 1600),
  introTitle: 'Yoga in the Land of the Thunder Dragon',
  introSubtitle: 'Daily practice in pure mountain air',
  introText:
    'Roll out your mat where the air is crisp and the views go on forever. Our yoga journeys combine daily sessions \u2014 from energising morning flows to restorative evening practice \u2014 with wellness cuisine, meditation and gentle exploration of Bhutan\u2019s valleys, temples and traditions.',
  packagesTitle: 'Yoga Tour Packages',
  packages: [
    { title: 'Himalayan Yoga Retreat', summary: '7 Days \u00b7 Daily practice', img: img('photo-1540541338287-41700207dee6') },
    { title: 'Yoga & Wellness Escape', summary: '6 Days \u00b7 Spa & serenity', img: img('photo-1506905925346-21bda4d32df4') },
    { title: 'Valley Vinyasa Journey', summary: '8 Days \u00b7 Flow & explore', img: img('photo-1455587734955-081b22074882') },
  ],
  highlightsTitle: 'Yoga Highlights',
  highlightsSubtitle: 'Restore body, breath and mind',
  highlights: [
    { title: 'Daily Yoga Sessions', img: img('photo-1540541338287-41700207dee6') },
    { title: 'Himalayan Settings', img: img('photo-1483728642387-6c3bdd6c93e5') },
    { title: 'Wellness Cuisine', img: img('photo-1571536802807-30451e3955d8') },
    { title: 'Meditation & Breathwork', img: img('photo-1506905925346-21bda4d32df4') },
  ],
}

export const foodTours = {
  title: 'Food Tours of Bhutan',
  subtitle:
    'Taste the fiery, soulful flavours of Bhutan from farmhouse kitchens to vibrant weekend markets.',
  heroImage: img('photo-1571536802807-30451e3955d8', 1600),
  introTitle: 'A Taste of the Thunder Dragon',
  introSubtitle: 'Chillies, cheese and centuries of tradition',
  introText:
    'Bhutanese food is unlike anywhere else \u2014 where the chilli is a vegetable, not a spice, and every dish tells a story. Join farmhouse cooking classes, browse colourful markets, sip butter tea and ara, and feast on ema datshi, red rice and buckwheat noodles straight from the source.',
  packagesTitle: 'Food Tour Packages',
  packages: [
    { title: 'Flavours of Bhutan', summary: '6 Days \u00b7 Tastings & markets', img: img('photo-1571536802807-30451e3955d8') },
    { title: 'Farm to Table Journey', summary: '7 Days \u00b7 Cooking classes', img: img('photo-1605640840605-14ac1855827b') },
    { title: 'Bhutanese Culinary Trail', summary: '8 Days \u00b7 Across the valleys', img: img('photo-1528181304800-259b08848526') },
  ],
  highlightsTitle: 'Food Highlights',
  highlightsSubtitle: 'Flavours you\u2019ll savour long after',
  highlights: [
    { title: 'Ema Datshi & Chilli', img: img('photo-1571536802807-30451e3955d8') },
    { title: 'Farmhouse Cooking', img: img('photo-1605640840605-14ac1855827b') },
    { title: 'Local Markets', img: img('photo-1528181304800-259b08848526') },
    { title: 'Red Rice & Buckwheat', img: img('photo-1567604130959-7ea7ab2a7807') },
  ],
}

export const bikingTours = {
  title: 'Biking Tours of Bhutan',
  subtitle:
    'Pedal through prayer-flag passes, forest singletrack and timeless mountain villages.',
  heroImage: img('photo-1464822759023-fed622ff2c3b', 1600),
  introTitle: 'Explore Bhutan on Two Wheels',
  introSubtitle: 'Road and mountain riding for every level',
  introText:
    'Bhutan\u2019s quiet roads and forest trails make it a dream for cyclists. Climb to prayer-flag passes, swoop through pine forest and roll between dzongs and villages, with a support vehicle carrying your gear so you can ride as much \u2014 or as little \u2014 as you like.',
  packagesTitle: 'Biking Tour Packages',
  packages: [
    { title: 'Western Valleys Cycling', summary: '7 Days \u00b7 Road & trail', img: img('photo-1464822759023-fed622ff2c3b') },
    { title: 'Dochula Mountain Biking', summary: '6 Days \u00b7 Forest singletrack', img: img('photo-1519681393784-d120267933ba') },
    { title: 'Central Bhutan Bike Tour', summary: '9 Days \u00b7 Pass to pass', img: img('photo-1540541338287-41700207dee6') },
  ],
  highlightsTitle: 'Biking Highlights',
  highlightsSubtitle: 'Ride the kingdom\u2019s best routes',
  highlights: [
    { title: 'High Mountain Passes', img: img('photo-1483728642387-6c3bdd6c93e5') },
    { title: 'Forest Singletrack', img: img('photo-1519681393784-d120267933ba') },
    { title: 'Village Trails', img: img('photo-1464822759023-fed622ff2c3b') },
    { title: 'Full Support Crew', img: img('photo-1540541338287-41700207dee6') },
  ],
}

export const motorcycleTours = {
  title: 'Motorcycle Tours of Bhutan',
  subtitle:
    'Ride the legendary Himalayan highways and high passes of the Thunder Dragon Kingdom.',
  heroImage: img('photo-1519681393784-d120267933ba', 1600),
  introTitle: 'The Ultimate Himalayan Ride',
  introSubtitle: 'Epic passes, winding roads and big skies',
  introText:
    'Fire up the engine for the ride of a lifetime. Bhutan\u2019s winding mountain highways climb over prayer-flag passes and plunge into deep valleys, linking ancient dzongs and remote villages. Riding well-maintained motorcycles with a full support vehicle and expert lead riders, you\u2019ll experience the Himalayas like never before.',
  packagesTitle: 'Motorcycle Tour Packages',
  packages: [
    { title: 'Thunder Dragon Ride', summary: '9 Days \u00b7 Western highlights', img: img('photo-1519681393784-d120267933ba') },
    { title: 'Himalayan Passes Motorcycle Tour', summary: '11 Days \u00b7 High passes', img: img('photo-1483728642387-6c3bdd6c93e5') },
    { title: 'East-West Motorcycle Expedition', summary: '14 Days \u00b7 Coast to coast', img: img('photo-1454496522488-7a8e488e8606') },
  ],
  highlightsTitle: 'Motorcycle Highlights',
  highlightsSubtitle: 'Why riders love Bhutan',
  highlights: [
    { title: 'Epic Mountain Passes', img: img('photo-1483728642387-6c3bdd6c93e5') },
    { title: 'Winding Highways', img: img('photo-1519681393784-d120267933ba') },
    { title: 'Remote Villages', img: img('photo-1464822759023-fed622ff2c3b') },
    { title: 'Full Support Vehicle', img: img('photo-1454496522488-7a8e488e8606') },
  ],
}
