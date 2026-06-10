import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle, GraduationCap, Sun, Thermometer, User as UserIcon, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DARK_CARD } from '@/components/dark-ui'
import type { LeaveType } from '@/lib/schemas'
import { useLeavePolicyStore } from '@/stores/leave-policy-store'
import type { LeavePolicy, PolicyRole } from '@/stores/leave-policy-store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_authenticated/leave-policy')({
  component: LeavePolicyPage,
})

const LEAVE_ROWS: Array<{ key: LeaveType; label: string; icon: LucideIcon; cls: string; bg: string }> = [
  { key: 'vacation', label: 'Vacation',   icon: Sun,        cls: 'text-blue-400',   bg: 'bg-blue-500/15'   },
  { key: 'sick',     label: 'Sick Leave', icon: Thermometer, cls: 'text-rose-400',   bg: 'bg-rose-500/15'   },
  { key: 'personal', label: 'Personal',  icon: UserIcon,   cls: 'text-violet-400', bg: 'bg-violet-500/15' },
]

const ROLE_META: Array<{ key: PolicyRole; label: string; desc: string; icon: LucideIcon; cls: string; bg: string }> = [
  { key: 'student',  label: 'Students',   desc: 'Enrolled students',      icon: GraduationCap, cls: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  { key: 'employee', label: 'Employees',  desc: 'Staff & faculty',        icon: Users,         cls: 'text-sky-400',     bg: 'bg-sky-500/15'     },
]

function LeavePolicyPage() {
  const { policy, setPolicy } = useLeavePolicyStore()
  const [draft, setDraft] = useState<LeavePolicy>(() => structuredClone(policy))
  const [saved, setSaved] = useState(false)

  const update = (role: PolicyRole, type: LeaveType, raw: string) => {
    const num = Math.max(0, Math.min(365, parseInt(raw, 10) || 0))
    setDraft((prev) => ({ ...prev, [role]: { ...prev[role], [type]: num } }))
    setSaved(false)
  }

  const save = () => {
    setPolicy(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Leave Policy</h1>
        <p className="mt-0.5 text-sm text-slate-300">Configure annual leave day allowances per role type</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {ROLE_META.map(({ key: role, label, desc, icon: RoleIcon, cls, bg }) => (
          <Card key={role} className={cn(DARK_CARD, 'overflow-hidden')}>
            <div className="flex items-center gap-3 border-b border-gray-800 px-5 py-4">
              <div className={cn('flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg', bg)}>
                <RoleIcon size={15} strokeWidth={1.75} className={cls} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
            </div>
            <div className="divide-y divide-gray-800">
              {LEAVE_ROWS.map(({ key: type, label: typeLabel, icon: TypeIcon, cls: typeCls, bg: typeBg }) => (
                <div key={type} className="flex items-center gap-4 px-5 py-4">
                  <div className={cn('flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg', typeBg)}>
                    <TypeIcon size={14} strokeWidth={1.75} className={typeCls} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-stone-200">{typeLabel}</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={365}
                      value={draft[role][type]}
                      onChange={(e) => update(role, type, e.target.value)}
                      className="w-20 border-gray-700 bg-[#1a2233] text-center text-stone-200 [appearance:textfield] focus-visible:border-gray-600 focus-visible:ring-teal-500/20 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span className="w-7 text-xs text-slate-400">days</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={save}
          disabled={saved}
          className={cn('gap-2 transition-colors', saved ? 'bg-green-600 hover:bg-green-600' : '')}
        >
          {saved ? (
            <>
              <CheckCircle size={14} strokeWidth={1.75} />
              Saved
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  )
}
