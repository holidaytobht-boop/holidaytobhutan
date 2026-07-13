function refererMatchesOrigin(referer, allowedOrigins) {
  let refererOrigin
  try {
    refererOrigin = new URL(referer).origin
  } catch {
    return false
  }

  return allowedOrigins.some((entry) => {
    try {
      return new URL(entry).origin === refererOrigin
    } catch {
      return false
    }
  })
}

/** Testable origin/referer matcher used by isAllowedOrigin. */
export function matchesClientOrigin({ origin, referer, allowedOrigins, nodeEnv }) {
  const normalizedAllowed = allowedOrigins.map((entry) => entry.trim().replace(/\/+$/, ''))

  if (origin) {
    const normalizedOrigin = origin.trim().replace(/\/+$/, '')
    return normalizedAllowed.some((entry) => normalizedOrigin === entry)
  }

  if (referer) {
    return refererMatchesOrigin(referer, allowedOrigins)
  }

  return nodeEnv !== 'production'
}
