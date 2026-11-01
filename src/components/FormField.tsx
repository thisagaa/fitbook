import type { ChangeEvent, ReactNode } from 'react'
import Form from 'react-bootstrap/Form'

interface FormFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'datetime-local'
  as?: 'input' | 'textarea' | 'select'
  /** Options for `as="select"`. */
  children?: ReactNode
  min?: number
  max?: number
  autoComplete?: string
  hint?: string
}

/** A labelled, controlled input with an accessible, field-level error message. */
export default function FormField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  as = 'input',
  children,
  min,
  max,
  autoComplete,
  hint,
}: FormFieldProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    onChange(event.target.value)
  }

  const common = {
    value,
    onChange: handleChange,
    onBlur,
    isInvalid: Boolean(error),
    'aria-describedby': describedBy,
  }

  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{label}</Form.Label>
      {as === 'select' ? (
        <Form.Select {...common}>{children}</Form.Select>
      ) : as === 'textarea' ? (
        <Form.Control {...common} as="textarea" rows={4} />
      ) : (
        <Form.Control {...common} type={type} min={min} max={max} autoComplete={autoComplete} />
      )}
      {hint && (
        <Form.Text id={hintId} muted>
          {hint}
        </Form.Text>
      )}
      <Form.Control.Feedback type="invalid" id={errorId} role="alert">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  )
}
