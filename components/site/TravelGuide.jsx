'use client'

import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Accordion } from 'react-bootstrap'
import { api } from '@/lib/api/client'
import PageLoading from '@/components/site/PageLoading'
import { resolveImageUrl } from '@/lib/utils/imageUrl'
import { mergePageHero } from '@/lib/utils/cmsMerge'

const img = (id, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const fallback = {
  hero: {
    title: 'Your Guide to Bhutan',
    subtitle:
      'Everything you need to know before you travel to the Land of the Thunder Dragon — visas, seasons, packing and more.',
    image: img('photo-1483728642387-6c3bdd6c93e5'),
  },
  about: {
    title: 'About Bhutan',
    subtitle: 'The last great Himalayan kingdom — and proud of it',
    paragraphs: [
      'Wedged between India and Tibet, high in the eastern Himalayas, Bhutan is the kind of place that sounds made up: a kingdom that measures success in Gross National Happiness, where television only arrived in 1999 and traffic jams are caused by the odd herd of yaks. This is the only carbon-negative country on Earth — it absorbs more CO₂ than it produces — wrapped in more than 70% forest and crowned by peaks that have never been climbed (and, by royal decree, never will be).',
      'Expect cliff-hugging monasteries, fortress-like dzongs, chilli that counts as a vegetable rather than a spice, and locals who will out-smile you every single time. Bhutan keeps tourism deliberately “high-value, low-impact,” so it never feels crowded and your visit genuinely helps fund free healthcare, free education and all that pristine forest. In short: ancient, a little magical, refreshingly unhurried — and unlike anywhere else you’ll ever go.',
    ],
    facts: [
      { label: 'Capital', value: 'Thimphu' },
      { label: 'Currency', value: 'Ngultrum (BTN)' },
      { label: 'Language', value: 'Dzongkha' },
      { label: 'Time Zone', value: 'GMT +6' },
    ],
  },
  visaSdf: {
    title: 'Visa & SDF',
    subtitle: 'Entry requirements made simple',
    cards: [
      { title: 'Visa', body: 'All visitors (except India, Bangladesh and the Maldives) need a visa, which we arrange for you once your tour is confirmed. Your passport must be valid for at least six months.' },
      { title: 'Sustainable Development Fee', body: 'A daily SDF of USD 100 per adult per night funds free healthcare, education and conservation. Children receive discounts and under-6s are exempt.' },
      { title: "What's Included", body: 'Our packages bundle the SDF, hotels, meals, a licensed guide and private transport — so there are no hidden surprises once you arrive.' },
    ],
  },
  seasons: {
    title: 'Best Time to Visit',
    subtitle: "Bhutan is beautiful year-round — here's what each season offers",
    items: [
      { name: 'Spring', months: 'Mar – May', desc: 'Blooming rhododendrons, clear skies and the famous Paro Tshechu. One of the best times to visit.', image: img('photo-1464822759023-fed622ff2c3b', 800) },
      { name: 'Summer', months: 'Jun – Aug', desc: 'Warm, green and lush with occasional monsoon rain. Fewer crowds and vivid landscapes.', image: img('photo-1540541338287-41700207dee6', 800) },
      { name: 'Autumn', months: 'Sep – Nov', desc: 'Crisp, clear weather with the best Himalayan views and the major Thimphu & Punakha festivals. Peak season.', image: img('photo-1483728642387-6c3bdd6c93e5', 800) },
      { name: 'Winter', months: 'Dec – Feb', desc: 'Cold but sunny days, snow on the peaks and black-necked cranes in Phobjikha. Quiet and atmospheric.', image: img('photo-1506905925346-21bda4d32df4', 800) },
    ],
  },
  trekking: {
    title: 'Trekking Guide',
    subtitle: "Get the most out of Bhutan's mountain trails",
    tips: [
      'Acclimatise gradually — build in rest days on high-altitude treks.',
      'Stay hydrated and walk at a steady, comfortable pace.',
      'Pack for all four seasons; mountain weather changes fast.',
      'Train with hikes and cardio in the months before your trip.',
      'Trust your licensed guide and camping crew — they handle the logistics.',
      'Respect the environment: carry out all waste and stay on the trail.',
    ],
  },
  packing: {
    title: 'Packing List',
    subtitle: 'The essentials to bring for your Bhutan journey',
    items: [
      'Layered clothing for changing mountain weather',
      'Warm jacket, fleece and thermal base layers',
      'Comfortable, broken-in walking or trekking shoes',
      'Rain jacket or poncho',
      'Sun hat, sunglasses and high-SPF sunscreen',
      'Refillable water bottle and personal medications',
      'Modest clothing for visiting temples and dzongs',
      'Power adapter (Type D/F/G) and power bank',
      'Small daypack for hikes and excursions',
      'Camera, plus cash in Ngultrum for small purchases',
    ],
  },
  faqs: {
    title: 'Frequently Asked Questions',
    subtitle: 'Quick answers to the most common questions',
    items: [
      { q: 'Do I need a visa to visit Bhutan?', a: 'Yes. Apart from citizens of India, Bangladesh and the Maldives, all visitors need a visa, which we arrange for you once your trip is confirmed. You will also need a passport valid for at least six months.' },
      { q: 'What is the Sustainable Development Fee (SDF)?', a: 'Bhutan charges a daily Sustainable Development Fee of USD 100 per adult per night. This funds free healthcare, education and environmental conservation, and is part of Bhutan’s “high-value, low-impact” tourism policy.' },
      { q: 'Is Bhutan safe for travellers?', a: 'Bhutan is widely regarded as one of the safest countries in the world, with very low crime and warm, welcoming people. You will always travel with a licensed local guide.' },
      { q: 'How do I get to Bhutan?', a: 'Most visitors fly into Paro International Airport with Drukair or Bhutan Airlines, with connections from hubs such as Delhi, Kolkata, Bangkok, Singapore, Kathmandu and Dhaka. You can also enter overland via Phuentsholing.' },
      { q: 'What currency is used and can I pay by card?', a: 'The local currency is the Ngultrum (BTN), pegged to the Indian Rupee. Larger hotels and shops in towns accept cards, but carry some cash for markets, tips and rural areas.' },
      { q: 'What should I wear when visiting temples and dzongs?', a: 'Dress modestly — cover your shoulders and knees, and remove hats and shoes before entering temples. Long trousers and sleeved tops are recommended for visiting religious sites.' },
    ],
  },
}

const pick = (apiVal, fallbackVal) => {
  if (Array.isArray(apiVal)) return apiVal.length ? apiVal : fallbackVal
  if (typeof apiVal === 'string') return apiVal.trim() ? apiVal : fallbackVal
  return apiVal ?? fallbackVal
}

function mergeGuide(apiData) {
  if (!apiData) return fallback
  return {
    hero: {
      title: pick(apiData.hero?.title, fallback.hero.title),
      subtitle: pick(apiData.hero?.subtitle, fallback.hero.subtitle),
      image: pick(apiData.hero?.image, fallback.hero.image),
    },
    about: {
      title: pick(apiData.about?.title, fallback.about.title),
      subtitle: pick(apiData.about?.subtitle, fallback.about.subtitle),
      paragraphs: pick(apiData.about?.paragraphs, fallback.about.paragraphs),
      facts: pick(apiData.about?.facts, fallback.about.facts),
    },
    visaSdf: {
      title: pick(apiData.visaSdf?.title, fallback.visaSdf.title),
      subtitle: pick(apiData.visaSdf?.subtitle, fallback.visaSdf.subtitle),
      cards: pick(apiData.visaSdf?.cards, fallback.visaSdf.cards),
    },
    seasons: {
      title: pick(apiData.seasons?.title, fallback.seasons.title),
      subtitle: pick(apiData.seasons?.subtitle, fallback.seasons.subtitle),
      items: (apiData.seasons?.items?.length ? apiData.seasons.items : fallback.seasons.items).map((s, i) => ({
        name: s.name || fallback.seasons.items[i]?.name,
        months: s.months || fallback.seasons.items[i]?.months,
        desc: s.desc || fallback.seasons.items[i]?.desc,
        image: s.image || fallback.seasons.items[i]?.image,
      })),
    },
    trekking: {
      title: pick(apiData.trekking?.title, fallback.trekking.title),
      subtitle: pick(apiData.trekking?.subtitle, fallback.trekking.subtitle),
      tips: pick(apiData.trekking?.tips, fallback.trekking.tips),
    },
    packing: {
      title: pick(apiData.packing?.title, fallback.packing.title),
      subtitle: pick(apiData.packing?.subtitle, fallback.packing.subtitle),
      items: pick(apiData.packing?.items, fallback.packing.items),
    },
    faqs: {
      title: pick(apiData.faqs?.title, fallback.faqs.title),
      subtitle: pick(apiData.faqs?.subtitle, fallback.faqs.subtitle),
      items: pick(apiData.faqs?.items, fallback.faqs.items),
    },
  }
}

function TravelGuide() {
  const [guide, setGuide] = useState(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([api.getTravelGuide(), api.getHeroBanners()])
      .then(([guideRes, bannersRes]) => {
        if (!active) return
        const merged = guideRes?.data ? mergeGuide(guideRes.data) : fallback
        const bannerHero = bannersRes?.data?.travelGuidePage
        if (bannerHero) {
          merged.hero = mergePageHero(bannerHero, {
            eyebrow: 'Travel Guide',
            title: merged.hero.title,
            subtitle: merged.hero.subtitle,
            image: merged.hero.image,
            ctaText: 'Start Reading',
            ctaLink: '#about-bhutan',
          })
        }
        setGuide(merged)
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
    return <PageLoading label="Loading travel guide…" />
  }

  return (
    <>
      <section className="page-hero" style={{ backgroundImage: `url(${resolveImageUrl(guide.hero.image)})` }}>
        <div className="page-hero__scrim" />
        <Container className="page-hero__inner text-center text-white">
          {guide.hero.eyebrow ? <p className="eyebrow text-white-50 mb-2">{guide.hero.eyebrow}</p> : null}
          <h1>{guide.hero.title}</h1>
          <p className="page-hero__sub">{guide.hero.subtitle}</p>
        </Container>
      </section>

      <section className="section-pad" id="about-bhutan">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={9}>
              <div className="section-title reveal reveal--fade-up">
                <h2>{guide.about.title}</h2>
                <p>{guide.about.subtitle}</p>
              </div>
              {guide.about.paragraphs.map((p, i) => (
                <p className="text-muted" key={i}>{p}</p>
              ))}
              <Row className="g-3 justify-content-center mt-2">
                {guide.about.facts.map((f) => (
                  <Col xs={6} md="auto" key={f.label}>
                    <div className="fact-pill">
                      <span className="fact-pill__label">{f.label}</span>
                      <span className="fact-pill__value">{f.value}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-pad bg-light" id="visa-sdf">
        <Container>
          <div className="section-title reveal reveal--fade-up">
            <h2>{guide.visaSdf.title}</h2>
            <p>{guide.visaSdf.subtitle}</p>
          </div>
          <Row className="g-4 justify-content-center">
            {guide.visaSdf.cards.map((c) => (
              <Col md={6} lg={4} key={c.title}>
                <div className="place-card h-100">
                  <div className="place-card__body">
                    <h3>{c.title}</h3>
                    <p className="text-muted m-0">{c.body}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section-pad" id="best-time-to-visit">
        <Container>
          <div className="section-title reveal reveal--fade-up">
            <h2>{guide.seasons.title}</h2>
            <p>{guide.seasons.subtitle}</p>
          </div>
          <Row className="g-4 justify-content-center">
            {guide.seasons.items.map((s) => (
              <Col md={6} lg={3} key={s.name}>
                <article className="place-card h-100">
                  <div className="place-card__img" style={{ backgroundImage: `url(${resolveImageUrl(s.image)})` }} />
                  <div className="place-card__body">
                    <h3>
                      {s.name} <span className="text-muted fs-6">· {s.months}</span>
                    </h3>
                    <p className="text-muted m-0">{s.desc}</p>
                  </div>
                </article>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section-pad bg-light" id="trekking-guide">
        <Container>
          <div className="section-title reveal reveal--fade-up">
            <h2>{guide.trekking.title}</h2>
            <p>{guide.trekking.subtitle}</p>
          </div>
          <Row className="g-3 justify-content-center">
            {guide.trekking.tips.map((tip) => (
              <Col md={6} lg={5} key={tip}>
                <div className="highlight-item">
                  <span className="highlight-item__check" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{tip}</span>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section-pad" id="packing-list">
        <Container>
          <div className="section-title reveal reveal--fade-up">
            <h2>{guide.packing.title}</h2>
            <p>{guide.packing.subtitle}</p>
          </div>
          <Row className="g-3 justify-content-center">
            {guide.packing.items.map((item) => (
              <Col md={6} lg={5} key={item}>
                <div className="highlight-item">
                  <span className="highlight-item__check" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section-pad bg-light" id="faqs">
        <Container>
          <div className="section-title reveal reveal--fade-up">
            <h2>{guide.faqs.title}</h2>
            <p>{guide.faqs.subtitle}</p>
          </div>
          <Row className="justify-content-center">
            <Col lg={9}>
              <Accordion defaultActiveKey="0" className="guide-faq">
                {guide.faqs.items.map((item, i) => (
                  <Accordion.Item eventKey={String(i)} key={item.q}>
                    <Accordion.Header>{item.q}</Accordion.Header>
                    <Accordion.Body className="text-muted">{item.a}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>

          <div className="text-center mt-5">
            <Button className="btn-cta px-4 py-2" href="/contact">
              Still have questions? Contact us
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}

export default TravelGuide
