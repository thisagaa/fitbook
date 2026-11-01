import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  children?: ReactNode
}

export default function EmptyState({ title, children }: EmptyStateProps) {
  return (
    <div className="text-center text-body-secondary py-5">
      <h2 className="h5">{title}</h2>
      {children && <div className="mt-2">{children}</div>}
    </div>
  )
}
