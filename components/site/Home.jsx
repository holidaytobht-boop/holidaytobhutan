'use client'

import Hero from '@/components/site/Hero'
import FeaturedTours from '@/components/site/FeaturedTours'
import PopularTreks from '@/components/site/PopularTreks'
import TopDestinations from '@/components/site/TopDestinations'
import WhyTravelWithUs from '@/components/site/WhyTravelWithUs'
import PhotoGallery from '@/components/site/PhotoGallery'
import TravelerReviews from '@/components/site/TravelerReviews'
import ContactBook from '@/components/site/ContactBook'

function Home() {
  return (
    <>
      <Hero />
      <TravelerReviews />
      <FeaturedTours />
      <PopularTreks />
      <TopDestinations />
      <WhyTravelWithUs />
      <PhotoGallery />
      <ContactBook />
    </>
  )
}

export default Home
