import { useMemo, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ClassCard from '../components/ClassCard'
import ClassFilters from '../components/ClassFilters'
import type { ClassFilterValues } from '../components/ClassFilters'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import Pagination from '../components/Pagination'
import { useClasses } from '../hooks/useClasses'
import { useDebounce } from '../hooks/useDebounce'
import type { FitnessClass } from '../types'
import { spotsLeft } from '../utils/format'

const PAGE_SIZE = 6

const DEFAULT_FILTERS: ClassFilterValues = { search: '', category: '', level: '', sort: 'date' }

function filterAndSort(classes: FitnessClass[], filters: ClassFilterValues, search: string): FitnessClass[] {
  const term = search.trim().toLowerCase()
  const matches = classes.filter(
    (c) =>
      (!term || c.title.toLowerCase().includes(term) || c.instructor.toLowerCase().includes(term)) &&
      (!filters.category || c.category === filters.category) &&
      (!filters.level || c.level === filters.level),
  )
  return [...matches].sort((a, b) => {
    if (filters.sort === 'title') return a.title.localeCompare(b.title)
    if (filters.sort === 'spots') return spotsLeft(b.capacity, b.booked) - spotsLeft(a.capacity, a.booked)
    return a.startsAt.localeCompare(b.startsAt)
  })
}

export default function ClassListPage() {
  const { data, isPending, isError, error, refetch } = useClasses()
  const [filters, setFilters] = useState<ClassFilterValues>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(filters.search)

  const results = useMemo(
    () => (data ? filterAndSort(data, filters, debouncedSearch) : []),
    [data, filters, debouncedSearch],
  )

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleFilterChange(next: ClassFilterValues) {
    setFilters(next)
    setPage(1)
  }

  return (
    <>
      <h1>Classes</h1>
      <ClassFilters values={filters} onChange={handleFilterChange} />

      {isPending && <LoadingSpinner label="Loading classes..." />}
      {isError && <ErrorMessage message={error.message} onRetry={() => void refetch()} />}

      {data && data.length === 0 && <EmptyState title="No classes have been scheduled yet." />}
      {data && data.length > 0 && results.length === 0 && (
        <EmptyState title="No classes match your search.">
          <button type="button" className="btn btn-link" onClick={() => handleFilterChange(DEFAULT_FILTERS)}>
            Clear filters
          </button>
        </EmptyState>
      )}

      {visible.length > 0 && (
        <>
          <p aria-live="polite" className="text-body-secondary">
            Showing {visible.length} of {results.length} {results.length === 1 ? 'class' : 'classes'}
          </p>
          <Row as="ul" className="g-3 list-unstyled" xs={1} md={2} lg={3}>
            {visible.map((c) => (
              <Col as="li" key={c.id}>
                <ClassCard fitnessClass={c} />
              </Col>
            ))}
          </Row>
          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </>
  )
}
