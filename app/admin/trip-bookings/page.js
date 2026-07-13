import RequireAuth from '@/components/admin/RequireAuth'
import TripBookings from '@/components/admin/TripBookings'

export default function Page() {
  return (
    <RequireAuth>
      <TripBookings />
    </RequireAuth>
  )
}
