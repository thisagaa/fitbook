import { useNavigate, useParams } from 'react-router-dom'
import ClassForm from '../components/ClassForm'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import { useClass, useCreateClass, useUpdateClass } from '../hooks/useClasses'
import type { ClassInput } from '../types'

/** Create form: /classes/new */
export function CreateClassPage() {
  const navigate = useNavigate()
  const create = useCreateClass()

  function handleSubmit(input: ClassInput) {
    create.mutate(input, { onSuccess: (created) => navigate(`/classes/${created.id}`) })
  }

  return (
    <>
      <h1>Add a class</h1>
      {create.isError && <ErrorMessage message={create.error.message} />}
      <ClassForm submitLabel="Create class" submitting={create.isPending} onSubmit={handleSubmit} />
    </>
  )
}

/** Edit form: /classes/:id/edit, pre-populated with the existing class. */
export function EditClassPage() {
  const classId = Number(useParams().id)
  const navigate = useNavigate()
  const { data, isPending, isError, error, refetch } = useClass(classId)
  const update = useUpdateClass(classId)

  if (isPending) return <LoadingSpinner label="Loading class..." />
  if (isError) return <ErrorMessage message={error.message} onRetry={() => void refetch()} />

  const { id: _id, booked, ...initialValues } = data

  function handleSubmit(input: ClassInput) {
    update.mutate(input, { onSuccess: () => navigate(`/classes/${classId}`) })
  }

  return (
    <>
      <h1>Edit class</h1>
      {update.isError && <ErrorMessage message={update.error.message} />}
      <ClassForm
        initialValues={initialValues}
        minCapacity={booked}
        submitLabel="Save changes"
        submitting={update.isPending}
        onSubmit={handleSubmit}
      />
    </>
  )
}
