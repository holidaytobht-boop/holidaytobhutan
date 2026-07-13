import RequireAuth from '@/components/admin/RequireAuth'
import HomePage from '@/components/admin/HomePage'

export default function Page() {
  return (
    <RequireAuth>
      <HomePage />
    </RequireAuth>
  )
}
