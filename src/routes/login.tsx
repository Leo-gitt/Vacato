import { useState } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DARK_CARD } from '@/components/dark-ui'
import { USERS } from '@/lib/mock-data'
import type { Role } from '@/lib/schemas'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (user) throw redirect({ to: '/dashboard' })
  },
  component: LoginPage,
})

const ROLE_OPTIONS: Array<{ key: Role; label: string }> = [
  { key: 'student', label: 'Student' },
  { key: 'employee', label: 'Employee' },
  { key: 'admin', label: 'HR / Admin' },
]

function LoginPage() {
  const [role, setRole] = useState<Role>('student')
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const current = USERS[role]

  const handleSignIn = () => {
    login(current)
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 shadow-md shadow-teal-900/40">
              <span className="text-lg font-bold text-white">V</span>
            </div>
            <span className="text-2xl font-semibold tracking-tight text-white">Vacato</span>
          </div>
          <p className="text-sm text-slate-300">Leave management · Brainster Next College</p>
        </div>
        <Card className={cn(DARK_CARD, 'p-6')}>
          <h2 className="mb-5 text-sm font-semibold text-white">Sign in to your account</h2>
          <div className="mb-5">
            <p className="mb-2 text-xs font-medium text-slate-300">Sign in as</p>
            <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-white/[0.06] p-1">
              {ROLE_OPTIONS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRole(r.key)}
                  className={cn(
                    'cursor-pointer rounded-md py-1.5 text-xs font-medium transition-all',
                    role === r.key ? 'bg-[#3a3a3a] text-white shadow-sm' : 'text-slate-300 hover:text-stone-200',
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
          <p className="mt-4 text-center text-xs text-slate-400">Demo — select any role above</p>
        </Card>
        <p className="mt-6 text-center text-xs text-slate-400">© 2026 Brainster Next College · Vacato v1.0</p>
      </div>
    </div>
  )
}
