import RequireAuth from '@/components/admin/RequireAuth'
import HeroBanners from '@/components/admin/HeroBanners'

export default function Page() {
  return (
    <RequireAuth>
      <HeroBanners />
    </RequireAuth>
  )
}
