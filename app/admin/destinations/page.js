import RequireAuth from '@/components/admin/RequireAuth'
import Destinations from '@/components/admin/Destinations'

export default function Page() {
  return (
    <RequireAuth>
      <Destinations />
    </RequireAuth>
  )
}
