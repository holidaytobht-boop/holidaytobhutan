'use client'

import { useEffect, useMemo, useState } from 'react'
import Layout from '@/components/admin/Layout'
import AdminLoading from '@/components/admin/ui/AdminLoading'
import AdminCmsSections from '@/components/admin/ui/AdminCmsSections'
import { buildAboutSections, renderAboutSection } from '@/components/admin/sections/aboutSections'
import { api } from '@/lib/api/client'
import { aboutPageSeed } from '@/lib/seeds/aboutPage.js'

const emptyPage = () => JSON.parse(JSON.stringify(aboutPageSeed))

function AboutAdmin() {
  const [page, setPage] = useState(emptyPage())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [query, setQuery] = useState('')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [editingKey, setEditingKey] = useState(null)

  useEffect(() => {
    api
      .getAboutPage()
      .then((res) => {
        const d = res?.data
        const base = emptyPage()
        if (!d) {
          setPage(base)
          return
        }
        setPage({
          ...base,
          ...d,
          story: {
            ...base.story,
            ...d.story,
            paragraphs: d.story?.paragraphs?.length ? d.story.paragraphs : [''],
          },
          offers: {
            ...base.offers,
            ...d.offers,
            items: d.offers?.items?.length ? d.offers.items : [{ title: '', text: '' }],
          },
          whyChooseUs: {
            ...base.whyChooseUs,
            ...d.whyChooseUs,
            items: d.whyChooseUs?.items?.length ? d.whyChooseUs.items : [''],
          },
          team: {
            ...base.team,
            ...d.team,
            members: d.team?.members?.length ? d.team.members : [{ name: '', role: '', avatar: '' }],
          },
          values: {
            ...base.values,
            ...d.values,
            items: d.values?.items?.length ? d.values.items : [{ title: '', text: '' }],
          },
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const setSection = (key, value) => setPage((p) => ({ ...p, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.updateAboutPage(page)
      setSuccess('About page saved. Changes appear on the website.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const sections = useMemo(() => buildAboutSections(page), [page])

  if (loading) {
    return (
      <Layout title="About Us">
        <AdminLoading />
      </Layout>
    )
  }

  return (
    <Layout title="About Us">
      <AdminCmsSections
        pageLabel="About Us"
        description="Edit About page content. The page hero banner is managed under Hero Banners."
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
        renderEditor={(key) => renderAboutSection(key, page, setSection)}
      />
    </Layout>
  )
}

export default AboutAdmin
