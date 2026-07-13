'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getUser } from '@/lib/auth'

export default function RequireAuth({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    getUser().then((user) => {
      if (cancelled) return
      if (!user) {
        router.replace('/admin/login')
        return
      }
      setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [router, pathname])

  if (!ready) return null
  return children
}
