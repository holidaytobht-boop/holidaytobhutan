import ContactPage from '@/lib/models/ContactPage.js'
import { isDbConnected } from '@/lib/db/connect.js'
import * as contactPageStore from '@/lib/stores/contactPageStore.js'
import { sanitizeUrl, sanitizeImagePath } from '@/lib/security/urls.js'

const str = (v) => (typeof v === 'string' ? v.trim() : '')
const img = (v) => sanitizeImagePath(str(v))

const VALID_TYPES = new Set(['phone', 'email', 'whatsapp', 'address'])

const normalizeStrings = (list) =>
  (Array.isArray(list) ? list : [])
    .map((s) => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean)

const normalizeMethods = (methods) =>
  (Array.isArray(methods) ? methods : [])
    .filter((m) => m && str(m.label))
    .map((m) => ({
      type: VALID_TYPES.has(m.type) ? m.type : 'phone',
      label: str(m.label),
      value: str(m.value),
      sub: str(m.sub),
      href: sanitizeUrl(str(m.href)),
    }))

const normalizeContactPage = (body = {}) => ({
  hero: {
    eyebrow: str(body.hero?.eyebrow),
    title: str(body.hero?.title),
    subtitle: str(body.hero?.subtitle),
    image: img(body.hero?.image),
    ctaText: str(body.hero?.ctaText),
    ctaLink: sanitizeUrl(str(body.hero?.ctaLink)),
  },
  info: {
    eyebrow: str(body.info?.eyebrow),
    title: str(body.info?.title),
    lead: str(body.info?.lead),
  },
  methods: normalizeMethods(body.methods),
  whatsappCta: {
    label: str(body.whatsappCta?.label),
    url: sanitizeUrl(str(body.whatsappCta?.url)),
  },
  form: {
    eyebrow: str(body.form?.eyebrow),
    title: str(body.form?.title),
    submitLabel: str(body.form?.submitLabel),
    successTitle: str(body.form?.successTitle),
    successMessage: str(body.form?.successMessage),
    interestOptions: normalizeStrings(body.form?.interestOptions),
  },
})

export const getContactPage = async (req, res) => {
  if (isDbConnected()) {
    const doc = await ContactPage.findOne().lean()
    if (!doc) {
      return res.json({ success: true, data: normalizeContactPage(contactPageStore.get()) })
    }
    return res.json({ success: true, data: normalizeContactPage(doc) })
  }
  return res.json({ success: true, data: normalizeContactPage(contactPageStore.get()) })
}

export const updateContactPage = async (req, res) => {
  const payload = normalizeContactPage(req.body || {})

  if (isDbConnected()) {
    const doc = await ContactPage.findOneAndUpdate({}, payload, { new: true, upsert: true })
    return res.json({ success: true, data: normalizeContactPage(doc.toObject()) })
  }

  contactPageStore.update(payload)
  return res.json({ success: true, data: normalizeContactPage(contactPageStore.get()) })
}
