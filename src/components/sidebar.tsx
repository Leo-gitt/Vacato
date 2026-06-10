import { Link, useRouterState } from '@tanstack/react-router'
import {
  CalendarDays,
  Download,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings2,
} from 'lucide-react'
import type {LucideIcon} from 'lucide-react';

import { cn } from '@/lib/utils'
import type { Role, User } from '@/lib/schemas'

interface NavLink {
  to: string
  icon: LucideIcon
  label: string
  badgeKey?: 'pending'
}

const NAV: Record<Role, Array<NavLink>> = {
  student: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/requests', icon: FileText, label: 'My Requests' },
    { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  ],
  employee: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/requests', icon: FileText, label: 'My Requests' },
    { to: '/calendar', icon: CalendarDays, label: 'Team Calendar' },
  ],
  admin: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/requests', icon: Inbox, label: 'All Requests', badgeKey: 'pending' },
    { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
    { to: '/leave-policy', icon: Settings2, label: 'Leave Policy' },
    { to: '/export', icon: Download, label: 'Export Data' },
  ],
}

const ROLE_PILL: Record<Role, string> = {
  student: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/30',
  employee: 'bg-sky-500/15 text-sky-400 ring-1 ring-inset ring-sky-500/30',
  admin: 'bg-violet-500/15 text-violet-400 ring-1 ring-inset ring-violet-500/30',
}

const ROLE_LABEL: Record<Role, string> = {
  student: 'Student',
  employee: 'Employee',
  admin: 'HR / Admin',
}

interface SidebarProps {
  user: User
  pendingCount: number
  onLogout: () => void
}

export function Sidebar({ user, pendingCount, onLogout }: SidebarProps) {
  const links = NAV[user.role]
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <aside className="fixed top-0 left-0 z-20 flex h-full w-60 select-none flex-col border-r border-gray-800 bg-[#0d1117]">
      <div className="border-b border-gray-800 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-teal-600 shadow-md shadow-teal-900/40">
            <span className="text-sm font-bold text-white">V</span>
          </div>
          <div>
            <p className="text-sm leading-none font-semibold text-white">Vacato</p>
            <p className="mt-1 text-[11px] text-slate-300">Leave Management</p>
          </div>
        </div>
      </div>
      <div className="px-5 pt-4 pb-2">
        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold', ROLE_PILL[user.role])}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {ROLE_LABEL[user.role]}
        </span>
      </div>
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-3">
        {links.map((link) => {
          const active = pathname.startsWith(link.to)
          const showBadge = link.badgeKey === 'pending' && user.role === 'admin' && pendingCount > 0
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'group flex w-full cursor-pointer items-center gap-3.5 rounded-xl px-5 py-4 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-950/40'
                  : 'text-slate-300 hover:bg-teal-500/10 hover:text-white',
              )}
            >
              <link.icon size={18} strokeWidth={1.75} className={active ? 'text-teal-100' : 'text-slate-400 group-hover:text-teal-300'} />
              <span className="flex-1 text-left">{link.label}</span>
              {showBadge && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-stone-900">
                  {pendingCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <div className="group flex cursor-default items-center gap-3 rounded-xl border border-gray-800 bg-[#1a2233] px-3 py-3 transition-colors hover:bg-[#1e293b]">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 shadow-sm">
            <span className="text-xs font-bold text-white">{user.avatar}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-xs text-slate-300">{user.sub}</p>
          </div>
          <button
            onClick={onLogout}
            title="Sign out"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  )
}
