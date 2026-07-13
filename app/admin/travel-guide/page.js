import RequireAuth from '@/components/admin/RequireAuth'
import TravelGuide from '@/components/admin/TravelGuide'

export default function Page() {
  return (
    <RequireAuth>
      <TravelGuide />
    </RequireAuth>
  )
}
