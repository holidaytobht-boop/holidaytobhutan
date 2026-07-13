'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Navbar as BsNavbar, Container, Nav, Button } from 'react-bootstrap'
import { tourCategorySlugs } from '@/lib/content/categories'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tours', label: 'Tours' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/travel-guide', label: 'Travel Guide' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

function isNavActive(pathname, href) {
  if (href === '/') return pathname === '/'

  if (href === '/tours') {
    if (pathname === '/tours' || pathname.startsWith('/tours/')) return true
    return tourCategorySlugs.some((slug) => pathname === `/${slug}`)
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function Navbar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const close = () => setExpanded(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="navbar-wrap">
      <BsNavbar
        expand="lg"
        variant="dark"
        expanded={expanded}
        onToggle={setExpanded}
        className={`site-navbar ${expanded ? 'navbar-open' : ''} ${scrolled ? 'is-scrolled' : ''}`}
      >
        <Container>
          <BsNavbar.Brand as={Link} href="/" onClick={close} className="brand-lockup">
            <img
              src="/images/white-logo.svg"
              alt="Holiday to Bhutan"
              className="brand-logo"
              decoding="async"
            />
          </BsNavbar.Brand>
          <BsNavbar.Toggle aria-controls="main-nav" aria-label="Toggle navigation menu" />
          <BsNavbar.Collapse id="main-nav">
            <Nav className="mx-auto align-items-lg-center">
              {NAV_LINKS.map((link) => (
                <Nav.Link
                  key={link.href}
                  as={Link}
                  href={link.href}
                  onClick={close}
                  className={isNavActive(pathname, link.href) ? 'is-active' : undefined}
                  aria-current={isNavActive(pathname, link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Nav.Link>
              ))}
            </Nav>
            <Button className="btn-cta" as={Link} href="/plan-my-trip" onClick={close}>
              Plan My Trip
            </Button>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>
    </div>
  )
}

export default Navbar
