import { FileText, Sun, Thermometer, User as UserIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { BADGE_LABEL } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Pill, STATUS_PILL } from '@/components/dark-ui'
import type { LeaveRequest, LeaveType } from '@/lib/schemas'
import { cn } from '@/lib/utils'

const TYPE_ICON: Record<LeaveType, LucideIcon> = { vacation: Sun, sick: Thermometer, personal: UserIcon }
const TYPE_CLS: Record<LeaveType, string> = {
  vacation: 'text-blue-400 bg-blue-500/15',
  sick: 'text-rose-400 bg-rose-500/15',
  personal: 'text-violet-400 bg-violet-500/15',
}

interface RequestDetailModalProps {
  request: LeaveRequest | null
  onClose: () => void
}

export function RequestDetailModal({ request, onClose }: RequestDetailModalProps) {
  if (!request) return null

  const TypeIcon = TYPE_ICON[request.type]

  return (
    <Dialog open={request !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl', TYPE_CLS[request.type])}>
              <TypeIcon size={18} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{BADGE_LABEL[request.type]}</p>
              <p className="text-xs text-slate-400">Submitted {request.submitted}</p>
            </div>
            <div className="ml-auto">
              <Pill {...STATUS_PILL[request.status]} label={BADGE_LABEL[request.status]} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-800 bg-white/[0.03] px-4 py-3">
              <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Start Date</p>
              <p className="mt-1 text-sm font-semibold text-stone-200 tabular-nums">{request.start}</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-white/[0.03] px-4 py-3">
              <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">End Date</p>
              <p className="mt-1 text-sm font-semibold text-stone-200 tabular-nums">{request.end}</p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-white/[0.03] px-4 py-3">
            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Duration</p>
            <p className="mt-1 text-sm font-semibold text-stone-200">
              {request.days} day{request.days !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="rounded-lg border border-gray-800 bg-white/[0.03] px-4 py-3">
            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Reason</p>
            <p className="mt-1 text-sm text-stone-300">{request.reason}</p>
          </div>

          {request.hasDoc && (
            <div className="flex items-center gap-2.5 rounded-lg border border-green-700/30 bg-green-500/10 px-4 py-3">
              <FileText size={15} strokeWidth={1.75} className="flex-shrink-0 text-green-400" />
              <div>
                <p className="text-xs font-semibold text-green-300">Medical document uploaded</p>
                <p className="text-xs text-green-500">Supporting document attached to this request</p>
              </div>
            </div>
          )}

          {request.comment && (
            <div className="rounded-lg border border-gray-800 bg-white/[0.03] px-4 py-3">
              <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">HR Comment</p>
              <p className="mt-1 text-sm text-stone-300">{request.comment}</p>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
