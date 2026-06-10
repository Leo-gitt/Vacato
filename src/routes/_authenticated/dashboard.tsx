import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  CheckCircle,
  Clock,
  GraduationCap,
  Plus,
  Sun,
  Thermometer,
  User as UserIcon,
  Users

} from 'lucide-react'
import type {LucideIcon} from 'lucide-react';

import { BADGE_LABEL } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DARK_CARD, Pill, STATUS_PILL, TYPE_PILL } from '@/components/dark-ui'
import { NewRequestModal } from '@/components/new-request-modal'
import { StatCard  } from '@/components/stat-card'
import type {StatColor} from '@/components/stat-card';
import { useCreateRequest, useRequests } from '@/hooks/use-requests'
import { LEAVE_BALANCE } from '@/lib/mock-data'
import { useLeavePolicyStore } from '@/stores/leave-policy-store'
import type { LeaveRequest, LeaveType } from '@/lib/schemas'
import { Route as AuthRoute } from '@/routes/_authenticated'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

const TYPE_BG: Record<LeaveType, string> = {
  vacation: 'bg-blue-500/15 text-blue-400',
  sick: 'bg-rose-500/15 text-rose-400',
  personal: 'bg-violet-500/15 text-violet-400',
}
const TYPE_ICON: Record<LeaveType, LucideIcon> = { vacation: Sun, sick: Thermometer, personal: UserIcon }

const BALANCE_CARDS: Array<{ key: LeaveType; label: string; icon: LucideIcon; cls: string; bg: string; bar: string }> = [
  { key: 'vacation', label: 'Vacation', icon: Sun, cls: 'text-blue-400', bg: 'bg-blue-500/15', bar: 'bg-blue-500' },
  { key: 'sick', label: 'Sick Leave', icon: Thermometer, cls: 'text-rose-400', bg: 'bg-rose-500/15', bar: 'bg-rose-500' },
  { key: 'personal', label: 'Personal', icon: UserIcon, cls: 'text-violet-400', bg: 'bg-violet-500/15', bar: 'bg-violet-500' },
]

function DashboardPage() {
  const { user } = AuthRoute.useRouteContext()
  const navigate = useNavigate()
  const { data: requests = [] } = useRequests()
  const createRequest = useCreateRequest(user)
  const [modalOpen, setModalOpen] = useState(false)

  const { policy } = useLeavePolicyStore()
  const mine = requests.filter((r) => r.userId === user.id)
  const balance = user.role === 'admin' ? null : (() => {
    const role = user.role as 'student' | 'employee'
    const used = LEAVE_BALANCE[role]
    const totals = policy[role]
    return {
      vacation: { total: totals.vacation, used: used.vacation.used },
      sick:     { total: totals.sick,     used: used.sick.used     },
      personal: { total: totals.personal, used: used.personal.used },
    }
  })()

  const stats: Array<{ label: string; value: number; sub: string; color: StatColor; icon: LucideIcon; used?: number; total?: number }> = balance
    ? [
        { label: 'Vacation Left', value: balance.vacation.total - balance.vacation.used, sub: `${balance.vacation.used} of ${balance.vacation.total} used`, color: 'blue', icon: Sun, used: balance.vacation.used, total: balance.vacation.total },
        { label: 'Sick Days Left', value: balance.sick.total - balance.sick.used, sub: `${balance.sick.used} of ${balance.sick.total} used`, color: 'red', icon: Thermometer, used: balance.sick.used, total: balance.sick.total },
        { label: 'Personal Left', value: balance.personal.total - balance.personal.used, sub: `${balance.personal.used} of ${balance.personal.total} used`, color: 'violet', icon: UserIcon, used: balance.personal.used, total: balance.personal.total },
        { label: 'Pending', value: mine.filter((r) => r.status === 'pending').length, sub: 'Awaiting approval', color: 'amber', icon: Clock },
      ]
    : [
        { label: 'Pending', value: requests.filter((r) => r.status === 'pending').length, sub: 'Awaiting your review', color: 'amber', icon: Clock },
        { label: 'Approved', value: requests.filter((r) => r.status === 'approved').length, sub: 'Total this year', color: 'green', icon: CheckCircle },
        { label: 'Employees', value: 24, sub: '3 away this week', color: 'blue', icon: Users },
        { label: 'Students', value: 186, sub: '11 away this week', color: 'stone', icon: GraduationCap },
      ]

  const isAdmin = user.role === 'admin'
  const recent: Array<LeaveRequest> = isAdmin ? requests.slice(0, 6) : mine.slice(0, 5)
  const todayStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Good morning, {user.name.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-slate-300">{todayStr}</p>
        </div>
        {!isAdmin && (
          <Button
            onClick={() => setModalOpen(true)}
            size="lg"
            className="gap-2 bg-teal-600 px-6 py-3 text-base font-semibold shadow-lg shadow-teal-950/40 transition-all duration-200 hover:scale-[1.03] hover:bg-teal-500 hover:shadow-xl hover:shadow-teal-900/40"
          >
            <Plus size={18} strokeWidth={2} /> New Request
          </Button>
        )}
      </div>

      <div className="mb-6 grid grid-cols-4 gap-5">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Card className={cn('col-span-2 overflow-hidden', DARK_CARD)}>
          <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
            <h2 className="text-base font-semibold text-white">{isAdmin ? 'Recent Requests' : 'My Recent Requests'}</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-white/[0.06] hover:text-white"
              onClick={() => navigate({ to: '/requests' })}
            >
              View all <ArrowRight size={12} strokeWidth={1.75} />
            </Button>
          </div>
          <div className="divide-y divide-gray-800">
            {recent.map((r) => {
              const TypeIcon = TYPE_ICON[r.type]
              return (
                <div key={r.id} className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.04]">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className={cn('flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg', TYPE_BG[r.type])}>
                      <TypeIcon size={15} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      {isAdmin && (
                        <p className="text-xs font-semibold text-stone-300">
                          {r.userName} <span className="font-normal text-slate-400 capitalize">({r.userRole})</span>
                        </p>
                      )}
                      <p className="text-sm font-medium text-stone-200">{BADGE_LABEL[r.type]}</p>
                      <p className="text-xs text-slate-400 tabular-nums">
                        {r.start} → {r.end} · {r.days}d
                      </p>
                    </div>
                  </div>
                  <Pill {...STATUS_PILL[r.status]} label={BADGE_LABEL[r.status]} />
                </div>
              )
            })}
            {recent.length === 0 && <div className="px-5 py-10 text-center text-sm text-slate-400">No requests yet.</div>}
          </div>
        </Card>

        <div className="space-y-4">
          {balance ? (
            BALANCE_CARDS.map(({ key, label, icon: Icon, cls, bg, bar }) => {
              const b = balance[key]
              const pct = Math.round((b.used / b.total) * 100)
              return (
                <Card key={key} className={cn(DARK_CARD, 'p-5')}>
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', bg)}>
                      <Icon size={15} strokeWidth={1.75} className={cls} />
                    </div>
                    <p className="flex-1 text-sm font-semibold text-stone-200">{label}</p>
                    <p className="text-sm font-semibold text-white">
                      {b.total - b.used} <span className="font-normal text-slate-400">left</span>
                    </p>
                  </div>
                  <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-gray-800">
                    <div className={cn('h-full rounded-full transition-all', bar)} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {b.used} of {b.total} days used
                    </span>
                    <span className="font-semibold text-stone-300">{pct}%</span>
                  </div>
                </Card>
              )
            })
          ) : (
            <>
              <Card className={cn(DARK_CARD, 'p-5')}>
                <p className="mb-3 text-[10px] font-semibold tracking-widest text-slate-300 uppercase">By Type</p>
                {(['vacation', 'sick', 'personal'] as const).map((t) => (
                  <div key={t} className="flex items-center justify-between py-1.5">
                    <Pill {...TYPE_PILL[t]} label={BADGE_LABEL[t]} />
                    <span className="text-sm font-semibold text-white tabular-nums">
                      {requests.filter((r) => r.type === t).length}
                    </span>
                  </div>
                ))}
              </Card>
              <Card className={cn(DARK_CARD, 'p-5')}>
                <p className="mb-3 text-[10px] font-semibold tracking-widest text-slate-300 uppercase">By Status</p>
                {(['pending', 'approved', 'rejected'] as const).map((s) => (
                  <div key={s} className="flex items-center justify-between py-1.5">
                    <Pill {...STATUS_PILL[s]} label={BADGE_LABEL[s]} />
                    <span className="text-sm font-semibold text-white tabular-nums">
                      {requests.filter((r) => r.status === s).length}
                    </span>
                  </div>
                ))}
              </Card>
            </>
          )}
        </div>
      </div>

      <NewRequestModal open={modalOpen} onOpenChange={setModalOpen} onSubmit={(input) => createRequest.mutate(input)} />
    </div>
  )
}
