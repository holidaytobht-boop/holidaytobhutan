'use client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

let cachedUser = null

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })

  let body = null
  try {
    body = await res.json()
  } catch {
    body = null
  }

  if (!res.ok) {
    throw new Error(body?.message || 'Login failed')
  }

  cachedUser = body.data
  return cachedUser
}

export async function logout() {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
  cachedUser = null
}

export async function getUser() {
  if (cachedUser) return cachedUser

  try {
    const res = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' })
    if (!res.ok) {
      cachedUser = null
      return null
    }

    const body = await res.json()
    cachedUser = body.data
    return cachedUser
  } catch {
    cachedUser = null
    return null
  }
}

export async function isAuthed() {
  const user = await getUser()
  return Boolean(user)
}

export function setCachedUser(user) {
  cachedUser = user
}
