import type { Booking, ClassInput, FitnessClass } from '../types'
import { ApiError, DATA_FILES, delay, fetchJson } from './apiClient'

/*
 * The JSON file is the "server". After the first fetch, changes are applied to this
 * in-memory copy to simulate a real API. They are lost when the page is refreshed.
 */
let classes: FitnessClass[] | null = null
let bookings: Booking[] = []

async function loadClasses(): Promise<FitnessClass[]> {
  if (classes === null) {
    classes = await fetchJson<FitnessClass[]>(DATA_FILES.classes)
  }
  return classes
}

function findIndex(list: FitnessClass[], id: number): number {
  const index = list.findIndex((c) => c.id === id)
  if (index === -1) throw new ApiError('That class could not be found.', 404)
  return index
}

export async function getClasses(): Promise<FitnessClass[]> {
  const list = await loadClasses()
  return [...list]
}

export async function getClass(id: number): Promise<FitnessClass> {
  const list = await loadClasses()
  return list[findIndex(list, id)]
}

export async function createClass(input: ClassInput): Promise<FitnessClass> {
  const list = await loadClasses()
  await delay()
  const nextId = list.reduce((max, c) => Math.max(max, c.id), 0) + 1
  const created: FitnessClass = { ...input, id: nextId, booked: 0 }
  classes = [...list, created]
  return created
}

export async function updateClass(id: number, input: ClassInput): Promise<FitnessClass> {
  const list = await loadClasses()
  await delay()
  const index = findIndex(list, id)
  if (input.capacity < list[index].booked) {
    throw new ApiError('Capacity cannot be lower than the number of people already booked.', 409)
  }
  const updated: FitnessClass = { ...list[index], ...input }
  classes = list.map((c) => (c.id === id ? updated : c))
  return updated
}

export async function deleteClass(id: number): Promise<void> {
  const list = await loadClasses()
  await delay()
  findIndex(list, id)
  classes = list.filter((c) => c.id !== id)
  bookings = bookings.filter((b) => b.classId !== id)
}

export async function getBookings(userId: number): Promise<Booking[]> {
  await delay()
  return bookings.filter((b) => b.userId === userId)
}

export async function bookClass(classId: number, userId: number): Promise<FitnessClass> {
  const list = await loadClasses()
  await delay()
  const index = findIndex(list, classId)
  const target = list[index]
  if (bookings.some((b) => b.classId === classId && b.userId === userId)) {
    throw new ApiError('You have already booked this class.', 409)
  }
  if (target.booked >= target.capacity) {
    throw new ApiError('Sorry, this class is full.', 409)
  }
  const updated = { ...target, booked: target.booked + 1 }
  classes = list.map((c) => (c.id === classId ? updated : c))
  bookings = [...bookings, { classId, userId }]
  return updated
}

export async function cancelBooking(classId: number, userId: number): Promise<FitnessClass> {
  const list = await loadClasses()
  await delay()
  const index = findIndex(list, classId)
  if (!bookings.some((b) => b.classId === classId && b.userId === userId)) {
    throw new ApiError('You do not have a booking for this class.', 409)
  }
  const updated = { ...list[index], booked: Math.max(0, list[index].booked - 1) }
  classes = list.map((c) => (c.id === classId ? updated : c))
  bookings = bookings.filter((b) => !(b.classId === classId && b.userId === userId))
  return updated
}

/** Test helper: clears the in-memory copy so the next call refetches the JSON file. */
export function resetClassStore(): void {
  classes = null
  bookings = []
}
