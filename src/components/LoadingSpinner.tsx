import Spinner from 'react-bootstrap/Spinner'

interface LoadingSpinnerProps {
  label?: string
}

export default function LoadingSpinner({ label = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2 py-5" role="status" aria-live="polite">
      <Spinner animation="border" size="sm" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
