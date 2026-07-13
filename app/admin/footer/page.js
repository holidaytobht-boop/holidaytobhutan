import RequireAuth from '@/components/admin/RequireAuth'
import FooterAdmin from '@/components/admin/Footer'

export default function Page() {
  return (
    <RequireAuth>
      <FooterAdmin />
    </RequireAuth>
  )
}
