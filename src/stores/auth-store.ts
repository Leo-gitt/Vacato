import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CompanyId, User } from '@/lib/schemas'

interface AuthState {
  user: User | null
  companyId: CompanyId
  login: (user: User, companyId?: CompanyId) => void
  logout: () => void
  switchCompany: (companyId: CompanyId, adminUser: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      companyId: 'brainster' as CompanyId,
      login: (user, companyId = 'brainster') => set({ user, companyId }),
      logout: () => set({ user: null, companyId: 'brainster' as CompanyId }),
      switchCompany: (companyId, adminUser) => set({ companyId, user: adminUser }),
    }),
    { name: 'vacato_session' },
  ),
)
