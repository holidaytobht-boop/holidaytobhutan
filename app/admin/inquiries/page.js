import RequireAuth from '@/components/admin/RequireAuth'
import Inquiries from '@/components/admin/Inquiries'

export default function Page() {
  return (
    <RequireAuth>
      <Inquiries />
    </RequireAuth>
  )
}
