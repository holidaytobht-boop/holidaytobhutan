import Footer from '@/lib/models/Footer.js'
import { isDbConnected } from '@/lib/db/connect.js'
import * as footerStore from '@/lib/stores/footerStore.js'
import { sanitizeUrl } from '@/lib/security/urls.js'

const str = (v) => (typeof v === 'string' ? v.trim() : '')
const VALID_PLATFORMS = new Set(['facebook', 'youtube', 'linkedin', 'instagram'])

const normalizeLinks = (links) =>
  (Array.isArray(links) ? links : [])
    .filter((l) => l && str(l.label))
    .map((l) => ({
      label: str(l.label),
      href: sanitizeUrl(str(l.href)),
    }))

const normalizeColumns = (columns) =>
  (Array.isArray(columns) ? columns : [])
    .filter((c) => c && str(c.title))
    .map((c) => ({
      title: str(c.title),
      links: normalizeLinks(c.links),
    }))

const normalizeSocials = (socials) =>
  (Array.isArray(socials) ? socials : [])
    .filter((s) => s && str(s.label))
    .map((s) => ({
      platform:
        s.platform === 'x' || s.platform === 'twitter'
          ? 'youtube'
          : VALID_PLATFORMS.has(s.platform)
            ? s.platform
            : 'facebook',
      label: str(s.label) || (s.platform === 'x' || s.platform === 'twitter' ? 'YouTube' : ''),
      href: sanitizeUrl(str(s.href)),
    }))

const normalizeFooter = (body = {}) => ({
  brand: {
    name: str(body.brand?.name),
    tagline: str(body.brand?.tagline),
  },
  socials: normalizeSocials(body.socials),
  columns: normalizeColumns(body.columns),
  bottom: {
    copyrightName: str(body.bottom?.copyrightName),
    showAdminLink: body.bottom?.showAdminLink === true,
  },
})

export const getFooter = async (req, res) => {
  if (isDbConnected()) {
    const doc = await Footer.findOne().lean()
    if (!doc) {
      return res.json({ success: true, data: normalizeFooter(footerStore.get()) })
    }
    return res.json({ success: true, data: normalizeFooter(doc) })
  }
  return res.json({ success: true, data: normalizeFooter(footerStore.get()) })
}

export const updateFooter = async (req, res) => {
  const payload = normalizeFooter(req.body || {})

  if (isDbConnected()) {
    const doc = await Footer.findOneAndUpdate({}, payload, { new: true, upsert: true })
    return res.json({ success: true, data: normalizeFooter(doc.toObject()) })
  }

  footerStore.update(payload)
  return res.json({ success: true, data: normalizeFooter(footerStore.get()) })
}
