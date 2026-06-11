import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CompanyId, LeaveType } from '@/lib/schemas'

export type PolicyRole = 'student' | 'employee'
export type LeavePolicy = Record<PolicyRole, Record<LeaveType, number>>

export const COMPANY_DEFAULT_POLICIES: Record<CompanyId, LeavePolicy> = {
  brainster: {
    student:  { vacation: 20, sick: 15, personal: 5 },
    employee: { vacation: 21, sick: 15, personal: 5 },
  },
  techflow: {
    student:  { vacation: 28, sick: 10, personal: 5 },
    employee: { vacation: 28, sick: 10, personal: 5 },
  },
}

// Backward-compat alias
export const DEFAULT_POLICY = COMPANY_DEFAULT_POLICIES.brainster

interface LeavePolicyState {
  policies: Record<CompanyId, LeavePolicy>
  setPolicy: (companyId: CompanyId, next: LeavePolicy) => void
}

export const useLeavePolicyStore = create<LeavePolicyState>()(
  persist(
    (set) => ({
      policies: COMPANY_DEFAULT_POLICIES,
      setPolicy: (companyId, next) =>
        set((state) => ({ policies: { ...state.policies, [companyId]: next } })),
    }),
    { name: 'vacato_leave_policy_v2' },
  ),
)
