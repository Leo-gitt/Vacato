import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'

import { BADGE_LABEL } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pill, ROLE_PILL } from '@/components/dark-ui'
import type { LeaveRequest } from '@/lib/schemas'

interface ReviewRequestModalProps {
  request: LeaveRequest | null
  action: 'approved' | 'rejected' | null
  onClose: () => void
  onConfirm: (comment: string) => void
}

export function ReviewRequestModal({ request, action, onClose, onConfirm }: ReviewRequestModalProps) {
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (request) setComment('')
  }, [request])

  const open = request !== null && action !== null
  const isApprove = action === 'approved'

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isApprove ? 'Approve Request' : 'Reject Request'}</DialogTitle>
        </DialogHeader>
        {request && (
          <DialogBody className="space-y-4">
            <div className="space-y-1 rounded-xl border border-stone-800 bg-white/[0.03] p-3.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-stone-200">{request.userName}</p>
                <Pill {...ROLE_PILL[request.userRole]} label={BADGE_LABEL[request.userRole]} />
              </div>
              <p className="text-sm text-stone-400">
                {BADGE_LABEL[request.type]} · {request.days} day{request.days !== 1 ? 's' : ''} · {request.start} →{' '}
                {request.end}
              </p>
              <p className="mt-1 border-t border-stone-800 pt-1 text-xs text-stone-500">{request.reason}</p>
            </div>
            <div>
              <Label className="text-stone-400">
                Comment <span className="font-normal text-stone-500">(optional)</span>
              </Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Leave a note for the requester…"
                className="border-stone-700 bg-[#2a2a2a] text-stone-200 placeholder:text-stone-600 focus-visible:border-stone-600 focus-visible:ring-stone-500/20"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant={isApprove ? 'success' : 'destructive'} onClick={() => onConfirm(comment)}>
                {isApprove ? <Check size={14} strokeWidth={1.75} /> : <X size={14} strokeWidth={1.75} />}
                {isApprove ? 'Approve' : 'Reject'}
              </Button>
            </div>
          </DialogBody>
        )}
      </DialogContent>
    </Dialog>
  )
}
