import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <Alert variant="danger" role="alert" className="d-flex flex-wrap align-items-center justify-content-between gap-2">
      <span>{message}</span>
      {onRetry && (
        <Button variant="outline-danger" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Alert>
  )
}
