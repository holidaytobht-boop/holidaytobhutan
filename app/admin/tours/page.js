import RequireAuth from '@/components/admin/RequireAuth'
import Tours from '@/components/admin/Tours'

export default function Page() {
  return (
    <RequireAuth>
      <Tours />
    </RequireAuth>
  )
}
