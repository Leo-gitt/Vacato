import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { COMPANY_REQUESTS } from '@/lib/mock-data'
import type { CompanyId, LeaveRequest, NewRequestInput, ReviewAction, User } from '@/lib/schemas'
import { useAuthStore } from '@/stores/auth-store'

// Per-company in-memory stores. Replace with real API calls — query/mutation shape stays the same.
const stores: Record<CompanyId, Array<LeaveRequest>> = {
  brainster: [...COMPANY_REQUESTS.brainster],
  techflow: [...COMPANY_REQUESTS.techflow],
}

async function fetchRequests(companyId: CompanyId) {
  return stores[companyId]
}

async function createRequest(companyId: CompanyId, user: User, input: NewRequestInput) {
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
  stores[companyId] = [created, ...stores[companyId]]
  return created
}

async function reviewRequest(companyId: CompanyId, requestId: number, action: ReviewAction) {
  stores[companyId] = stores[companyId].map((r) =>
    r.id === requestId ? { ...r, status: action.status, comment: action.comment } : r,
  )
  return stores[companyId].find((r) => r.id === requestId)
}

export function useRequests() {
  const companyId = useAuthStore((s) => s.companyId)
  return useQuery({
    queryKey: ['requests', companyId],
    queryFn: () => fetchRequests(companyId),
  })
}

export function useCreateRequest(user: User) {
  const companyId = useAuthStore((s) => s.companyId)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewRequestInput) => createRequest(companyId, user, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', companyId] })
    },
  })
}

export function useReviewRequest() {
  const companyId = useAuthStore((s) => s.companyId)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, action }: { requestId: number; action: ReviewAction }) =>
      reviewRequest(companyId, requestId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', companyId] })
    },
  })
}
