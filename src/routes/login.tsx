import { useState } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DARK_CARD } from '@/components/dark-ui'
import { COMPANIES, COMPANY_USERS } from '@/lib/mock-data'
import type { CompanyId, Role } from '@/lib/schemas'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (user) throw redirect({ to: '/dashboard' })
  },
  component: LoginPage,
})

const ALL_ROLES: Array<{ key: Role; label: string }> = [
  { key: 'student', label: 'Student' },
  { key: 'employee', label: 'Employee' },
  { key: 'admin', label: 'HR / Admin' },
]

const COMPANY_OPTIONS: Array<{ id: CompanyId; accentBg: string; accentRing: string }> = [
  { id: 'brainster', accentBg: 'bg-teal-600',   accentRing: 'ring-teal-500'   },
  { id: 'techflow',  accentBg: 'bg-violet-600', accentRing: 'ring-violet-500' },
]

function LoginPage() {
  const [companyId, setCompanyId] = useState<CompanyId>('brainster')
  const [role, setRole] = useState<Role>('student')
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const hasStudents = COMPANIES[companyId].studentCount > 0
  const roleOptions = hasStudents ? ALL_ROLES : ALL_ROLES.filter((r) => r.key !== 'student')
  const effectiveRole: Role = !hasStudents && role === 'student' ? 'employee' : role
  const current = COMPANY_USERS[companyId][effectiveRole]

  const handleCompanyChange = (id: CompanyId) => {
    setCompanyId(id)
    if (!COMPANIES[id].studentCount && role === 'student') setRole('employee')
  }

  const handleSignIn = () => {
    login(current, companyId)
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md shadow-teal-900/40">
              <CalendarDays size={18} strokeWidth={1.5} className="text-white" />
              <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0d1117] ring-2 ring-[#0d1117]">
                <CheckCircle size={11} strokeWidth={2.5} className="text-teal-400" />
              </div>
            </div>
            <span className="text-2xl font-semibold tracking-tight text-white">Vacato</span>
          </div>
          <p className="text-sm text-slate-300">Leave management · {COMPANIES[companyId].name}</p>
        </div>
        <Card className={cn(DARK_CARD, 'p-6')}>
          <h2 className="mb-5 text-sm font-semibold text-white">Sign in to your account</h2>

          <div className="mb-5">
            <p className="mb-2 text-xs font-medium text-slate-300">Company</p>
            <div className="grid grid-cols-2 gap-2">
              {COMPANY_OPTIONS.map(({ id, accentBg, accentRing }) => (
                <button
                  key={id}
                  onClick={() => handleCompanyChange(id)}
                  className={cn(
                    'cursor-pointer rounded-lg border px-3 py-2.5 text-left transition-all',
                    companyId === id
                      ? `border-transparent ${accentBg}/20 ring-1 ${accentRing}/60`
                      : 'border-gray-700 bg-white/[0.03] hover:bg-white/[0.06]',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn('flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white', accentBg)}>
                      {COMPANIES[id].logo}
                    </div>
                    <span className="text-xs font-medium text-stone-200 leading-tight">{COMPANIES[id].name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="mb-2 text-xs font-medium text-slate-300">Sign in as</p>
            <div className={cn('gap-1.5 rounded-lg bg-white/[0.06] p-1', roleOptions.length === 2 ? 'grid grid-cols-2' : 'grid grid-cols-3')}>
              {roleOptions.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRole(r.key)}
                  className={cn(
                    'cursor-pointer rounded-md py-1.5 text-xs font-medium transition-all',
                    effectiveRole === r.key ? 'bg-[#3a3a3a] text-white shadow-sm' : 'text-slate-300 hover:text-stone-200',
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <Label className="text-slate-300">Email address</Label>
              <Input
                readOnly
                value={current.email}
                className="cursor-default border-gray-700 bg-[#1a2233] text-slate-300 placeholder:text-slate-500 focus-visible:border-gray-600 focus-visible:ring-teal-500/20"
              />
            </div>
            <div>
              <Label className="text-slate-300">Password</Label>
              <Input
                type="password"
                readOnly
                defaultValue="password"
                className="border-gray-700 bg-[#1a2233] text-stone-200 placeholder:text-slate-500 focus-visible:border-gray-600 focus-visible:ring-teal-500/20"
              />
            </div>
            <Button className="w-full justify-center" onClick={handleSignIn}>
              Sign in <ArrowRight size={14} strokeWidth={1.75} />
            </Button>
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">Demo — select a company and role above</p>
        </Card>

        <div className="mt-5 text-center">
          <p className="text-sm text-slate-400">
            New to Vacato?{' '}
            <button
              onClick={() => navigate({ to: '/register' })}
              className="cursor-pointer font-medium text-teal-400 transition-colors hover:text-teal-300"
            >
              Create a company account
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate({ to: '/' })}
            className="cursor-pointer text-xs text-slate-500 transition-colors hover:text-slate-400"
          >
            ← Back to landing page
          </button>
        </div>
      </div>
    </div>
  )
}
