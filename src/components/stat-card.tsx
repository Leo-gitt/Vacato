import type { LucideIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const COLOR_STYLES = {
  blue: { icon: 'bg-blue-500/15 text-blue-400', border: 'border-l-blue-500', bar: 'bg-blue-500' },
  green: { icon: 'bg-green-500/15 text-green-400', border: 'border-l-green-500', bar: 'bg-green-500' },
  amber: { icon: 'bg-amber-500/15 text-amber-400', border: 'border-l-amber-500', bar: 'bg-amber-500' },
  red: { icon: 'bg-red-500/15 text-red-400', border: 'border-l-red-500', bar: 'bg-red-500' },
  stone: { icon: 'bg-stone-500/15 text-slate-300', border: 'border-l-stone-500', bar: 'bg-stone-500' },
  violet: { icon: 'bg-violet-500/15 text-violet-400', border: 'border-l-violet-500', bar: 'bg-violet-500' },
} as const

export type StatColor = keyof typeof COLOR_STYLES

interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  color?: StatColor
  icon: LucideIcon
  used?: number
  total?: number
}

export function StatCard({ label, value, sub, color = 'stone', icon: Icon, used, total }: StatCardProps) {
  const style = COLOR_STYLES[color]
  const pct = total !== undefined && total > 0 && used !== undefined ? Math.round((used / total) * 100) : undefined

  return (
    <Card className={cn('border-l-4 border-gray-700/40 bg-[#1f2937] p-5 shadow-lg shadow-black/30', style.border)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-widest text-slate-300 uppercase">{label}</p>
          <p className="mt-2 text-4xl leading-none font-bold tabular-nums text-white">{value}</p>
          {sub && <p className="mt-2 text-xs text-slate-300">{sub}</p>}
        </div>
        <div className={cn('flex-shrink-0 rounded-xl p-2.5', style.icon)}>
          <Icon size={18} strokeWidth={1.75} />
        </div>
      </div>
      {pct !== undefined && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-800">
          <div className={cn('h-full rounded-full transition-all', style.bar)} style={{ width: `${pct}%` }} />
        </div>
      )}
    </Card>
  )
}
