import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  Download,
  FileText,
  Settings2,
  Shield,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (user) throw redirect({ to: '/dashboard' })
  },
  component: LandingPage,
})

const FEATURES = [
  {
    icon: FileText,
    title: 'Smart Leave Requests',
    description:
      'Employees submit requests in seconds. Managers approve or decline with one click. Everyone stays in the loop automatically.',
    iconColor: 'text-teal-400',
    iconBg: 'bg-teal-500/10',
    border: 'hover:border-teal-800/60',
  },
  {
    icon: Settings2,
    title: 'Flexible Policy Control',
    description:
      'Set vacation, sick, and personal day limits per role. Changes take effect immediately across your whole organisation.',
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10',
    border: 'hover:border-violet-800/60',
  },
  {
    icon: CalendarDays,
    title: 'Team Calendar & Reports',
    description:
      "See who's away at a glance. Export clean CSV reports for payroll, compliance, or any HR review — in one click.",
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    border: 'hover:border-blue-800/60',
  },
]

const STATS = [
  { value: '500+', label: 'Companies using Vacato' },
  { value: '50k+', label: 'Leave requests processed' },
  { value: '99.9%', label: 'Platform uptime' },
]

const CHECKLIST = [
  'Employee & student role support',
  'Configurable leave policies per role',
  'Approval workflow with comments',
  'Team calendar overview',
  'CSV export for payroll & HR',
]

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(45,212,191,0.22) 0%, rgba(34,211,238,0.10) 38%, #0d1117 68%), #0d1117',
      }}
    >
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-28 text-center">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-2xl shadow-teal-900/50">
            <CalendarDays size={30} strokeWidth={1.5} className="text-white" />
            <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0d1117] ring-2 ring-[#0d1117]">
              <CheckCircle size={14} strokeWidth={2} className="text-teal-400" />
            </div>
          </div>
          <span className="text-3xl font-bold tracking-tight text-white">Vacato</span>
        </div>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-medium text-teal-300">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          Modern leave management platform
        </div>

        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
          Leave management your team{' '}
          <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            will actually use.
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-300">
          Automate time-off requests, track leave balances, and enforce policy — all from one clean, modern dashboard your whole team will love.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => navigate({ to: '/register' })}
            className="gap-2 bg-teal-600 px-8 py-3 text-base font-semibold shadow-lg shadow-teal-950/50 transition-all duration-200 hover:scale-[1.02] hover:bg-teal-500"
          >
            Create company account <ArrowRight size={16} strokeWidth={1.75} />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => navigate({ to: '/login' })}
            className="gap-2 border border-gray-700 px-8 py-3 text-base font-semibold text-slate-200 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
          >
            Sign in to existing account
          </Button>
        </div>

        <p className="mt-5 text-xs text-slate-500">No credit card required · Free demo · Set up in 2 minutes</p>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={cn(
                'rounded-2xl border border-gray-800 bg-[#111827] p-6 transition-colors duration-200',
                f.border,
              )}
            >
              <div className={cn('mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl', f.iconBg)}>
                <f.icon size={18} strokeWidth={1.75} className={f.iconColor} />
              </div>
              <h3 className="mb-2 text-base font-semibold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Split section: checklist + stats */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Checklist */}
          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-8">
            <p className="mb-1 text-xs font-semibold tracking-widest text-teal-400 uppercase">Everything you need</p>
            <h2 className="mb-6 text-2xl font-bold text-white">Built for growing teams</h2>
            <ul className="space-y-3">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle size={16} strokeWidth={1.75} className="flex-shrink-0 text-teal-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div className="flex flex-col justify-between gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-gray-800 bg-[#111827] px-6 py-5">
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="relative overflow-hidden rounded-2xl border border-teal-800/40 bg-gradient-to-br from-teal-950/60 via-[#0d1117] to-[#0d1117] px-10 py-12 text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="relative">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600">
              <Shield size={18} strokeWidth={1.75} className="text-white" />
            </div>
            <h2 className="mb-3 text-3xl font-bold text-white">Ready to get started?</h2>
            <p className="mx-auto mb-8 max-w-md text-slate-300">
              Set up your company account in minutes. Invite your team and go live today.
            </p>
            <Button
              size="lg"
              onClick={() => navigate({ to: '/register' })}
              className="gap-2 bg-teal-600 px-8 py-3 text-base font-semibold shadow-lg shadow-teal-950/50 transition-all duration-200 hover:scale-[1.02] hover:bg-teal-500"
            >
              Create company account <ArrowRight size={16} strokeWidth={1.75} />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
              <CalendarDays size={13} strokeWidth={1.5} className="text-white" />
            </div>
            <span className="text-sm font-medium text-slate-300">Vacato</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 Brainster Next College · v1.0</p>
          <div className="flex items-center gap-5 text-sm text-slate-500">
            <Users size={14} strokeWidth={1.75} className="inline" /> 500+ companies
            <Download size={14} strokeWidth={1.75} className="inline" /> 50k+ requests
          </div>
        </div>
      </footer>
    </div>
  )
}
