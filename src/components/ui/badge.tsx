import * as React from 'react'

import { cn } from '@/lib/utils'

export const BADGE_STYLES = {
  pending: { ring: 'bg-amber-50 text-amber-700 ring-amber-200/70', dot: 'bg-amber-400' },
  approved: { ring: 'bg-green-50 text-green-700 ring-green-200/70', dot: 'bg-green-400' },
  rejected: { ring: 'bg-red-50 text-red-700 ring-red-200/70', dot: 'bg-red-400' },
  vacation: { ring: 'bg-blue-50 text-blue-700 ring-blue-200/70', dot: 'bg-blue-400' },
  sick: { ring: 'bg-rose-50 text-rose-700 ring-rose-200/70', dot: 'bg-rose-400' },
  personal: { ring: 'bg-violet-50 text-violet-700 ring-violet-200/70', dot: 'bg-violet-400' },
  student: { ring: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70', dot: 'bg-emerald-400' },
  employee: { ring: 'bg-sky-50 text-sky-700 ring-sky-200/70', dot: 'bg-sky-400' },
  admin: { ring: 'bg-violet-50 text-violet-700 ring-violet-200/70', dot: 'bg-violet-400' },
} as const

export type BadgeKind = keyof typeof BADGE_STYLES

export const BADGE_LABEL: Record<BadgeKind, string> = {
  vacation: 'Vacation',
  sick: 'Sick Leave',
  personal: 'Personal',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  student: 'Student',
  employee: 'Employee',
  admin: 'HR Admin',
}

function Badge({ kind, className, ...props }: React.ComponentProps<'span'> & { kind: BadgeKind }) {
  const style = BADGE_STYLES[kind]
  return (
    <span
      data-slot="badge"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        style.ring,
        className,
      )}
      {...props}
    >
      <span className={cn('h-1.5 w-1.5 flex-shrink-0 rounded-full', style.dot)} />
      {BADGE_LABEL[kind]}
    </span>
  )
}

export { Badge }
