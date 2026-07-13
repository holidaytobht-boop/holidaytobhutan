import RequireAuth from '@/components/admin/RequireAuth'
import DestinationPlaces from '@/components/admin/DestinationPlaces'

export default function Page() {
  return (
    <RequireAuth>
      <DestinationPlaces />
    </RequireAuth>
  )
}
