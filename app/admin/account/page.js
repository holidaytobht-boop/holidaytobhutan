import RequireAuth from '@/components/admin/RequireAuth'
import AccountSettings from '@/components/admin/AccountSettings'

export default function Page() {
  return (
    <RequireAuth>
      <AccountSettings />
    </RequireAuth>
  )
}
