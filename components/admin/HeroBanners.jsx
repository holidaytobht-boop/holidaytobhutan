'use client'

import { useEffect, useMemo, useState } from 'react'
import Layout from '@/components/admin/Layout'
import AdminLoading from '@/components/admin/ui/AdminLoading'
import AdminCmsSections from '@/components/admin/ui/AdminCmsSections'
import { buildHeroBannerSections, renderHeroBannerSection } from '@/components/admin/sections/heroBannerSections'
import { api } from '@/lib/api/client'
import { heroBannersSeed } from '@/lib/seeds/heroBanners.js'

const emptyBanners = () => JSON.parse(JSON.stringify(heroBannersSeed))

function HeroBannersAdmin() {
  const [banners, setBanners] = useState(emptyBanners())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [query, setQuery] = useState('')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [editingKey, setEditingKey] = useState(null)

  useEffect(() => {
    api
      .getHeroBanners()
      .then((res) => {
        const d = res?.data
        const base = emptyBanners()
        if (!d) {
          setBanners(base)
          return
        }
        setBanners({
          ...base,
          ...d,
          home: {
            ...base.home,
            ...d.home,
            slides: d.home?.slides?.length ? d.home.slides : base.home.slides,
          },
          toursPage: { ...base.toursPage, ...d.toursPage },
          destinationsPage: { ...base.destinationsPage, ...d.destinationsPage },
          aboutPage: { ...base.aboutPage, ...d.aboutPage },
          contactPage: { ...base.contactPage, ...d.contactPage },
          travelGuidePage: { ...base.travelGuidePage, ...d.travelGuidePage },
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const setSection = (key, value) => setBanners((p) => ({ ...p, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.updateHeroBanners(banners)
      setSuccess('Hero banners saved. Changes appear on the website.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const sections = useMemo(() => buildHeroBannerSections(banners), [banners])

  if (loading) {
    return (
      <Layout title="Hero Banners">
        <AdminLoading />
      </Layout>
    )
  }

  return (
    <Layout title="Hero Banners">
      <AdminCmsSections
        pageLabel="Hero Banners"
        description="Single place to edit hero banners for the homepage carousel, Tours, Destinations, About, Contact, and Travel Guide pages."
        sections={sections}
        query={query}
        setQuery={setQuery}
        sectionFilter={sectionFilter}
        setSectionFilter={setSectionFilter}
        saving={saving}
        onSave={handleSave}
        error={error}
        success={success}
        editingKey={editingKey}
        setEditingKey={setEditingKey}
        renderEditor={(key) => renderHeroBannerSection(key, banners, setSection)}
      />

      <p className="text-muted small mb-0">
        Page heroes for About, Contact, and Travel Guide are edited here only — not in those page admin screens.
      </p>
    </Layout>
  )
}

export default HeroBannersAdmin
