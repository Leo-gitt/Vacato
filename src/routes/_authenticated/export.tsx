import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Download } from 'lucide-react'

import { BADGE_LABEL } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DARK_CARD, Pill, ROLE_PILL, STATUS_PILL, TYPE_PILL } from '@/components/dark-ui'
import { cn } from '@/lib/utils'
import { useRequests } from '@/hooks/use-requests'
import type { LeaveRequest, LeaveType, RequestStatus, Role } from '@/lib/schemas'

export const Route = createFileRoute('/_authenticated/export')({
  component: ExportPage,
})

type RoleFilter = 'all' | Role
type TypeFilter = 'all' | LeaveType
type StatusFilter = 'all' | RequestStatus

const ROLE_OPTIONS: Array<[RoleFilter, string]> = [
  ['all', 'All users'],
  ['employee', 'Employees'],
  ['student', 'Students'],
]
const TYPE_OPTIONS: Array<[TypeFilter, string]> = [
  ['all', 'All types'],
  ['vacation', 'Vacation'],
  ['sick', 'Sick Leave'],
  ['personal', 'Personal'],
]
const STATUS_OPTIONS: Array<[StatusFilter, string]> = [
  ['all', 'All statuses'],
  ['pending', 'Pending'],
  ['approved', 'Approved'],
  ['rejected', 'Rejected'],
]

function buildCsv(rows: Array<LeaveRequest>) {
  const header = ['Name', 'Role', 'Type', 'Start', 'End', 'Days', 'Status', 'Reason', 'Comment']
  const body = rows.map((r) => [r.userName, r.userRole, r.type, r.start, r.end, r.days, r.status, `"${r.reason}"`, `"${r.comment}"`])
  return [header, ...body].map((r) => r.join(',')).join('\n')
}

function downloadCsv(csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vacato-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function ExportPage() {
  const { data: requests = [] } = useRequests()
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filtered = requests.filter(
    (r) =>
      (roleFilter === 'all' || r.userRole === roleFilter) &&
      (typeFilter === 'all' || r.type === typeFilter) &&
      (statusFilter === 'all' || r.status === statusFilter),
  )

  const summary = [
    { label: 'Total', value: requests.length, cls: 'text-white' },
    { label: 'Pending', value: requests.filter((r) => r.status === 'pending').length, cls: 'text-amber-400' },
    { label: 'Approved', value: requests.filter((r) => r.status === 'approved').length, cls: 'text-green-400' },
    { label: 'Rejected', value: requests.filter((r) => r.status === 'rejected').length, cls: 'text-red-400' },
  ]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Export Data</h1>
          <p className="mt-0.5 text-sm text-stone-400">Download leave records as CSV for payroll and reporting</p>
        </div>
        <Button onClick={() => downloadCsv(buildCsv(filtered))}>
          <Download size={14} strokeWidth={1.75} /> Export {filtered.length} Records
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        {summary.map((s) => (
          <Card key={s.label} className={cn(DARK_CARD, 'p-5 text-center')}>
            <p className={`text-3xl font-semibold tabular-nums ${s.cls}`}>{s.value}</p>
            <p className="mt-1.5 text-xs text-stone-400">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card className={cn(DARK_CARD, 'mb-4 p-5')}>
        <p className="mb-4 text-xs font-semibold text-stone-300">Filter Export</p>
        <div className="flex flex-wrap gap-4">
          <FilterSelect label="User Type" value={roleFilter} onChange={(v) => setRoleFilter(v)} options={ROLE_OPTIONS} />
          <FilterSelect label="Leave Type" value={typeFilter} onChange={(v) => setTypeFilter(v)} options={TYPE_OPTIONS} />
          <FilterSelect label="Status" value={statusFilter} onChange={(v) => setStatusFilter(v)} options={STATUS_OPTIONS} />
        </div>
      </Card>

      <Card className={cn('overflow-hidden', DARK_CARD)}>
        <div className="border-b border-stone-800 px-5 py-3">
          <p className="text-xs text-stone-400">
            <span className="font-semibold text-white">{filtered.length}</span> records selected
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-800 bg-white/[0.02]">
                {['Name', 'Role', 'Type', 'Period', 'Days', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filtered.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-white/[0.04]">
                  <td className="px-4 py-3 font-medium text-stone-200">{r.userName}</td>
                  <td className="px-4 py-3">
                    <Pill {...ROLE_PILL[r.userRole]} label={BADGE_LABEL[r.userRole]} />
                  </td>
                  <td className="px-4 py-3">
                    <Pill {...TYPE_PILL[r.type]} label={BADGE_LABEL[r.type]} />
                  </td>
                  <td className="px-4 py-3 text-stone-400 tabular-nums">
                    {r.start} → {r.end}
                  </td>
                  <td className="px-4 py-3 font-semibold text-stone-200 tabular-nums">{r.days}d</td>
                  <td className="px-4 py-3">
                    <Pill {...STATUS_PILL[r.status]} label={BADGE_LABEL[r.status]} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-stone-500">
                    No records match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: Array<[T, string]>
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-stone-400">{label}</p>
      <Select value={value} onValueChange={(v) => onChange(v as T)}>
        <SelectTrigger className="border-stone-700 bg-[#2a2a2a] text-stone-200 hover:bg-[#2f2f2f]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border-stone-700 bg-[#2a2a2a]">
          {options.map(([val, lab]) => (
            <SelectItem key={val} value={val} className="text-stone-300 data-[highlighted]:bg-white/[0.08] data-[highlighted]:text-white">
              {lab}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
