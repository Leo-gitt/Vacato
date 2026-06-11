import { useEffect, useState } from 'react'
import { Check, FileText, X } from 'lucide-react'

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
            <div className="space-y-1 rounded-xl border border-gray-800 bg-white/[0.03] p-3.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-stone-200">{request.userName}</p>
                <Pill {...ROLE_PILL[request.userRole]} label={BADGE_LABEL[request.userRole]} />
              </div>
              <p className="text-sm text-slate-300">
                {BADGE_LABEL[request.type]} · {request.days} day{request.days !== 1 ? 's' : ''} · {request.start} →{' '}
                {request.end}
              </p>
              <p className="mt-1 border-t border-gray-800 pt-1 text-xs text-slate-400">{request.reason}</p>
              {request.hasDoc && (
                <div className="mt-2 flex items-center gap-1.5 rounded-md bg-green-500/10 px-2 py-1.5">
                  <FileText size={12} strokeWidth={1.75} className="flex-shrink-0 text-green-400" />
                  <span className="text-xs font-medium text-green-300">Medical document uploaded</span>
                </div>
              )}
            </div>
            <div>
              <Label className="text-slate-300">
                Comment <span className="font-normal text-slate-400">(optional)</span>
              </Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Leave a note for the requester…"
                className="border-gray-700 bg-[#1a2233] text-stone-200 placeholder:text-slate-500 focus-visible:border-gray-600 focus-visible:ring-teal-500/20"
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
