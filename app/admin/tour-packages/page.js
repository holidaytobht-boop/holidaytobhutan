import RequireAuth from '@/components/admin/RequireAuth'
import TourPackages from '@/components/admin/TourPackages'

export default function Page() {
  return (
    <RequireAuth>
      <TourPackages />
    </RequireAuth>
  )
}
