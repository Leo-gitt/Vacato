import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Check, Inbox, Plus, X } from 'lucide-react'

import { BADGE_LABEL } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DARK_CARD, Pill, STATUS_PILL, TYPE_PILL } from '@/components/dark-ui'
import { NewRequestModal } from '@/components/new-request-modal'
import { ReviewRequestModal } from '@/components/review-request-modal'
import { useCreateRequest, useRequests, useReviewRequest } from '@/hooks/use-requests'
import type { LeaveRequest, RequestStatus } from '@/lib/schemas'
import { Route as AuthRoute } from '@/routes/_authenticated'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_authenticated/requests')({
  component: RequestsPage,
})

type FilterKey = 'all' | RequestStatus

function RequestsPage() {
  const { user } = AuthRoute.useRouteContext()
  const { data: requests = [] } = useRequests()
  const createRequest = useCreateRequest(user)
  const reviewRequest = useReviewRequest()

  const [filter, setFilter] = useState<FilterKey>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [actionReq, setActionReq] = useState<LeaveRequest | null>(null)
  const [actionType, setActionType] = useState<'approved' | 'rejected' | null>(null)

  const isAdmin = user.role === 'admin'
  const pool = isAdmin ? requests : requests.filter((r) => r.userId === user.id)
  const filtered = filter === 'all' ? pool : pool.filter((r) => r.status === filter)

  const tabs: Array<{ key: FilterKey; label: string; count: number }> = [
    { key: 'all', label: 'All', count: pool.length },
    { key: 'pending', label: 'Pending', count: pool.filter((r) => r.status === 'pending').length },
    { key: 'approved', label: 'Approved', count: pool.filter((r) => r.status === 'approved').length },
    { key: 'rejected', label: 'Rejected', count: pool.filter((r) => r.status === 'rejected').length },
  ]

  const openAction = (req: LeaveRequest, type: 'approved' | 'rejected') => {
    setActionReq(req)
    setActionType(type)
  }

  const closeAction = () => {
    setActionReq(null)
    setActionType(null)
  }

  const confirmAction = (comment: string) => {
    if (!actionReq || !actionType) return
    reviewRequest.mutate({ requestId: actionReq.id, action: { status: actionType, comment } })
    closeAction()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">{isAdmin ? 'All Requests' : 'My Requests'}</h1>
          <p className="mt-0.5 text-sm text-slate-300">
            {isAdmin ? 'Review and manage leave requests' : 'Manage your leave requests'}
          </p>
        </div>
        {!isAdmin && (
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={14} strokeWidth={1.75} /> New Request
          </Button>
        )}
      </div>

      <div className="mb-4 flex w-fit gap-1 rounded-lg bg-white/[0.06] p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={cn(
              'cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all',
              filter === t.key ? 'bg-[#1e293b] text-white shadow-sm' : 'text-slate-300 hover:text-stone-200',
            )}
          >
            {t.label} {t.count > 0 && <span className="ml-0.5 text-slate-400">({t.count})</span>}
          </button>
        ))}
      </div>

      <Card className={DARK_CARD}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-white/[0.02]">
                {isAdmin && <th className="px-5 py-3 text-left text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Person</th>}
                <th className="px-5 py-3 text-left text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Type</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Period</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Days</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Submitted</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold tracking-wider text-slate-400 uppercase">{isAdmin ? 'Actions' : 'Note'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-white/[0.04]">
                  {isAdmin && (
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1e293b] text-[10px] font-bold text-stone-300">
                          {r.userName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-stone-200">{r.userName}</p>
                          <p className="text-xs text-slate-400 capitalize">{r.userRole}</p>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-5 py-3.5">
                    <Pill {...TYPE_PILL[r.type]} label={BADGE_LABEL[r.type]} />
                  </td>
                  <td className="px-5 py-3.5 font-medium whitespace-nowrap text-stone-300 tabular-nums">
                    {r.start} <span className="mx-1 text-slate-500">→</span> {r.end}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-stone-200 tabular-nums">{r.days}d</td>
                  <td className="px-5 py-3.5 text-slate-400 tabular-nums">{r.submitted}</td>
                  <td className="px-5 py-3.5">
                    <Pill {...STATUS_PILL[r.status]} label={BADGE_LABEL[r.status]} />
                  </td>
                  <td className="px-5 py-3.5">
                    {isAdmin ? (
                      r.status === 'pending' ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => openAction(r, 'approved')}
                            className="cursor-pointer rounded-md bg-green-500/10 p-1.5 text-green-400 transition-colors hover:bg-green-500/20"
                            title="Approve"
                          >
                            <Check size={13} strokeWidth={1.75} />
                          </button>
                          <button
                            onClick={() => openAction(r, 'rejected')}
                            className="cursor-pointer rounded-md bg-red-500/10 p-1.5 text-red-400 transition-colors hover:bg-red-500/20"
                            title="Reject"
                          >
                            <X size={13} strokeWidth={1.75} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )
                    ) : (
                      <span className="block max-w-xs truncate text-xs text-slate-400">{r.comment || '—'}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-5 py-14 text-center">
                    <Inbox size={28} strokeWidth={1.75} className="mx-auto mb-3 text-stone-700" />
                    <p className="text-sm text-slate-400">No requests found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <NewRequestModal open={modalOpen} onOpenChange={setModalOpen} onSubmit={(input) => createRequest.mutate(input)} />
      <ReviewRequestModal request={actionReq} action={actionType} onClose={closeAction} onConfirm={confirmAction} />
    </div>
  )
}
