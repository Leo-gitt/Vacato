import { useState } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DARK_CARD } from '@/components/dark-ui'
import { COMPANY_USERS } from '@/lib/mock-data'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/register')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (user) throw redirect({ to: '/dashboard' })
  },
  component: RegisterPage,
})

function RegisterPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleCreate = () => {
    setLoading(true)
    setTimeout(() => {
      login(COMPANY_USERS.techflow.admin, 'techflow')
      navigate({ to: '/dashboard' })
    }, 700)
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
          <p className="text-sm text-slate-300">Create your company account</p>
        </div>

        <Card className={cn(DARK_CARD, 'p-6')}>
          <h2 className="mb-1 text-sm font-semibold text-white">Company details</h2>
          <p className="mb-5 text-xs text-slate-400">Demo — pre-filled with TechFlow Solutions</p>

          <div className="space-y-3.5">
            <div>
              <Label className="text-slate-300">Company name</Label>
              <Input
                readOnly
                value="TechFlow Solutions"
                className="cursor-default border-gray-700 bg-[#1a2233] text-slate-300 focus-visible:border-gray-600 focus-visible:ring-teal-500/20"
              />
            </div>
            <div>
              <Label className="text-slate-300">Industry</Label>
              <Input
                readOnly
                value="Software / Technology"
                className="cursor-default border-gray-700 bg-[#1a2233] text-slate-300 focus-visible:border-gray-600 focus-visible:ring-teal-500/20"
              />
            </div>
            <div>
              <Label className="text-slate-300">Your name</Label>
              <Input
                readOnly
                value="Luka Trajkov"
                className="cursor-default border-gray-700 bg-[#1a2233] text-slate-300 focus-visible:border-gray-600 focus-visible:ring-teal-500/20"
              />
            </div>
            <div>
              <Label className="text-slate-300">Work email</Label>
              <Input
                readOnly
                value="luka.trajkov@techflow.io"
                className="cursor-default border-gray-700 bg-[#1a2233] text-slate-300 focus-visible:border-gray-600 focus-visible:ring-teal-500/20"
              />
            </div>

            <Button
              className="w-full justify-center gap-2"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? (
                'Creating account…'
              ) : (
                <>
                  Create account <ArrowRight size={14} strokeWidth={1.75} />
                </>
              )}
            </Button>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">Logs in as HR Admin at TechFlow Solutions</p>
        </Card>

        <button
          onClick={() => navigate({ to: '/login' })}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={13} strokeWidth={1.75} />
          Back to sign in
        </button>
      </div>
    </div>
  )
}
