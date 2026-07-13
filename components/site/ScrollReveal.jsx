'use client'

import { useEffect } from 'react'

function markVisibleInViewport() {
  const viewportHeight = window.innerHeight
  document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top < viewportHeight * 0.92 && rect.bottom > 0) {
      el.classList.add('is-visible')
    }
  })
}

export default function ScrollReveal() {
  useEffect(() => {
    let cancelled = false
    let observer
    let mutation
    let revealReadyFrame

    const init = () => {
      if (cancelled) return

      markVisibleInViewport()

      revealReadyFrame = requestAnimationFrame(() => {
        document.documentElement.classList.add('reveal-ready')
      })

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
      )

      const scan = () => {
        document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => observer.observe(el))
      }

      scan()

      mutation = new MutationObserver(() => {
        markVisibleInViewport()
        scan()
      })
      mutation.observe(document.body, { childList: true, subtree: true })
    }

    // Wait until React finishes hydrating before mutating reveal classes.
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(init)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      if (revealReadyFrame) cancelAnimationFrame(revealReadyFrame)
      document.documentElement.classList.remove('reveal-ready')
      observer?.disconnect()
      mutation?.disconnect()
    }
  }, [])

  return null
}
