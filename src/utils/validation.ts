import type { ClassCategory, ClassInput, ClassLevel } from '../types'
import { CLASS_CATEGORIES, CLASS_LEVELS } from '../types'

/** Form state keeps numbers as strings because <input> values are strings. */
export interface ClassFormValues {
  title: string
  instructor: string
  category: string
  level: string
  startsAt: string
  durationMin: string
  capacity: string
  location: string
  description: string
}

export type FormErrors<T> = Partial<Record<keyof T, string>>

function isWholeNumberBetween(raw: string, min: number, max: number): boolean {
  const value = Number(raw)
  return raw.trim() !== '' && Number.isInteger(value) && value >= min && value <= max
}

export function validateClassForm(values: ClassFormValues, minBooked = 0): FormErrors<ClassFormValues> {
  const errors: FormErrors<ClassFormValues> = {}

  if (values.title.trim().length < 3) errors.title = 'Title must be at least 3 characters.'
  else if (values.title.trim().length > 60) errors.title = 'Title must be 60 characters or fewer.'

  if (values.instructor.trim().length < 2) errors.instructor = 'Enter the name of the instructor.'

  if (!CLASS_CATEGORIES.includes(values.category as ClassCategory)) errors.category = 'Choose a category.'
  if (!CLASS_LEVELS.includes(values.level as ClassLevel)) errors.level = 'Choose a level.'

  if (!values.startsAt) errors.startsAt = 'Choose a date and time.'
  else if (Number.isNaN(new Date(values.startsAt).getTime())) errors.startsAt = 'Enter a valid date and time.'

  if (!isWholeNumberBetween(values.durationMin, 15, 180)) {
    errors.durationMin = 'Duration must be a whole number between 15 and 180 minutes.'
  }

  if (!isWholeNumberBetween(values.capacity, 1, 100)) {
    errors.capacity = 'Capacity must be a whole number between 1 and 100.'
  } else if (Number(values.capacity) < minBooked) {
    errors.capacity = `Capacity cannot be below the ${minBooked} people already booked.`
  }

  if (values.location.trim().length < 2) errors.location = 'Enter where the class takes place.'

  if (values.description.trim().length < 10) errors.description = 'Description must be at least 10 characters.'

  return errors
}

export function toClassInput(values: ClassFormValues): ClassInput {
  return {
    title: values.title.trim(),
    instructor: values.instructor.trim(),
    category: values.category as ClassCategory,
    level: values.level as ClassLevel,
    startsAt: values.startsAt,
    durationMin: Number(values.durationMin),
    capacity: Number(values.capacity),
    location: values.location.trim(),
    description: values.description.trim(),
  }
}

export interface LoginValues {
  email: string
  password: string
}

export function validateLogin(values: LoginValues): FormErrors<LoginValues> {
  const errors: FormErrors<LoginValues> = {}
  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.'
  if (!values.password) errors.password = 'Password is required.'
  else if (values.password.length < 6) errors.password = 'Password must be at least 6 characters.'
  return errors
}
