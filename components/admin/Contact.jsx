'use client'

import { useEffect, useMemo, useState } from 'react'
import Layout from '@/components/admin/Layout'
import AdminLoading from '@/components/admin/ui/AdminLoading'
import AdminCmsSections from '@/components/admin/ui/AdminCmsSections'
import { buildContactSections, renderContactSection } from '@/components/admin/sections/contactSections'
import { api } from '@/lib/api/client'
import { contactPageSeed } from '@/lib/seeds/contactPage.js'

const emptyPage = () => JSON.parse(JSON.stringify(contactPageSeed))

function ContactAdmin() {
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
      .getContactPage()
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
          methods: d.methods?.length ? d.methods : base.methods,
          form: {
            ...base.form,
            ...d.form,
            interestOptions: d.form?.interestOptions?.length ? d.form.interestOptions : [''],
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
      await api.updateContactPage(page)
      setSuccess('Contact page saved. Changes appear on the website.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const sections = useMemo(() => buildContactSections(page), [page])

  if (loading) {
    return (
      <Layout title="Contact Us">
        <AdminLoading />
      </Layout>
    )
  }

  return (
    <Layout title="Contact Us">
      <AdminCmsSections
        pageLabel="Contact Us"
        description="Edit Contact page content. Hero banner is managed under Hero Banners. Contact details in Contact Methods also appear in the site footer."
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
        renderEditor={(key) => renderContactSection(key, page, setSection)}
      />
    </Layout>
  )
}

export default ContactAdmin
