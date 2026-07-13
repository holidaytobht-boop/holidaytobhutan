'use client'

import { Suspense } from 'react'
import { Container } from 'react-bootstrap'
import TripPlanner from '@/components/site/TripPlanner'
import PageLoading from '@/components/site/PageLoading'

const STEPS = [
  {
    title: 'Share your trip details',
    text: 'Tell us your travel dates, group size, preferred tour, and any special requests.',
  },
  {
    title: 'Receive a custom itinerary',
    text: 'Our Bhutan specialists craft a personalized route and send it to you within 24 hours.',
  },
  {
    title: 'Confirm and travel',
    text: 'Review, refine, and book with confidence — we handle the rest on the ground.',
  },
]

function PlanMyTrip() {
  return (
    <>
      <section
        className="page-hero"
        style={{ backgroundImage: 'url(/images/tours/trekking%20herobanner.jpg)' }}
      >
        <div className="page-hero__scrim" />
        <Container className="page-hero__inner text-center text-white">
          <p className="eyebrow text-white-50 mb-2">Tailor-made journeys</p>
          <h1>Plan My Trip</h1>
          <p className="page-hero__sub">
            Tell us about your dream trip to Bhutan. Our local specialists will craft a personalized
            itinerary and get back to you within 24 hours.
          </p>
        </Container>
      </section>

      <section className="section-pad planner-page">
        <Container>
          <div className="planner-page__intro reveal reveal--fade-up">
            <p className="eyebrow mb-2">How it works</p>
            <h2 className="planner-page__intro-title">Your journey starts here</h2>
            <p className="planner-page__intro-lead">
              Whether you want culture, trekking, festivals, or a mix of everything — we design trips
              around what matters to you.
            </p>

            <ol className="planner-page__steps">
              {STEPS.map((step, index) => (
                <li key={step.title} className="planner-page__step">
                  <span className="planner-page__step-num" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className="planner-page__step-body">
                    <span className="planner-page__step-title">{step.title}</span>
                    <span className="planner-page__step-text">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="planner-page__form-wrap">
            <Suspense fallback={<PageLoading label="Loading booking form…" minHeight="20rem" />}>
              <TripPlanner variant="page" />
            </Suspense>
          </div>
        </Container>
      </section>
    </>
  )
}

export default PlanMyTrip
