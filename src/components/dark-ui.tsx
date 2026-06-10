import { cn } from '@/lib/utils'
import type { LeaveType, RequestStatus, Role } from '@/lib/schemas'

export const DARK_CARD = 'border-gray-700/40 bg-[#1f2937] shadow-lg shadow-black/30'

export const STATUS_PILL: Record<RequestStatus, { cls: string; dot: string }> = {
  pending: { cls: 'bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/30', dot: 'bg-amber-400' },
  approved: { cls: 'bg-green-500/10 text-green-400 ring-1 ring-inset ring-green-500/30', dot: 'bg-green-400' },
  rejected: { cls: 'bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/30', dot: 'bg-red-400' },
}

export const TYPE_PILL: Record<LeaveType, { cls: string; dot: string }> = {
  vacation: { cls: 'bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/30', dot: 'bg-blue-400' },
  sick: { cls: 'bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/30', dot: 'bg-rose-400' },
  personal: { cls: 'bg-violet-500/10 text-violet-400 ring-1 ring-inset ring-violet-500/30', dot: 'bg-violet-400' },
}

export const ROLE_PILL: Record<Role, { cls: string; dot: string }> = {
  student: { cls: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/30', dot: 'bg-emerald-400' },
  employee: { cls: 'bg-sky-500/10 text-sky-400 ring-1 ring-inset ring-sky-500/30', dot: 'bg-sky-400' },
  admin: { cls: 'bg-violet-500/10 text-violet-400 ring-1 ring-inset ring-violet-500/30', dot: 'bg-violet-400' },
}

export function Pill({ cls, dot, label }: { cls: string; dot: string; label: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', cls)}>
      <span className={cn('h-1.5 w-1.5 flex-shrink-0 rounded-full', dot)} />
      {label}
    </span>
  )
}
