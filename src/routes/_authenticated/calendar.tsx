import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { DARK_CARD } from '@/components/dark-ui'
import { useRequests } from '@/hooks/use-requests'
import { BADGE_LABEL } from '@/components/ui/badge'
import type { LeaveRequest, LeaveType } from '@/lib/schemas'
import { Route as AuthRoute } from '@/routes/_authenticated'
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
  const { data: requests = [] } = useRequests()
  const today = new Date()
  const [month, setMonth] = useState(5)
  const [year, setYear] = useState(2026)

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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          <p className="mt-0.5 text-sm text-stone-400">
            Approved absences — {MONTHS[month]} {year}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex gap-3 text-xs text-stone-400">
            {LEGEND.map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className={cn('inline-block h-2 w-2 rounded-full', l.color)} />
                {l.label}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={prev} className="cursor-pointer rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-white/[0.06] hover:text-white">
              <ChevronLeft size={16} strokeWidth={1.75} />
            </button>
            <span className="w-36 text-center text-sm font-semibold text-white">
              {MONTHS[month]} {year}
            </span>
            <button onClick={next} className="cursor-pointer rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-white/[0.06] hover:text-white">
              <ChevronRight size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
      <Card className={cn('overflow-hidden', DARK_CARD)}>
        <div className="grid grid-cols-7 border-b border-stone-800">
          {WEEKDAYS.map((d, i) => (
            <div
              key={d}
              className={cn(
                'py-3 text-center text-[11px] font-semibold tracking-wide uppercase',
                i === 0 || i === 6 ? 'text-stone-600' : 'text-stone-500',
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
            return (
              <div
                key={i}
                className={cn(
                  'min-h-24 border-stone-800 p-2 transition-colors',
                  i % 7 !== 6 && 'border-r',
                  !lastRow && 'border-b',
                  !day ? 'bg-white/[0.015]' : weekend ? 'bg-white/[0.01]' : 'hover:bg-white/[0.04]',
                )}
              >
                {day && (
                  <>
                    <span
                      className={cn(
                        'mb-1 flex h-7 w-7 items-center justify-center rounded-full text-sm',
                        today_ ? 'bg-indigo-600 font-semibold text-white shadow-md shadow-indigo-950/40' : weekend ? 'text-stone-600' : 'text-stone-300',
                      )}
                    >
                      {day}
                    </span>
                    <div className="space-y-1">
                      {leaves.slice(0, 2).map((l, li) => (
                        <div
                          key={li}
                          title={`${l.userName} — ${l.type}`}
                          className={cn('truncate rounded px-1.5 py-0.5 text-[11px] leading-tight font-medium', LEAF_CLS[l.type])}
                        >
                          {user.role !== 'student' ? l.userName.split(' ')[0] : BADGE_LABEL[l.type]}
                        </div>
                      ))}
                      {leaves.length > 2 && <p className="px-1 text-[10px] text-stone-500">+{leaves.length - 2} more</p>}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
