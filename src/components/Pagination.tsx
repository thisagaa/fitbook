import BsPagination from 'react-bootstrap/Pagination'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null
  return (
    <nav aria-label="Class list pages" className="d-flex justify-content-center mt-4">
      <BsPagination className="mb-0 flex-wrap">
        <BsPagination.Prev disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </BsPagination.Prev>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <BsPagination.Item
            key={n}
            active={n === page}
            onClick={() => onPageChange(n)}
            aria-label={`Page ${n}`}
            aria-current={n === page ? 'page' : undefined}
          >
            {n}
          </BsPagination.Item>
        ))}
        <BsPagination.Next disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </BsPagination.Next>
      </BsPagination>
    </nav>
  )
}
