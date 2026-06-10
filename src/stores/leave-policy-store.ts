import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { LeaveType } from '@/lib/schemas'

export type PolicyRole = 'student' | 'employee'
export type LeavePolicy = Record<PolicyRole, Record<LeaveType, number>>

interface LeavePolicyState {
  policy: LeavePolicy
  setPolicy: (next: LeavePolicy) => void
}

export const DEFAULT_POLICY: LeavePolicy = {
  student:  { vacation: 20, sick: 15, personal: 5 },
  employee: { vacation: 21, sick: 15, personal: 5 },
}

export const useLeavePolicyStore = create<LeavePolicyState>()(
  persist(
    (set) => ({
      policy: DEFAULT_POLICY,
      setPolicy: (next) => set({ policy: next }),
    }),
    { name: 'vacato_leave_policy' },
  ),
)
