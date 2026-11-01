import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Link } from 'react-router-dom'
import ClassCard from '../components/ClassCard'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import { useClasses } from '../hooks/useClasses'

export default function HomePage() {
  const { data, isPending, isError, error, refetch } = useClasses()
  const featured = data
    ? [...data].filter((c) => c.booked < c.capacity).sort((a, b) => a.startsAt.localeCompare(b.startsAt)).slice(0, 3)
    : []

  return (
    <>
      <section className="py-4 mb-4 border-bottom">
        <h1 className="display-5">Book your next workout with FitBook</h1>
        <p className="lead">Browse yoga, HIIT, strength, cardio, Pilates and dance classes, then reserve your spot.</p>
        <Link to="/classes" className="btn btn-primary btn-lg">
          Browse all classes
        </Link>
      </section>

      <section aria-labelledby="featured-heading">
        <h2 id="featured-heading">Coming up with spots available</h2>
        {isPending && <LoadingSpinner label="Loading classes..." />}
        {isError && <ErrorMessage message={error.message} onRetry={() => void refetch()} />}
        {data && featured.length === 0 && <p>All classes are currently full. Please check back soon.</p>}
        <Row as="ul" className="g-3 list-unstyled" xs={1} md={3}>
          {featured.map((c) => (
            <Col as="li" key={c.id}>
              <ClassCard fitnessClass={c} />
            </Col>
          ))}
        </Row>
      </section>
    </>
  )
}
