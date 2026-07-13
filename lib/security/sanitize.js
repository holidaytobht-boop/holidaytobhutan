export function trimField(value, maxLen = 500) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLen)
}

export function trimOptional(value, maxLen = 500) {
  const trimmed = trimField(value, maxLen)
  return trimmed || null
}
