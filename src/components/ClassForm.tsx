import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import { CLASS_CATEGORIES, CLASS_LEVELS } from '../types'
import type { ClassInput } from '../types'
import { toClassInput, validateClassForm } from '../utils/validation'
import type { ClassFormValues } from '../utils/validation'
import FormField from './FormField'

interface ClassFormProps {
  /** Pre-populates the form when editing. */
  initialValues?: ClassInput
  /** Number of people already booked; capacity may not drop below this. */
  minCapacity?: number
  submitLabel: string
  submitting: boolean
  onSubmit: (input: ClassInput) => void
}

const EMPTY_VALUES: ClassFormValues = {
  title: '',
  instructor: '',
  category: '',
  level: '',
  startsAt: '',
  durationMin: '60',
  capacity: '20',
  location: '',
  description: '',
}

function toFormValues(input: ClassInput): ClassFormValues {
  return {
    ...input,
    durationMin: String(input.durationMin),
    capacity: String(input.capacity),
  }
}

export default function ClassForm({ initialValues, minCapacity = 0, submitLabel, submitting, onSubmit }: ClassFormProps) {
  const [values, setValues] = useState<ClassFormValues>(initialValues ? toFormValues(initialValues) : EMPTY_VALUES)
  const [touched, setTouched] = useState<Partial<Record<keyof ClassFormValues, boolean>>>({})

  const errors = validateClassForm(values, minCapacity)
  const isValid = Object.keys(errors).length === 0

  function setField(field: keyof ClassFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function touch(field: keyof ClassFormValues) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  /** Errors only appear once the user has left the field, so people are not scolded mid-typing. */
  function errorFor(field: keyof ClassFormValues): string | undefined {
    return touched[field] ? errors[field] : undefined
  }

  function fieldProps(field: keyof ClassFormValues) {
    return {
      value: values[field],
      onChange: (value: string) => setField(field, value),
      onBlur: () => touch(field),
      error: errorFor(field),
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isValid) {
      setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])))
      return
    }
    onSubmit(toClassInput(values))
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField id="class-title" label="Title" {...fieldProps('title')} />
      <FormField id="class-instructor" label="Instructor" {...fieldProps('instructor')} />
      <FormField id="class-category" label="Category" as="select" {...fieldProps('category')}>
        <option value="">Choose a category</option>
        {CLASS_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </FormField>
      <FormField id="class-level" label="Level" as="select" {...fieldProps('level')}>
        <option value="">Choose a level</option>
        {CLASS_LEVELS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </FormField>
      <FormField id="class-starts-at" label="Date and time" type="datetime-local" {...fieldProps('startsAt')} />
      <FormField id="class-duration" label="Duration (minutes)" type="number" min={15} max={180} {...fieldProps('durationMin')} />
      <FormField
        id="class-capacity"
        label="Capacity"
        type="number"
        min={1}
        max={100}
        hint={minCapacity > 0 ? `${minCapacity} already booked.` : undefined}
        {...fieldProps('capacity')}
      />
      <FormField id="class-location" label="Location" {...fieldProps('location')} />
      <FormField id="class-description" label="Description" as="textarea" {...fieldProps('description')} />
      <div className="d-flex flex-wrap gap-2">
        <Button type="submit" disabled={!isValid || submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </Button>
        <Link to="/classes" className="btn btn-outline-secondary">
          Cancel
        </Link>
      </div>
    </form>
  )
}
