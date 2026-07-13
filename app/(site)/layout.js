import '../site.css'
import Navbar from '@/components/site/Navbar'
import Footer from '@/components/site/Footer'
import ScrollToTop from '@/components/site/ScrollToTop'
import ScrollReveal from '@/components/site/ScrollReveal'
import PageTransition from '@/components/site/PageTransition'
import BackToTop from '@/components/site/BackToTop'

export default function SiteLayout({ children }) {
  return (
    <div className="page">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollReveal />
      <ScrollToTop />
      <Navbar />
      <main id="main-content">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
