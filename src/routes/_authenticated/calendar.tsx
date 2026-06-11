import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { BADGE_LABEL } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DARK_CARD, Pill, TYPE_PILL } from '@/components/dark-ui'
import { useRequests } from '@/hooks/use-requests'
import { COMPANIES } from '@/lib/mock-data'
import type { LeaveRequest, LeaveType } from '@/lib/schemas'
import { Route as AuthRoute } from '@/routes/_authenticated'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_authenticated/calendar')({
  component: CalendarPage,
})

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const LEGEND: Array<{ color: string; label: string }> = [
  { color: 'bg-blue-400', label: 'Vacation' },
  { color: 'bg-rose-400', label: 'Sick Leave' },
  { color: 'bg-violet-400', label: 'Personal' },
]

const LEAF_CLS: Record<LeaveType, string> = {
  vacation: 'bg-blue-500/15 text-blue-400',
  sick: 'bg-rose-500/15 text-rose-400',
  personal: 'bg-violet-500/15 text-violet-400',
}

function CalendarPage() {
  const { user } = AuthRoute.useRouteContext()
  const { companyId } = useAuthStore()
  const hasStudents = COMPANIES[companyId].studentCount > 0
  const { data: requests = [] } = useRequests()
  const today = new Date()
  const [month, setMonth] = useState(5)
  const [year, setYear] = useState(2026)
  const [popupDay, setPopupDay] = useState<{ day: number; leaves: Array<LeaveRequest> } | null>(null)

  const approved = requests.filter((r) => r.status === 'approved')

  const prev = () => {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }
  const next = () => {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<number | null> = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const getLeaves = (day: number | null): Array<LeaveRequest> => {
    if (!day) return []
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const pool = user.role === 'student' ? approved.filter((r) => r.userId === user.id) : approved
    return pool.filter((r) => ds >= r.start && ds <= r.end)
  }

  const isToday = (day: number | null) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const title = user.role === 'admin' ? 'College Calendar' : user.role === 'employee' ? 'Team Calendar' : 'My Calendar'

  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')
  const in14 = new Date(today.getTime() + 14 * 86400000)
  const in14Str = [
    in14.getFullYear(),
    String(in14.getMonth() + 1).padStart(2, '0'),
    String(in14.getDate()).padStart(2, '0'),
  ].join('-')
  const summaryPool = user.role === 'student' ? approved.filter((r) => r.userId === user.id) : approved
  const currentlyOut = summaryPool.filter((r) => r.start <= todayStr && r.end >= todayStr)
  const upcoming14 = summaryPool
    .filter((r) => r.start > todayStr && r.start <= in14Str)
    .sort((a, b) => a.start.localeCompare(b.start))
  const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`
  const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const monthRequests = summaryPool.filter((r) => r.start <= monthEnd && r.end >= monthStart)
  const monthTotalDays = monthRequests.reduce((acc, r) => acc + r.days, 0)
  const byType: Record<LeaveType, number> = { vacation: 0, sick: 0, personal: 0 }
  monthRequests.forEach((r) => { byType[r.type] += r.days })
  const maxTypeVal = Math.max(...Object.values(byType), 1)
  const fmt = (s: string) => {
    const [, m, d] = s.split('-')
    return `${MONTHS[Number(m) - 1].slice(0, 3)} ${Number(d)}`
  }
  const daysFromToday = (s: string) =>
    Math.ceil((new Date(s).getTime() - today.getTime()) / 86400000)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          <p className="mt-0.5 text-sm text-slate-300">
            Approved absences — {MONTHS[month]} {year}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex gap-3 text-xs text-slate-300">
            {LEGEND.map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className={cn('inline-block h-2 w-2 rounded-full', l.color)} />
                {l.label}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={prev} className="cursor-pointer rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white">
              <ChevronLeft size={16} strokeWidth={1.75} />
            </button>
            <span className="w-36 text-center text-sm font-semibold text-white">
              {MONTHS[month]} {year}
            </span>
            <button onClick={next} className="cursor-pointer rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white">
              <ChevronRight size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
      <Card className={cn('overflow-hidden', DARK_CARD)}>
        <div className="grid grid-cols-7 border-b border-gray-800">
          {WEEKDAYS.map((d, i) => (
            <div
              key={d}
              className={cn(
                'py-3 text-center text-[11px] font-semibold tracking-wide uppercase',
                i === 0 || i === 6 ? 'text-slate-500' : 'text-slate-400',
              )}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const leaves = getLeaves(day)
            const weekend = i % 7 === 0 || i % 7 === 6
            const today_ = isToday(day)
            const lastRow = i >= cells.length - 7
            const clickable = !!day && leaves.length > 0
            return (
              <div
                key={i}
                onClick={() => clickable && setPopupDay({ day, leaves })}
                className={cn(
                  'min-h-24 border-gray-800 p-2 transition-colors',
                  i % 7 !== 6 && 'border-r',
                  !lastRow && 'border-b',
                  !day ? 'bg-white/[0.015]' : weekend ? 'bg-white/[0.01]' : 'hover:bg-white/[0.04]',
                  clickable && 'cursor-pointer',
                )}
              >
                {day && (
                  <>
                    <span
                      className={cn(
                        'mb-1 flex h-7 w-7 items-center justify-center rounded-full text-sm',
                        today_ ? 'bg-teal-600 font-semibold text-white shadow-md shadow-teal-950/40' : weekend ? 'text-slate-500' : 'text-stone-300',
                      )}
                    >
                      {day}
                    </span>
                    <div className="space-y-1">
                      {leaves.slice(0, 2).map((l, li) => (
                        <div
                          key={li}
                          className={cn('truncate rounded px-1.5 py-0.5 text-[11px] leading-tight font-medium', LEAF_CLS[l.type])}
                        >
                          {user.role !== 'student' ? l.userName.split(' ')[0] : BADGE_LABEL[l.type]}
                        </div>
                      ))}
                      {leaves.length > 2 && (
                        <p className="px-1 text-[10px] font-medium text-slate-400 hover:text-slate-300">
                          +{leaves.length - 2} more
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Summary */}
      <div className="mt-6 space-y-4">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-rose-400">Out Today</p>
            <p className="text-3xl font-bold text-white">{currentlyOut.length}</p>
            <p className="mt-1 text-xs text-slate-500">
              {currentlyOut.length === 0 ? 'Everyone is in' : `${currentlyOut.length} ${currentlyOut.length === 1 ? 'person' : 'people'} absent`}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-amber-400">Next 14 Days</p>
            <p className="text-3xl font-bold text-white">{upcoming14.length}</p>
            <p className="mt-1 text-xs text-slate-500">
              {upcoming14.length === 0 ? 'No absences planned' : `upcoming ${upcoming14.length === 1 ? 'absence' : 'absences'}`}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-teal-400">{MONTHS[month]} — Total</p>
            <p className="text-3xl font-bold text-white">{monthTotalDays}</p>
            <p className="mt-1 text-xs text-slate-500">approved days off</p>
          </div>
        </div>

        {/* Currently Out + Upcoming */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-5">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Currently Out</p>
            {currentlyOut.length === 0 ? (
              <p className="text-sm text-slate-500">Everyone is in today.</p>
            ) : (
              <div className="space-y-3">
                {currentlyOut.map((r) => (
                  <div key={r.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1e293b] text-[10px] font-bold text-stone-300">
                      {r.userName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-stone-200">{r.userName}</p>
                      <p className="text-xs text-slate-400">
                        {daysFromToday(r.end) === 0 ? 'Back tomorrow' : `Unavailable until ${fmt(r.end)}`}
                      </p>
                    </div>
                    <Pill {...TYPE_PILL[r.type]} label={BADGE_LABEL[r.type]} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-5">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Coming Up</p>
            {upcoming14.length === 0 ? (
              <p className="text-sm text-slate-500">No absences in the next 14 days.</p>
            ) : (
              <div className="space-y-3">
                {upcoming14.map((r) => {
                  const d = daysFromToday(r.start)
                  return (
                    <div key={r.id} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1e293b] text-[10px] font-bold text-stone-300">
                        {r.userName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-stone-200">{r.userName}</p>
                        <p className="text-xs text-slate-400">
                          {fmt(r.start)} → {fmt(r.end)} · {d === 1 ? 'tomorrow' : `in ${d} days`}
                        </p>
                      </div>
                      <Pill {...TYPE_PILL[r.type]} label={BADGE_LABEL[r.type]} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Leave type breakdown */}
        <div className="rounded-2xl border border-gray-800 bg-[#111827] p-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Leave Breakdown — {MONTHS[month]} {year}
          </p>
          <div className="grid grid-cols-3 gap-6">
            {(['vacation', 'sick', 'personal'] as Array<LeaveType>).map((type) => (
              <div key={type}>
                <div className="mb-2 flex items-center justify-between">
                  <Pill {...TYPE_PILL[type]} label={BADGE_LABEL[type]} />
                  <span className="text-sm font-bold tabular-nums text-stone-200">{byType[type]}d</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-700',
                      type === 'vacation' ? 'bg-blue-500' : type === 'sick' ? 'bg-rose-500' : 'bg-violet-500',
                    )}
                    style={{ width: `${(byType[type] / maxTypeVal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={popupDay !== null} onOpenChange={(next) => !next && setPopupDay(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {popupDay && `${MONTHS[month]} ${popupDay.day}, ${year}`} — {popupDay?.leaves.length} absent
            </DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-2">
            {popupDay?.leaves.map((l) => (
              <div key={l.id} className="flex items-start gap-3 rounded-lg border border-gray-800 bg-white/[0.03] px-3.5 py-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1e293b] text-[10px] font-bold text-stone-300">
                  {l.userName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-semibold text-stone-200">{l.userName}</p>
                    <Pill {...TYPE_PILL[l.type]} label={BADGE_LABEL[l.type]} />
                    {hasStudents && (
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset',
                          l.userRole === 'student'
                            ? 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30'
                            : 'bg-sky-500/15 text-sky-400 ring-sky-500/30',
                        )}
                      >
                        {l.userRole === 'student' ? 'Student' : 'Employee'}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{l.reason}</p>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-1">
              <Button variant="secondary" onClick={() => setPopupDay(null)}>Close</Button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  )
}
