export type ClassCategory = 'Yoga' | 'HIIT' | 'Strength' | 'Cardio' | 'Pilates' | 'Dance'
export type ClassLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export const CLASS_CATEGORIES: ClassCategory[] = ['Yoga', 'HIIT', 'Strength', 'Cardio', 'Pilates', 'Dance']
export const CLASS_LEVELS: ClassLevel[] = ['Beginner', 'Intermediate', 'Advanced']

export interface FitnessClass {
  id: number
  title: string
  instructor: string
  category: ClassCategory
  level: ClassLevel
  /** ISO 8601 local date-time, e.g. 2027-01-12T18:30 */
  startsAt: string
  durationMin: number
  capacity: number
  booked: number
  location: string
  description: string
}

/** Fields the user supplies when creating or editing a class. */
export type ClassInput = Omit<FitnessClass, 'id' | 'booked'>

export type UserRole = 'member' | 'admin'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

/** A stored demo account. Passwords here are fake and exist only for the simulated login. */
export interface UserRecord extends User {
  password: string
}

export interface Session {
  token: string
  user: User
  /** Epoch milliseconds after which the token is no longer valid. */
  expiresAt: number
}

export interface Booking {
  classId: number
  userId: number
}
