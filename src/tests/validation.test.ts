import { describe, expect, it } from 'vitest'
import { validateClassForm, validateLogin } from '../utils/validation'
import type { ClassFormValues } from '../utils/validation'

const validClass: ClassFormValues = {
  title: 'Morning Yoga',
  instructor: 'Maya Patel',
  category: 'Yoga',
  level: 'Beginner',
  startsAt: '2027-01-12T07:00',
  durationMin: '60',
  capacity: '20',
  location: 'Studio A',
  description: 'A gentle morning flow for everyone.',
}

describe('validateClassForm', () => {
  it('accepts a complete, valid class', () => {
    expect(validateClassForm(validClass)).toEqual({})
  })

  it('reports an error for each invalid field', () => {
    const errors = validateClassForm({ ...validClass, title: 'Hi', durationMin: '5', capacity: '0', description: 'short' })
    expect(Object.keys(errors).sort()).toEqual(['capacity', 'description', 'durationMin', 'title'])
  })

  it('does not allow capacity below the number already booked', () => {
    const errors = validateClassForm({ ...validClass, capacity: '5' }, 8)
    expect(errors.capacity).toMatch(/already booked/)
  })
})

describe('validateLogin', () => {
  it('requires a valid email and a password of at least 6 characters', () => {
    expect(validateLogin({ email: 'nope', password: '123' })).toEqual({
      email: 'Enter a valid email address.',
      password: 'Password must be at least 6 characters.',
    })
    expect(validateLogin({ email: 'a@b.co', password: 'secret1' })).toEqual({})
  })
})
