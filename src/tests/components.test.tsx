import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import ClassCard from '../components/ClassCard'
import ErrorMessage from '../components/ErrorMessage'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuthStore } from '../store/authStore'
import type { FitnessClass, Session } from '../types'

const fitnessClass: FitnessClass = {
  id: 7,
  title: 'HIIT Blast',
  instructor: 'Jordan Reyes',
  category: 'HIIT',
  level: 'Advanced',
  startsAt: '2027-01-12T18:30',
  durationMin: 45,
  capacity: 16,
  booked: 16,
  location: 'Main Gym',
  description: 'Short, intense intervals.',
}

function session(role: 'member' | 'admin', expiresAt = Date.now() + 60_000): Session {
  return { token: 't', expiresAt, user: { id: 1, name: 'Test', email: 't@t.test', role } }
}

function renderProtected(adminOnly = false) {
  render(
    <MemoryRouter initialEntries={['/secret']}>
      <Routes>
        <Route path="/login" element={<p>Login page</p>} />
        <Route path="/" element={<p>Home page</p>} />
        <Route element={<ProtectedRoute adminOnly={adminOnly} />}>
          <Route path="/secret" element={<p>Secret page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  useAuthStore.setState({ session: null })
})

describe('ClassCard', () => {
  it('shows class details, links to the detail page and flags a full class', () => {
    render(
      <MemoryRouter>
        <ClassCard fitnessClass={fitnessClass} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'HIIT Blast' })).toHaveAttribute('href', '/classes/7')
    expect(screen.getByText('with Jordan Reyes')).toBeInTheDocument()
    expect(screen.getByText('Full')).toBeInTheDocument()
  })
})

describe('ErrorMessage', () => {
  it('announces the error and offers a retry', () => {
    render(<ErrorMessage message="Could not load" onRetry={() => {}} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Could not load')
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})

describe('ProtectedRoute', () => {
  it('redirects visitors who are not logged in to the login page', () => {
    renderProtected()
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('lets a logged-in user through', () => {
    useAuthStore.setState({ session: session('member') })
    renderProtected()
    expect(screen.getByText('Secret page')).toBeInTheDocument()
  })

  it('redirects an expired session to login', () => {
    useAuthStore.setState({ session: session('member', Date.now() - 1000) })
    renderProtected()
    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(useAuthStore.getState().session).toBeNull()
  })

  it('keeps members out of admin-only routes', () => {
    useAuthStore.setState({ session: session('member') })
    renderProtected(true)
    expect(screen.getByText('Home page')).toBeInTheDocument()
  })
})
