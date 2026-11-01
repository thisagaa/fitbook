import { useState } from 'react'
import type { FormEvent } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import { useAuth } from '../hooks/useAuth'
import { validateLogin } from '../utils/validation'

interface LocationState {
  from?: string
  expired?: boolean
}

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const state = (useLocation().state ?? {}) as LocationState
  const [values, setValues] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({ email: false, password: false })
  const [submitting, setSubmitting] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  if (isAuthenticated && !submitting) return <Navigate to={state.from ?? '/'} replace />

  const errors = validateLogin(values)
  const isValid = Object.keys(errors).length === 0

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isValid) {
      setTouched({ email: true, password: true })
      return
    }
    setSubmitting(true)
    setLoginError(null)
    try {
      await login(values.email, values.password)
      navigate(state.from ?? '/', { replace: true })
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto" style={{ maxWidth: '28rem' }}>
      <h1>Log in</h1>
      {state.expired && <Alert variant="warning">Your session has expired. Please log in again.</Alert>}
      {state.from && !state.expired && <Alert variant="info">Please log in to continue.</Alert>}
      {loginError && (
        <Alert variant="danger" role="alert">
          {loginError}
        </Alert>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="login-email"
          label="Email"
          type="email"
          autoComplete="username"
          value={values.email}
          onChange={(email) => setValues((v) => ({ ...v, email }))}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={touched.email ? errors.email : undefined}
        />
        <FormField
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={(password) => setValues((v) => ({ ...v, password }))}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={touched.password ? errors.password : undefined}
        />
        <Button type="submit" className="w-100" disabled={!isValid || submitting}>
          {submitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
      <aside className="mt-4 small text-body-secondary" aria-label="Demo accounts">
        <p className="mb-1">Demo accounts (simulated login, fake credentials):</p>
        <ul className="mb-0">
          <li>Member: member@fitbook.test / member123</li>
          <li>Admin: admin@fitbook.test / admin123</li>
        </ul>
      </aside>
    </div>
  )
}
