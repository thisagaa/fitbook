import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import type { FitnessClass } from '../types'
import { formatDateTime, spotsLeft } from '../utils/format'

interface ClassCardProps {
  fitnessClass: FitnessClass
}

export default function ClassCard({ fitnessClass }: ClassCardProps) {
  const { id, title, instructor, category, level, startsAt, durationMin, capacity, booked } = fitnessClass
  const left = spotsLeft(capacity, booked)

  return (
    <Card as="article" className="h-100" aria-labelledby={`class-title-${id}`}>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex flex-wrap gap-2 mb-2">
          <Badge bg="primary">{category}</Badge>
          <Badge bg="secondary">{level}</Badge>
        </div>
        <Card.Title as="h3" id={`class-title-${id}`} className="h5">
          <Link to={`/classes/${id}`} className="stretched-link text-decoration-none">
            {title}
          </Link>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-body-secondary">with {instructor}</Card.Subtitle>
        <p className="mb-1">
          {formatDateTime(startsAt)} · {durationMin} min
        </p>
        <p className={`mt-auto mb-0 fw-semibold ${left === 0 ? 'text-danger' : 'text-success'}`}>
          {left === 0 ? 'Full' : `${left} ${left === 1 ? 'spot' : 'spots'} left`}
        </p>
      </Card.Body>
    </Card>
  )
}
