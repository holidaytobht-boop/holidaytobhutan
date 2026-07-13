'use client'

import { Container, Row, Col } from 'react-bootstrap'

function Icon({ path }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  )
}

const reasons = [
  {
    title: 'Local Expert Guides',
    text: 'Licensed Bhutanese guides who bring every dzong, trail and tradition to life.',
    icon: <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 22l2-7L2 9h7z" />,
  },
  {
    title: 'Tailor-Made Trips',
    text: 'Every itinerary is built around your pace, interests and budget — never off the shelf.',
    icon: <><path d="M3 7h18" /><path d="M3 12h18" /><path d="M3 17h12" /></>,
  },
  {
    title: 'Responsible Travel',
    text: 'We follow Bhutan’s High Value, Low Impact philosophy to protect culture and nature.',
    icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
  },
  {
    title: '24/7 Support',
    text: 'Round-the-clock assistance before, during and after your journey across Bhutan.',
    icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  },
]

function WhyTravelWithUs() {
  return (
    <section className="section-pad why" id="our-story">
      <Container>
        <div className="section-title reveal reveal--fade-up">
          <h2>Why Travel With Us</h2>
          <p>Thousands of happy travellers have explored Bhutan with our team</p>
        </div>
        <Row className="g-4">
          {reasons.map((r, i) => (
            <Col sm={6} lg={3} key={r.title}>
              <div
                className="why-card reveal reveal--fade-up"
                style={{ '--reveal-delay': `${i * 90}ms` }}
              >
                <span className="why-card__icon">
                  <Icon path={r.icon} />
                </span>
                <h5 className="fw-bold">{r.title}</h5>
                <p>{r.text}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

export default WhyTravelWithUs
