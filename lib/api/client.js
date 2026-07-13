'use client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  let body = null
  try {
    body = await res.json()
  } catch {
    body = null
  }

  if (!res.ok) {
    const message =
      body?.errors?.length > 0
        ? body.errors.join(' ')
        : body?.message || `Request failed (${res.status})`
    throw new Error(message)
  }
  return body
}

export const api = {
  health: () => request('/api/health'),
  getTours: () => request('/api/tours'),
  getTour: (slug) => request(`/api/tours/${slug}`),
  getPackage: (slug) => request(`/api/tours/package/${slug}`),
  createTour: (data) => request('/api/tours', { method: 'POST', body: JSON.stringify(data) }),
  updateTour: (slug, data) =>
    request(`/api/tours/${slug}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTour: (slug) => request(`/api/tours/${slug}`, { method: 'DELETE' }),
  getDestinations: () => request('/api/destinations'),
  getDestination: (slug) => request(`/api/destinations/${slug}`),
  createDestination: (data) =>
    request('/api/destinations', { method: 'POST', body: JSON.stringify(data) }),
  updateDestination: (slug, data) =>
    request(`/api/destinations/${slug}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDestination: (slug) => request(`/api/destinations/${slug}`, { method: 'DELETE' }),
  getTravelGuide: () => request('/api/travel-guide'),
  updateTravelGuide: (data) =>
    request('/api/travel-guide', { method: 'PUT', body: JSON.stringify(data) }),
  getAboutPage: () => request('/api/about'),
  updateAboutPage: (data) =>
    request('/api/about', { method: 'PUT', body: JSON.stringify(data) }),
  getContactPage: () => request('/api/contact-page'),
  updateContactPage: (data) =>
    request('/api/contact-page', { method: 'PUT', body: JSON.stringify(data) }),
  getHeroBanners: () => request('/api/hero-banners'),
  updateHeroBanners: (data) =>
    request('/api/hero-banners', { method: 'PUT', body: JSON.stringify(data) }),
  getHomePage: () => request('/api/home-page'),
  updateHomePage: (data) =>
    request('/api/home-page', { method: 'PUT', body: JSON.stringify(data) }),
  syncHomePageReviews: () =>
    request('/api/home-page/sync-reviews', { method: 'POST' }),
  getFooter: () => request('/api/footer'),
  updateFooter: (data) =>
    request('/api/footer', { method: 'PUT', body: JSON.stringify(data) }),
  getInquiries: () => request('/api/contact'),
  updateInquiry: (id, data) =>
    request(`/api/contact/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteInquiry: (id) => request(`/api/contact/${id}`, { method: 'DELETE' }),
  exportInquiries: async () => {
    const res = await fetch(`${API_URL}/api/contact/export`, { credentials: 'include' })
    if (!res.ok) throw new Error(`Export failed (${res.status})`)
    return res.blob()
  },
  createInquiry: (data) =>
    request('/api/contact', { method: 'POST', body: JSON.stringify(data) }),
  getAdminAccount: () => request('/api/admin-account'),
  updateAdminAccount: (data) =>
    request('/api/admin-account', { method: 'PUT', body: JSON.stringify(data) }),
  getBookings: () => request('/api/bookings'),
  updateBooking: (id, data) =>
    request(`/api/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBooking: (id) => request(`/api/bookings/${id}`, { method: 'DELETE' }),
  exportBookings: async () => {
    const res = await fetch(`${API_URL}/api/bookings/export`, { credentials: 'include' })
    if (!res.ok) throw new Error(`Export failed (${res.status})`)
    return res.blob()
  },
  uploadImage: async (file) => {
    const formData = new FormData()
    formData.append('image', file)
    const res = await fetch(`${API_URL}/api/uploads`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
    let body = null
    try {
      body = await res.json()
    } catch {
      body = null
    }
    if (!res.ok) {
      throw new Error(body?.message || `Upload failed (${res.status})`)
    }
    return body
  },
}

export { API_URL }
