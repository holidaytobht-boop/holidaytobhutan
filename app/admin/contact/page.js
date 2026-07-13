import RequireAuth from '@/components/admin/RequireAuth'
import Contact from '@/components/admin/Contact'

export default function Page() {
  return (
    <RequireAuth>
      <Contact />
    </RequireAuth>
  )
}
