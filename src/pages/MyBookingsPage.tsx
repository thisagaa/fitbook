import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Link } from 'react-router-dom'
import ClassCard from '../components/ClassCard'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { useBookings, useCancelBooking, useClasses } from '../hooks/useClasses'
import type { FitnessClass } from '../types'

export default function MyBookingsPage() {
  const { user } = useAuth()
  const userId = user?.id ?? 0
  const classesQuery = useClasses()
  const bookingsQuery = useBookings(userId)
  const cancel = useCancelBooking(userId)
  const [toCancel, setToCancel] = useState<FitnessClass | null>(null)

  if (classesQuery.isPending || bookingsQuery.isPending) return <LoadingSpinner label="Loading your bookings..." />
  const queryError = classesQuery.error ?? bookingsQuery.error
  if (queryError) {
    return (
      <ErrorMessage
        message={queryError.message}
        onRetry={() => {
          void classesQuery.refetch()
          void bookingsQuery.refetch()
        }}
      />
    )
  }

  if (!classesQuery.data || !bookingsQuery.data) return null

  const bookedIds = new Set(bookingsQuery.data.map((b) => b.classId))
  const myClasses = classesQuery.data.filter((c) => bookedIds.has(c.id))

  function handleConfirmCancel() {
    if (!toCancel) return
    cancel.mutate(toCancel.id, { onSettled: () => setToCancel(null) })
  }

  return (
    <>
      <h1>My bookings</h1>
      {cancel.isError && <ErrorMessage message={cancel.error.message} />}
      {myClasses.length === 0 ? (
        <EmptyState title="You have not booked any classes yet.">
          <Link to="/classes">Find a class</Link>
        </EmptyState>
      ) : (
        <Row as="ul" className="g-3 list-unstyled" xs={1} md={2} lg={3}>
          {myClasses.map((c) => (
            <Col as="li" key={c.id}>
              <div className="d-flex flex-column gap-2 h-100">
                <ClassCard fitnessClass={c} />
                <Button variant="outline-danger" size="sm" onClick={() => setToCancel(c)}>
                  Cancel booking
                  <span className="visually-hidden"> for {c.title}</span>
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      )}
      <ConfirmDialog
        show={toCancel !== null}
        title="Cancel this booking?"
        message={toCancel ? `Your place in "${toCancel.title}" will be released.` : ''}
        confirmLabel="Cancel booking"
        busy={cancel.isPending}
        onConfirm={handleConfirmCancel}
        onCancel={() => setToCancel(null)}
      />
    </>
  )
}
