import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../services/apiClient'
import * as classService from '../services/classService'
import type { FitnessClass } from '../types'

const sample: FitnessClass[] = [
  {
    id: 1,
    title: 'Morning Yoga',
    instructor: 'Maya Patel',
    category: 'Yoga',
    level: 'Beginner',
    startsAt: '2027-01-12T07:00',
    durationMin: 60,
    capacity: 2,
    booked: 1,
    location: 'Studio A',
    description: 'A gentle morning flow for everyone.',
  },
]

function mockFetch(response: Partial<Response> | Error) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => (response instanceof Error ? Promise.reject(response) : Promise.resolve(response))),
  )
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  classService.resetClassStore()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('classService', () => {
  it('loads classes from the JSON file', async () => {
    mockFetch({ ok: true, json: () => Promise.resolve(sample) })
    const promise = classService.getClasses()
    await vi.advanceTimersByTimeAsync(1000)
    expect(await promise).toEqual(sample)
  })

  it('turns a failed request into a friendly ApiError', async () => {
    mockFetch(new TypeError('network down'))
    const promise = classService.getClasses()
    const assertion = expect(promise).rejects.toBeInstanceOf(ApiError)
    await vi.advanceTimersByTimeAsync(1000)
    await assertion
  })

  it('creates, updates and deletes classes in memory', async () => {
    mockFetch({ ok: true, json: () => Promise.resolve(sample) })
    const run = async <T,>(p: Promise<T>) => {
      const result = p
      await vi.advanceTimersByTimeAsync(2000)
      return result
    }
    const { id: _id, booked: _booked, ...input } = sample[0]
    const created = await run(classService.createClass({ ...input, title: 'New Class' }))
    expect(created.id).toBe(2)
    const updated = await run(classService.updateClass(2, { ...input, title: 'Renamed' }))
    expect(updated.title).toBe('Renamed')
    await run(classService.deleteClass(2))
    expect((await run(classService.getClasses())).map((c) => c.id)).toEqual([1])
  })

  it('prevents booking a full class', async () => {
    mockFetch({ ok: true, json: () => Promise.resolve(sample) })
    const first = classService.bookClass(1, 10)
    await vi.advanceTimersByTimeAsync(2000)
    await first
    const second = classService.bookClass(1, 11)
    const assertion = expect(second).rejects.toThrow(/full/)
    await vi.advanceTimersByTimeAsync(2000)
    await assertion
  })
})
