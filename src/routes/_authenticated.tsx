import { Outlet, createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

import { Sidebar } from '@/components/sidebar'
import { useRequests } from '@/hooks/use-requests'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (!user) throw redirect({ to: '/' })
    return { user }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { user } = Route.useRouteContext()
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const { data: requests = [] } = useRequests()

  const pendingCount = requests.filter((r) => r.status === 'pending').length

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <div className="min-h-screen">
      <Sidebar user={user} pendingCount={pendingCount} onLogout={handleLogout} />
      <main className="ml-60 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  )
}
