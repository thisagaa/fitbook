import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { CLASS_CATEGORIES, CLASS_LEVELS } from '../types'

export type SortKey = 'date' | 'title' | 'spots'

export interface ClassFilterValues {
  search: string
  category: string
  level: string
  sort: SortKey
}

interface ClassFiltersProps {
  values: ClassFilterValues
  onChange: (values: ClassFilterValues) => void
}

export default function ClassFilters({ values, onChange }: ClassFiltersProps) {
  function update<K extends keyof ClassFilterValues>(key: K, value: ClassFilterValues[K]) {
    onChange({ ...values, [key]: value })
  }

  return (
    <search>
      <Form onSubmit={(e) => e.preventDefault()} aria-label="Search and filter classes">
        <Row className="g-3 mb-4">
          <Col xs={12} md={6} lg={4}>
            <Form.Group controlId="filter-search">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="search"
                value={values.search}
                placeholder="Title or instructor"
                onChange={(e) => update('search', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={6} md={3} lg={2}>
            <Form.Group controlId="filter-category">
              <Form.Label>Category</Form.Label>
              <Form.Select value={values.category} onChange={(e) => update('category', e.target.value)}>
                <option value="">All</option>
                {CLASS_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <Form.Group controlId="filter-level">
              <Form.Label>Level</Form.Label>
              <Form.Select value={values.level} onChange={(e) => update('level', e.target.value)}>
                <option value="">All</option>
                {CLASS_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <Form.Group controlId="filter-sort">
              <Form.Label>Sort by</Form.Label>
              <Form.Select value={values.sort} onChange={(e) => update('sort', e.target.value as SortKey)}>
                <option value="date">Date (soonest first)</option>
                <option value="title">Title (A to Z)</option>
                <option value="spots">Most spots left</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </search>
  )
}
