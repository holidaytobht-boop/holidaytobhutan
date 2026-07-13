'use client'

import { useEffect, useMemo, useState } from 'react'
import Layout from '@/components/admin/Layout'
import AdminLoading from '@/components/admin/ui/AdminLoading'
import AdminCmsSections from '@/components/admin/ui/AdminCmsSections'
import { buildTravelGuideSections, renderTravelGuideSection } from '@/components/admin/sections/travelGuideSections'
import { api } from '@/lib/api/client'

const emptyGuide = () => ({
  hero: { title: '', subtitle: '', image: '' },
  about: { title: '', subtitle: '', paragraphs: [''], facts: [{ label: '', value: '' }] },
  visaSdf: { title: '', subtitle: '', cards: [{ title: '', body: '' }] },
  seasons: { title: '', subtitle: '', items: [{ name: '', months: '', desc: '', image: '' }] },
  trekking: { title: '', subtitle: '', tips: [''] },
  packing: { title: '', subtitle: '', items: [''] },
  faqs: { title: '', subtitle: '', items: [{ q: '', a: '' }] },
})

function TravelGuideAdmin() {
  const [guide, setGuide] = useState(emptyGuide())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [query, setQuery] = useState('')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [editingKey, setEditingKey] = useState(null)

  useEffect(() => {
    api
      .getTravelGuide()
      .then((res) => {
        const d = res?.data
        if (d) {
          setGuide({
            ...emptyGuide(),
            ...d,
            about: {
              ...emptyGuide().about,
              ...d.about,
              paragraphs: d.about?.paragraphs?.length ? d.about.paragraphs : [''],
              facts: d.about?.facts?.length ? d.about.facts : [{ label: '', value: '' }],
            },
            visaSdf: {
              ...emptyGuide().visaSdf,
              ...d.visaSdf,
              cards: d.visaSdf?.cards?.length ? d.visaSdf.cards : [{ title: '', body: '' }],
            },
            seasons: {
              ...emptyGuide().seasons,
              ...d.seasons,
              items: d.seasons?.items?.length ? d.seasons.items : [{ name: '', months: '', desc: '', image: '' }],
            },
            trekking: {
              ...emptyGuide().trekking,
              ...d.trekking,
              tips: d.trekking?.tips?.length ? d.trekking.tips : [''],
            },
            packing: {
              ...emptyGuide().packing,
              ...d.packing,
              items: d.packing?.items?.length ? d.packing.items : [''],
            },
            faqs: {
              ...emptyGuide().faqs,
              ...d.faqs,
              items: d.faqs?.items?.length ? d.faqs.items : [{ q: '', a: '' }],
            },
          })
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const setSection = (key, value) => setGuide((g) => ({ ...g, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.updateTravelGuide(guide)
      setSuccess('Travel guide saved. Changes appear on the website.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const sections = useMemo(() => buildTravelGuideSections(guide), [guide])

  if (loading) {
    return (
      <Layout title="Travel Guide">
        <AdminLoading />
      </Layout>
    )
  }

  return (
    <Layout title="Travel Guide">
      <AdminCmsSections
        pageLabel="Travel Guide"
        description="Edit Travel Guide content. The page hero banner is managed under Hero Banners."
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
        renderEditor={(key) => renderTravelGuideSection(key, guide, setSection)}
      />
    </Layout>
  )
}

export default TravelGuideAdmin
