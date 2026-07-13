'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }) {
  const pathname = usePathname()
  const isFirstRender = useRef(true)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return undefined
    }

    setVisible(false)
    const frame = requestAnimationFrame(() => {
      setVisible(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return <div className={`page-transition${visible ? ' is-visible' : ''}`}>{children}</div>
}
