'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminNavLink({ href, end, className, onClick, children }) {
  const pathname = usePathname()
  const isActive = end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
  const cls = typeof className === 'function' ? className({ isActive }) : className

  return (
    <Link href={href} className={cls} onClick={onClick}>
      {children}
    </Link>
  )
}
