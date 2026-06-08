import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { INITIAL_REQUESTS } from '@/lib/mock-data'
import type { LeaveRequest, NewRequestInput, ReviewAction, User } from '@/lib/schemas'

const REQUESTS_KEY = ['requests'] as const

// Simulates a backing API with an in-memory store. Replace with real fetch calls
// against the leave-management backend — the query/mutation shape stays the same.
let store: Array<LeaveRequest> = [...INITIAL_REQUESTS]

async function fetchRequests() {
  return store
}

async function createRequest(user: User, input: NewRequestInput) {
  const created: LeaveRequest = {
    id: Date.now(),
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    status: 'pending',
    submitted: new Date().toISOString().slice(0, 10),
    comment: '',
    ...input,
    days:
      Math.max(0, Math.floor((new Date(input.end).getTime() - new Date(input.start).getTime()) / 864e5)) + 1,
  }
  store = [created, ...store]
  return created
}

async function reviewRequest(requestId: number, action: ReviewAction) {
  store = store.map((r) => (r.id === requestId ? { ...r, status: action.status, comment: action.comment } : r))
  return store.find((r) => r.id === requestId)
}

export function useRequests() {
  return useQuery({
    queryKey: REQUESTS_KEY,
    queryFn: fetchRequests,
  })
}

export function useCreateRequest(user: User) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewRequestInput) => createRequest(user, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REQUESTS_KEY })
    },
  })
}

export function useReviewRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, action }: { requestId: number; action: ReviewAction }) =>
      reviewRequest(requestId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REQUESTS_KEY })
    },
  })
}
