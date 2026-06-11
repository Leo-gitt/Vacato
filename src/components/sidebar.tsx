import { useState } from 'react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import {
  CalendarDays,
  Check,
  CheckCircle,
  ChevronsUpDown,
  Download,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { CompanyId, Role, User } from '@/lib/schemas'
import { COMPANIES, COMPANY_USERS } from '@/lib/mock-data'
import { useAuthStore } from '@/stores/auth-store'

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

const COMPANY_LOGO_BG: Record<CompanyId, string> = {
  brainster: 'bg-teal-600',
  techflow: 'bg-violet-600',
}

interface SidebarProps {
  user: User
  pendingCount: number
  onLogout: () => void
}

export function Sidebar({ user, pendingCount, onLogout }: SidebarProps) {
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const { companyId, switchCompany } = useAuthStore()
  const company = COMPANIES[companyId]
  const navigate = useNavigate()
  const links = NAV[user.role]
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const handleSwitchCompany = (targetId: CompanyId) => {
    setSwitcherOpen(false)
    if (targetId === companyId) return
    const adminUser = COMPANY_USERS[targetId].admin
    switchCompany(targetId, adminUser)
    navigate({ to: '/dashboard' })
  }

  return (
    <aside className="fixed top-0 left-0 z-20 flex h-full w-60 select-none flex-col border-r border-gray-800 bg-[#0d1117]">
      {/* Logo */}
      <div className="border-b border-gray-800 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md shadow-teal-900/50">
            <CalendarDays size={16} strokeWidth={1.5} className="text-white" />
            <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0d1117] ring-2 ring-[#0d1117]">
              <CheckCircle size={10} strokeWidth={2.5} className="text-teal-400" />
            </div>
          </div>
          <div>
            <p className="text-sm leading-none font-semibold text-white">Vacato</p>
            <p className="mt-1 text-[11px] text-slate-300">Leave Management</p>
          </div>
        </div>
      </div>

      {/* Company switcher */}
      <div className="border-b border-gray-800 px-3 py-3">
        <button
          onClick={() => setSwitcherOpen((o) => !o)}
          className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/[0.04]"
        >
          <div
            className={cn(
              'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[9px] font-bold text-white',
              COMPANY_LOGO_BG[companyId],
            )}
          >
            {company.logo}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium leading-tight text-stone-200">{company.name}</p>
            <p className="text-[10px] leading-tight text-slate-500">{company.industry}</p>
          </div>
          <ChevronsUpDown size={12} className="flex-shrink-0 text-slate-500 group-hover:text-slate-300" />
        </button>

        {switcherOpen && (
          <div className="mt-1.5 rounded-xl border border-gray-800 bg-[#111827] p-1">
            {(Object.values(COMPANIES) as Array<(typeof COMPANIES)[CompanyId]>).map((c) => (
              <button
                key={c.id}
                onClick={() => handleSwitchCompany(c.id)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors',
                  c.id === companyId
                    ? 'bg-white/[0.06] text-white'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white',
                )}
              >
                <div
                  className={cn(
                    'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[8px] font-bold text-white',
                    COMPANY_LOGO_BG[c.id],
                  )}
                >
                  {c.logo}
                </div>
                <span className="flex-1 truncate font-medium">{c.name}</span>
                {c.id === companyId && <Check size={10} className="flex-shrink-0 text-teal-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Role pill */}
      <div className="px-5 pt-3 pb-2">
        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold', ROLE_PILL[user.role])}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {ROLE_LABEL[user.role]}
        </span>
      </div>

      {/* Nav links */}
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

      {/* User card */}
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
