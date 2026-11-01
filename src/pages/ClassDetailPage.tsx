import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { useBookClass, useBookings, useCancelBooking, useClass, useDeleteClass } from '../hooks/useClasses'
import { formatDateTime, spotsLeft } from '../utils/format'

export default function ClassDetailPage() {
  const { id } = useParams()
  const classId = Number(id)
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin } = useAuth()
  const userId = user?.id ?? 0

  const { data: fitnessClass, isPending, isError, error, refetch } = useClass(classId)
  const { data: bookings } = useBookings(userId)
  const book = useBookClass(userId)
  const cancel = useCancelBooking(userId)
  const remove = useDeleteClass()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  if (!Number.isInteger(classId)) {
    return <EmptyState title="That class could not be found.">
      <Link to="/classes">Back to all classes</Link>
    </EmptyState>
  }
  if (isPending) return <LoadingSpinner label="Loading class..." />
  if (isError) {
    return (
      <>
        <ErrorMessage message={error.message} onRetry={() => void refetch()} />
        <Link to="/classes">Back to all classes</Link>
      </>
    )
  }

  const left = spotsLeft(fitnessClass.capacity, fitnessClass.booked)
  const isBooked = bookings?.some((b) => b.classId === classId) ?? false
  const actionError = book.error ?? cancel.error

  function handleDelete() {
    remove.mutate(classId, {
      onSuccess: () => navigate('/classes', { replace: true }),
      onSettled: () => setConfirmingDelete(false),
    })
  }

  return (
    <article>
      <p>
        <Link to="/classes">&larr; All classes</Link>
      </p>
      <div className="d-flex flex-wrap gap-2 mb-2">
        <Badge bg="primary">{fitnessClass.category}</Badge>
        <Badge bg="secondary">{fitnessClass.level}</Badge>
      </div>
      <h1>{fitnessClass.title}</h1>
      <p className="lead">with {fitnessClass.instructor}</p>

      <dl className="row">
        <dt className="col-5 col-sm-3">When</dt>
        <dd className="col-7 col-sm-9">{formatDateTime(fitnessClass.startsAt)}</dd>
        <dt className="col-5 col-sm-3">Duration</dt>
        <dd className="col-7 col-sm-9">{fitnessClass.durationMin} minutes</dd>
        <dt className="col-5 col-sm-3">Location</dt>
        <dd className="col-7 col-sm-9">{fitnessClass.location}</dd>
        <dt className="col-5 col-sm-3">Availability</dt>
        <dd className="col-7 col-sm-9">
          {left === 0 ? 'Full' : `${left} of ${fitnessClass.capacity} spots left`}
        </dd>
      </dl>
      <p>{fitnessClass.description}</p>

      {actionError && <ErrorMessage message={actionError.message} />}
      {remove.isError && <ErrorMessage message={remove.error.message} />}
      {isBooked && <Alert variant="success">You are booked into this class.</Alert>}

      <div className="d-flex flex-wrap gap-2">
        {!isAuthenticated && (
          <Link to="/login" state={{ from: `/classes/${classId}` }} className="btn btn-primary">
            Log in to book
          </Link>
        )}
        {isAuthenticated && !isBooked && (
          <Button onClick={() => book.mutate(classId)} disabled={left === 0 || book.isPending}>
            {book.isPending ? 'Booking...' : left === 0 ? 'Class full' : 'Book this class'}
          </Button>
        )}
        {isAuthenticated && isBooked && (
          <Button variant="outline-danger" onClick={() => cancel.mutate(classId)} disabled={cancel.isPending}>
            {cancel.isPending ? 'Cancelling...' : 'Cancel my booking'}
          </Button>
        )}
        {isAdmin && (
          <>
            <Link to={`/classes/${classId}/edit`} className="btn btn-outline-secondary">
              Edit class
            </Link>
            <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
              Delete class
            </Button>
          </>
        )}
      </div>

      <ConfirmDialog
        show={confirmingDelete}
        title="Delete this class?"
        message={`"${fitnessClass.title}" and all of its bookings will be removed. This cannot be undone.`}
        confirmLabel="Delete class"
        busy={remove.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </article>
  )
}
