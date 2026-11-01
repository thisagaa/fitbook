import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as classService from '../services/classService'
import type { ClassInput, FitnessClass } from '../types'

export const queryKeys = {
  classes: ['classes'] as const,
  classDetail: (id: number) => ['classes', id] as const,
  bookings: (userId: number) => ['bookings', userId] as const,
}

export function useClasses() {
  return useQuery({ queryKey: queryKeys.classes, queryFn: classService.getClasses })
}

export function useClass(id: number) {
  return useQuery({ queryKey: queryKeys.classDetail(id), queryFn: () => classService.getClass(id) })
}

export function useBookings(userId: number) {
  return useQuery({ queryKey: queryKeys.bookings(userId), queryFn: () => classService.getBookings(userId) })
}

/** Writes a changed class into both the list cache and its detail cache so the UI updates at once. */
function useCacheWriter() {
  const queryClient = useQueryClient()
  return (updated: FitnessClass) => {
    queryClient.setQueryData<FitnessClass[]>(queryKeys.classes, (old) =>
      old?.map((c) => (c.id === updated.id ? updated : c)),
    )
    queryClient.setQueryData(queryKeys.classDetail(updated.id), updated)
  }
}

export function useCreateClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ClassInput) => classService.createClass(input),
    onSuccess: (created) => {
      queryClient.setQueryData<FitnessClass[]>(queryKeys.classes, (old) => (old ? [...old, created] : [created]))
    },
  })
}

export function useUpdateClass(id: number) {
  const writeCache = useCacheWriter()
  return useMutation({
    mutationFn: (input: ClassInput) => classService.updateClass(id, input),
    onSuccess: writeCache,
  })
}

export function useDeleteClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => classService.deleteClass(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<FitnessClass[]>(queryKeys.classes, (old) => old?.filter((c) => c.id !== id))
      queryClient.removeQueries({ queryKey: queryKeys.classDetail(id) })
      void queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export function useBookClass(userId: number) {
  const queryClient = useQueryClient()
  const writeCache = useCacheWriter()
  return useMutation({
    mutationFn: (classId: number) => classService.bookClass(classId, userId),
    onSuccess: (updated) => {
      writeCache(updated)
      void queryClient.invalidateQueries({ queryKey: queryKeys.bookings(userId) })
    },
  })
}

export function useCancelBooking(userId: number) {
  const queryClient = useQueryClient()
  const writeCache = useCacheWriter()
  return useMutation({
    mutationFn: (classId: number) => classService.cancelBooking(classId, userId),
    onSuccess: (updated) => {
      writeCache(updated)
      void queryClient.invalidateQueries({ queryKey: queryKeys.bookings(userId) })
    },
  })
}
