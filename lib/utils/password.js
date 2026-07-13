import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

const SALT_LEN = 16
const KEY_LEN = 64

export function hashPassword(password) {
  const salt = randomBytes(SALT_LEN)
  const hash = scryptSync(password, salt, KEY_LEN)
  return {
    salt: salt.toString('hex'),
    passwordHash: hash.toString('hex'),
  }
}

export function verifyPassword(password, saltHex, hashHex) {
  if (!password || !saltHex || !hashHex) return false
  try {
    const salt = Buffer.from(saltHex, 'hex')
    const expected = Buffer.from(hashHex, 'hex')
    const actual = scryptSync(password, salt, KEY_LEN)
    if (expected.length !== actual.length) return false
    return timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}
