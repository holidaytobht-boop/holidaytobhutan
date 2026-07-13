'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Container, Row, Col, Button } from 'react-bootstrap'
import PageLoading from '@/components/site/PageLoading'
import { api } from '@/lib/api/client'
import { resolveImageUrl } from '@/lib/utils/imageUrl'
import { mergePageHero } from '@/lib/utils/cmsMerge'

const fallback = {
  hero: {
    eyebrow: 'Who We Are',
    title: 'About Holiday to Bhutan',
    subtitle: 'A local team crafting authentic, responsible journeys through the Last Himalayan Kingdom.',
    image: '',
  },
  story: {
    title: 'Our Story',
    image: '',
    paragraphs: [
      'Holiday to Bhutan was born from a simple belief — that travel should be meaningful, personal and rooted in respect for the places we visit. Founded by Bhutanese guides who grew up in these valleys, we set out to share the kingdom we love with the world.',
      "For over a decade we have designed tailor-made cultural tours and Himalayan treks for travellers from every corner of the globe. From the cliffs of Tiger's Nest to the remote passes of the Snowman Trek, every journey is guided with care, local knowledge and genuine warmth.",
    ],
  },
  missionVision: {
    mission: {
      title: 'Our Mission',
      text: 'To deliver authentic, immersive and responsible travel experiences that connect our guests with the culture, nature and spirit of Bhutan — while supporting local communities and preserving our heritage.',
    },
    vision: {
      title: 'Our Vision',
      text: 'To be Bhutan\'s most trusted travel companion, known worldwide for meaningful journeys that honour the kingdom\'s "High Value, Low Impact" philosophy for generations to come.',
    },
  },
  offers: {
    title: 'What We Offer',
    subtitle: 'Everything you need for an unforgettable Bhutan experience',
    items: [
      { title: 'Cultural Tours', text: 'Temples, dzongs, markets and everyday life with expert local guides.' },
      { title: 'Trekking Expeditions', text: 'From gentle valley walks to the legendary high-altitude Snowman Trek.' },
      { title: 'Festival Journeys', text: 'Witness vibrant Tshechus, mask dances and sacred celebrations.' },
      { title: 'Tailor-Made Trips', text: 'Every itinerary built around your pace, interests and budget.' },
      { title: 'Luxury Stays', text: 'Handpicked boutique lodges and five-star Himalayan retreats.' },
      { title: 'Expert Local Guides', text: 'Licensed Bhutanese guides who bring every story to life.' },
    ],
  },
  whyChooseUs: {
    title: 'Why Choose Us',
    subtitle: 'What sets a journey with us apart',
    items: [
      '100% tailor-made, private itineraries',
      'Born-and-raised Bhutanese expert guides',
      'Responsible, sustainable travel practices',
      'Transparent pricing with no hidden costs',
      'On-the-ground support, available 24/7',
      'Thousands of happy travellers worldwide',
    ],
  },
  team: {
    title: 'Meet the Team',
    subtitle: 'The passionate people behind your journey',
    members: [
      { name: 'Karma Jigyel', role: 'Founder & CEO', avatar: '' },
      { name: 'Phuntsho Choden', role: 'Co-Founder', avatar: '' },
      { name: 'Karma Selden', role: 'General Manager', avatar: '' },
      { name: 'Samten Dema', role: 'Reservation Officer', avatar: '' },
      { name: 'Rigzang Lham', role: 'Accountant', avatar: '' },
    ],
  },
  values: {
    title: 'Our Values',
    subtitle: 'The principles that guide everything we do',
    items: [
      { title: 'Authenticity', text: 'Real culture, real people, real moments — never staged.' },
      { title: 'Sustainability', text: 'Protecting Bhutan\'s environment and traditions for the future.' },
      { title: 'Community', text: 'Supporting local families, artisans and communities we visit.' },
      { title: 'Excellence', text: 'Thoughtful details and seamless service on every journey.' },
    ],
  },
  cta: {
    eyebrow: 'Ready when you are',
    title: "Let's Plan Your Bhutan Journey",
    subtitle: 'Tell us your travel dreams and our team will craft a tailor-made itinerary just for you.',
    whatsappUrl: 'https://wa.me/97577992233?text=Hi%20Holiday%20to%20Bhutan%2C%20I%27d%20like%20to%20plan%20a%20trip.',
  },
}

const pick = (apiVal, fallbackVal) => {
  if (Array.isArray(apiVal)) return apiVal.length ? apiVal : fallbackVal
  if (typeof apiVal === 'string') return apiVal.trim() ? apiVal : fallbackVal
  return apiVal ?? fallbackVal
}

const mergePage = (apiData) => {
  if (!apiData) return fallback
  return {
    hero: {
      eyebrow: pick(apiData.hero?.eyebrow, fallback.hero.eyebrow),
      title: pick(apiData.hero?.title, fallback.hero.title),
      subtitle: pick(apiData.hero?.subtitle, fallback.hero.subtitle),
      image: apiData.hero?.image?.trim() || '',
    },
    story: {
      title: pick(apiData.story?.title, fallback.story.title),
      image: apiData.story?.image?.trim() || '',
      paragraphs: pick(apiData.story?.paragraphs, fallback.story.paragraphs),
    },
    missionVision: {
      mission: {
        title: pick(apiData.missionVision?.mission?.title, fallback.missionVision.mission.title),
        text: pick(apiData.missionVision?.mission?.text, fallback.missionVision.mission.text),
      },
      vision: {
        title: pick(apiData.missionVision?.vision?.title, fallback.missionVision.vision.title),
        text: pick(apiData.missionVision?.vision?.text, fallback.missionVision.vision.text),
      },
    },
    offers: {
      title: pick(apiData.offers?.title, fallback.offers.title),
      subtitle: pick(apiData.offers?.subtitle, fallback.offers.subtitle),
      items: pick(apiData.offers?.items, fallback.offers.items),
    },
    whyChooseUs: {
      title: pick(apiData.whyChooseUs?.title, fallback.whyChooseUs.title),
      subtitle: pick(apiData.whyChooseUs?.subtitle, fallback.whyChooseUs.subtitle),
      items: pick(apiData.whyChooseUs?.items, fallback.whyChooseUs.items),
    },
    team: {
      title: pick(apiData.team?.title, fallback.team.title),
      subtitle: pick(apiData.team?.subtitle, fallback.team.subtitle),
      members: (apiData.team?.members || [])
        .filter((member) => member?.name?.trim())
        .map((member) => ({
          name: member.name.trim(),
          role: member.role?.trim() || '',
          avatar: member.avatar?.trim() || '',
        })),
    },
    values: {
      title: pick(apiData.values?.title, fallback.values.title),
      subtitle: pick(apiData.values?.subtitle, fallback.values.subtitle),
      items: pick(apiData.values?.items, fallback.values.items),
    },
    cta: {
      eyebrow: pick(apiData.cta?.eyebrow, fallback.cta.eyebrow),
      title: pick(apiData.cta?.title, fallback.cta.title),
      subtitle: pick(apiData.cta?.subtitle, fallback.cta.subtitle),
      whatsappUrl: pick(apiData.cta?.whatsappUrl, fallback.cta.whatsappUrl),
    },
  }
}

const offerIcons = [
  <path key="0" d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />,
  <path key="1" d="M3 20h18L14 6l-3 6-2-3-6 11z" />,
  <path key="2" d="M12 2l2.4 7.4H22l-6 4.3 2.3 7.3L12 16.7 5.7 21l2.3-7.3-6-4.3h7.6z" />,
  <><path key="3a" d="M3 7h18M3 12h18M3 17h12" /></>,
  <path key="4" d="M3 21V9l9-6 9 6v12H3zM9 21v-6h6v6" />,
  <><circle key="5a" cx="12" cy="8" r="4" /><path key="5b" d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
]

function Icon({ d }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

const TEAM_AUTO_PLAY_MS = 4000

function getTeamCardsPerView(width) {
  if (width < 576) return 1
  if (width < 768) return 2
  if (width < 992) return 3
  return 4
}

function TeamCarousel({ members }) {
  const [startIndex, setStartIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(4)
  const [paused, setPaused] = useState(false)
  const [enableTransition, setEnableTransition] = useState(true)

  const updateCardsPerView = useCallback(() => {
    setCardsPerView(getTeamCardsPerView(window.innerWidth))
  }, [])

  useEffect(() => {
    updateCardsPerView()
    window.addEventListener('resize', updateCardsPerView)
    return () => window.removeEventListener('resize', updateCardsPerView)
  }, [updateCardsPerView])

  const displayMembers = [...members, ...members]

  useEffect(() => {
    if (paused || members.length <= 1) return undefined

    const id = window.setInterval(() => {
      setStartIndex((prev) => prev + 1)
    }, TEAM_AUTO_PLAY_MS)

    return () => window.clearInterval(id)
  }, [paused, members.length])

  useEffect(() => {
    if (startIndex !== members.length) return undefined

    const timeout = window.setTimeout(() => {
      setEnableTransition(false)
      setStartIndex(0)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setEnableTransition(true))
      })
    }, 650)

    return () => window.clearTimeout(timeout)
  }, [startIndex, members.length])

  const slideOffset = startIndex * (100 / cardsPerView)

  return (
    <div
      className="team-carousel reveal reveal--fade-up"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="team-carousel__viewport">
        <div
          className="team-carousel__track"
          style={{
            transform: `translateX(-${slideOffset}%)`,
            transition: enableTransition ? undefined : 'none',
          }}
        >
          {displayMembers.map((m, i) => (
            <div
              key={`${m.name}-${i}`}
              className="team-carousel__slide"
              style={{ flexBasis: `${100 / cardsPerView}%` }}
            >
              <div className="team-card glass h-100">
                <span
                  className="team-card__avatar"
                  style={m.avatar ? { backgroundImage: `url(${resolveImageUrl(m.avatar)})` } : undefined}
                >
                  {!m.avatar ? (m.name?.charAt(0) || '?') : null}
                </span>
                <h5 className="fw-bold mb-1">{m.name}</h5>
                <p className="text-muted mb-0">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function About() {
  const [page, setPage] = useState(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([api.getAboutPage(), api.getHeroBanners()])
      .then(([aboutRes, bannersRes]) => {
        if (!active) return
        const merged = aboutRes?.data ? mergePage(aboutRes.data) : fallback
        const bannerHero = bannersRes?.data?.aboutPage
        if (bannerHero) {
          merged.hero = mergePageHero(bannerHero, merged.hero)
        }
        setPage(merged)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <PageLoading label="Loading about page…" />
  }

  return (
    <>
      <section
        className="about-hero"
        style={page.hero.image ? { backgroundImage: `url(${resolveImageUrl(page.hero.image)})` } : undefined}
      >
        <div className="about-hero__scrim" />
        <Container className="about-hero__inner text-center text-white">
          <p className="eyebrow text-white-50 mb-2">{page.hero.eyebrow}</p>
          <h1>{page.hero.title}</h1>
          <p className="about-hero__sub">{page.hero.subtitle}</p>
        </Container>
      </section>

      <section className="section-pad" id="our-story">
        <Container>
          <Row className="g-5 align-items-center">
            <Col lg={6}>
              {page.story.image ? (
                <img className="about-story__img reveal reveal--fade-left" src={resolveImageUrl(page.story.image)} alt={page.story.title} />
              ) : null}
            </Col>
            <Col lg={6}>
              <div className="section-title text-start mb-3 reveal reveal--fade-right">
                <h2 className="m-0">{page.story.title}</h2>
              </div>
              {page.story.paragraphs.map((p, i) => (
                <p className="text-muted" key={i}>{p}</p>
              ))}
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-pad bg-light">
        <Container>
          <Row className="g-4">
            <Col md={6}>
              <div className="mv-card glass h-100 reveal reveal--fade-right">
                <h3>{page.missionVision.mission.title}</h3>
                <p>{page.missionVision.mission.text}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mv-card glass h-100 reveal reveal--fade-left">
                <h3>{page.missionVision.vision.title}</h3>
                <p>{page.missionVision.vision.text}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-pad">
        <Container>
          <div className="section-title reveal reveal--fade-up">
            <h2>{page.offers.title}</h2>
            <p>{page.offers.subtitle}</p>
          </div>
          <Row className="g-4">
            {page.offers.items.map((o, i) => (
              <Col sm={6} lg={4} key={o.title}>
                <div className="offer-card glass h-100 reveal reveal--fade-up" style={{ '--reveal-delay': `${(i % 3) * 80}ms` }}>
                  <span className="offer-card__icon">
                    <Icon d={offerIcons[i % offerIcons.length]} />
                  </span>
                  <h5 className="fw-bold">{o.title}</h5>
                  <p className="text-muted mb-0">{o.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section-pad why">
        <Container>
          <div className="section-title reveal reveal--fade-up">
            <h2>{page.whyChooseUs.title}</h2>
            <p>{page.whyChooseUs.subtitle}</p>
          </div>
          <Row className="g-4">
            {page.whyChooseUs.items.map((r, i) => (
              <Col md={6} lg={4} key={r}>
                <div className="reason-row reveal reveal--fade-up" style={{ '--reveal-delay': `${(i % 3) * 70}ms` }}>
                  <span className="reason-row__check"><Check /></span>
                  <span>{r}</span>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section-pad bg-light">
        <Container>
          <div className="section-title reveal reveal--fade-up">
            <h2>{page.team.title}</h2>
            <p>{page.team.subtitle}</p>
          </div>
          <TeamCarousel members={page.team.members} />
        </Container>
      </section>

      <section className="section-pad">
        <Container>
          <div className="section-title reveal reveal--fade-up">
            <h2>{page.values.title}</h2>
            <p>{page.values.subtitle}</p>
          </div>
          <Row className="g-4">
            {page.values.items.map((v, i) => (
              <Col sm={6} lg={3} key={v.title}>
                <div className="value-card glass h-100 reveal reveal--fade-up" style={{ '--reveal-delay': `${i * 80}ms` }}>
                  <span className="value-card__num">{String(i + 1).padStart(2, '0')}</span>
                  <h5 className="fw-bold">{v.title}</h5>
                  <p className="text-muted mb-0">{v.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section-pad contact text-center" id="contact">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <p className="eyebrow text-white-50 mb-2">{page.cta.eyebrow}</p>
              <h2 className="fw-bold mb-3">{page.cta.title}</h2>
              <p className="opacity-75 mb-4">{page.cta.subtitle}</p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button className="btn-cta px-4 py-2" as={Link} href="/plan-my-trip">
                  Plan My Trip
                </Button>
                {page.cta.whatsappUrl && (
                  <Button
                    className="btn-whatsapp px-4 py-2 d-inline-flex align-items-center gap-2"
                    href={page.cta.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Connect on WhatsApp
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default About
