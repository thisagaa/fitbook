import type { Session, User, UserRecord } from '../types'
import { ApiError, DATA_FILES, delay, fetchJson } from './apiClient'

/** Fake tokens last 30 minutes so token-expiry handling can be demonstrated. */
const TOKEN_LIFETIME_MS = 30 * 60 * 1000

function createFakeToken(user: User, expiresAt: number): string {
  // Not a real JWT and not signed - anyone can forge one. It only imitates the shape of a token.
  return `fake.${btoa(JSON.stringify({ sub: user.id, role: user.role, exp: expiresAt }))}.signature`
}

export async function login(email: string, password: string): Promise<Session> {
  const records = await fetchJson<UserRecord[]>(DATA_FILES.users)
  await delay()
  const match = records.find(
    (r) => r.email.toLowerCase() === email.trim().toLowerCase() && r.password === password,
  )
  if (!match) throw new ApiError('Incorrect email or password.', 401)
  const user: User = { id: match.id, name: match.name, email: match.email, role: match.role }
  const expiresAt = Date.now() + TOKEN_LIFETIME_MS
  return { token: createFakeToken(user, expiresAt), user, expiresAt }
}
