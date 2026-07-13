'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Container } from 'react-bootstrap'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'
import { mergeHomeHero } from '@/lib/utils/cmsMerge'
import PageLoading from '@/components/site/PageLoading'

const fallback = {
  eyebrow: 'Discover · The Last Shangri-La',
  slides: [
    {
      headline: 'Every Trail Tells a Story',
      subheading:
        'From sacred temples to remote mountain passes, discover the beauty, culture, and spirit of Bhutan.',
      image: '',
    },
    {
      headline: 'Experience Bhutan Like Never Before',
      subheading:
        'Curated journeys through the Last Himalayan Kingdom, combining adventure, culture, and comfort in one extraordinary experience.',
      image: '',
    },
    {
      headline: 'Discover Bhutan, One Journey at a Time',
      subheading:
        'Explore breathtaking landscapes, ancient traditions, and unforgettable trekking adventures across the Last Himalayan Kingdom.',
      image: '',
    },
  ],
}

function Hero() {
  const [home, setHome] = useState(null)
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)

  useEffect(() => {
    let activeReq = true
    api
      .getHeroBanners()
      .then((res) => {
        if (!activeReq) return
        if (res?.data?.home) {
          setHome(mergeHomeHero(res.data.home, fallback))
        } else {
          setHome(fallback)
        }
      })
      .catch(() => {
        if (activeReq) setHome(fallback)
      })
      .finally(() => {
        if (activeReq) setLoading(false)
      })
    return () => {
      activeReq = false
    }
  }, [])

  const slides = home?.slides?.length ? home.slides : fallback.slides
  const count = slides.length

  useEffect(() => {
    if (count <= 1) return undefined

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) return undefined

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % count)
    }, 5000)

    return () => clearInterval(timer)
  }, [count])

  useEffect(() => {
    if (active >= count) setActive(0)
  }, [active, count])

  if (loading || !home) {
    return (
      <section className="hero d-flex align-items-center justify-content-center" id="home" style={{ minHeight: '70vh' }}>
        <PageLoading label="Loading hero…" minHeight="70vh" variant="light" />
      </section>
    )
  }

  const current = slides[active] || slides[0]

  return (
    <section className="hero" id="home" aria-roledescription="carousel" aria-label="Featured journeys">
      {slides.map((s, i) => {
        const imageUrl = resolveImageUrl(s.image)
        if (!imageUrl) return null
        return (
          <div
            key={`${s.headline}-${i}-${imageUrl}`}
            className={`hero__bg ${i === active ? 'is-active' : ''}`}
            style={{ backgroundImage: `url(${imageUrl})` }}
            aria-hidden={i !== active}
          />
        )
      })}
      <div className="hero__scrim" />

      <Container className="hero__inner">
        <div key={active} className="hero__caption hero__caption--animate" aria-live="polite" aria-atomic="true">
          <p className="eyebrow text-white-50 mb-2">{home.eyebrow}</p>
          <h1>{current.headline}</h1>
          <p className="hero__sub">{current.subheading}</p>
          <Link href="/plan-my-trip" className="hero__explore">
            Plan My Trip
          </Link>
        </div>

        <div className="hero__dots" role="tablist" aria-label="Choose a slide">
          {slides.map((s, i) => (
            <button
              key={`dot-${s.headline}-${i}`}
              className={`hero__dot ${i === active ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1} of ${count}`}
              aria-selected={i === active}
              role="tab"
              type="button"
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Hero
