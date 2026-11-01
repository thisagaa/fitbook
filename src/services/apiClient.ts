/** Single place that knows where the JSON "server" lives and how to talk to it. */
const DATA_BASE = `${import.meta.env.BASE_URL}data/`

export const DATA_FILES = {
  classes: `${DATA_BASE}classes.json`,
  users: `${DATA_BASE}users.json`,
} as const

/** Simulated network latency in milliseconds. */
const LATENCY_MS = 400

export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function delay(ms: number = LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Fetches and parses a JSON file, converting every failure into an ApiError with a friendly message. */
export async function fetchJson<T>(url: string): Promise<T> {
  await delay()
  let response: Response
  try {
    response = await fetch(url)
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.')
  }
  if (!response.ok) {
    throw new ApiError(`The server returned an error (${response.status}).`, response.status)
  }
  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError('The server sent data we could not read.')
  }
}
