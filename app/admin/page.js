import RequireAuth from '@/components/admin/RequireAuth'
import Dashboard from '@/components/admin/Dashboard'

export default function Page() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  )
}
