import { useState } from 'react'
import { CalendarIcon, CheckCircle, Sun, Thermometer, UploadCloud, User as UserIcon  } from 'lucide-react'
import type {LucideIcon} from 'lucide-react';

import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { newRequestSchema } from '@/lib/schemas'
import type { LeaveType, NewRequestInput } from '@/lib/schemas'
import { cn } from '@/lib/utils'

interface NewRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: NewRequestInput) => void
}

const TYPES: Array<{ key: LeaveType; label: string; icon: LucideIcon; desc: string }> = [
  { key: 'vacation', label: 'Vacation', icon: Sun, desc: 'Annual leave' },
  { key: 'sick', label: 'Sick Leave', icon: Thermometer, desc: 'Medical / illness' },
  { key: 'personal', label: 'Personal', icon: UserIcon, desc: 'Personal obligation' },
]

function diffDays(start: string, end: string) {
  if (!start || !end) return 0
  return Math.max(0, Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 864e5) + 1)
}

export function NewRequestModal({ open, onOpenChange, onSubmit }: NewRequestModalProps) {
  const [type, setType] = useState<LeaveType>('vacation')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [reason, setReason] = useState('')
  const [docAdded, setDocAdded] = useState(false)

  const days = diffDays(start, end)

  const reset = () => {
    setType('vacation')
    setStart('')
    setEnd('')
    setReason('')
    setDocAdded(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const candidate = { type, start, end, reason: reason.trim(), hasDoc: docAdded }
  const parsed = newRequestSchema.safeParse(candidate)
  const canSubmit = parsed.success

  const submit = () => {
    if (!parsed.success) return
    onSubmit(parsed.data)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Leave Request</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium text-stone-400">Leave Type</p>
            <div className="grid grid-cols-3 gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  className={cn(
                    'cursor-pointer rounded-xl border-2 p-3 text-left transition-all',
                    type === t.key ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-stone-700 bg-[#2a2a2a] hover:border-stone-600',
                  )}
                >
                  <div
                    className={cn(
                      'mb-2 flex h-7 w-7 items-center justify-center rounded-lg',
                      type === t.key ? 'bg-indigo-600' : 'bg-[#3a3a3a]',
                    )}
                  >
                    <t.icon size={14} strokeWidth={1.75} className={type === t.key ? 'text-white' : 'text-stone-400'} />
                  </div>
                  <p className="text-xs font-semibold text-stone-200">{t.label}</p>
                  <p className="mt-0.5 text-xs text-stone-500">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-stone-400">Start Date</Label>
              <Input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="border-stone-700 bg-[#2a2a2a] text-stone-200 [color-scheme:dark] placeholder:text-stone-600 focus-visible:border-stone-600 focus-visible:ring-stone-500/20"
              />
            </div>
            <div>
              <Label className="text-stone-400">End Date</Label>
              <Input
                type="date"
                value={end}
                min={start}
                onChange={(e) => setEnd(e.target.value)}
                className="border-stone-700 bg-[#2a2a2a] text-stone-200 [color-scheme:dark] placeholder:text-stone-600 focus-visible:border-stone-600 focus-visible:ring-stone-500/20"
              />
            </div>
          </div>
          {days > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-stone-800 bg-white/[0.03] px-3 py-2">
              <CalendarIcon size={14} strokeWidth={1.75} className="text-stone-500" />
              <span className="text-sm text-stone-400">
                <span className="font-semibold text-white">
                  {days} day{days !== 1 ? 's' : ''}
                </span>{' '}
                selected
              </span>
            </div>
          )}
          <div>
            <Label className="text-stone-400">Reason</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Briefly describe the reason for your leave…"
              className="border-stone-700 bg-[#2a2a2a] text-stone-200 placeholder:text-stone-600 focus-visible:border-stone-600 focus-visible:ring-stone-500/20"
            />
          </div>
          {type === 'sick' && (
            <div
              onClick={() => setDocAdded((d) => !d)}
              className={cn(
                'cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-all',
                docAdded ? 'border-green-500/40 bg-green-500/10' : 'border-stone-700 hover:border-stone-600 hover:bg-white/[0.03]',
              )}
            >
              {docAdded ? (
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle size={16} strokeWidth={1.75} />
                  <span className="text-sm font-medium">Medical document attached</span>
                </div>
              ) : (
                <>
                  <UploadCloud size={22} strokeWidth={1.75} className="mx-auto mb-1.5 text-stone-600" />
                  <p className="text-sm font-medium text-stone-400">Upload medical document</p>
                  <p className="mt-0.5 text-xs text-stone-500">PDF or image · max 10 MB</p>
                </>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!canSubmit}>
              Submit Request
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
