import RequireAuth from '@/components/admin/RequireAuth'
import About from '@/components/admin/About'

export default function Page() {
  return (
    <RequireAuth>
      <About />
    </RequireAuth>
  )
}
