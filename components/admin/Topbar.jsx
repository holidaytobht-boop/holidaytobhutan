'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Dropdown } from 'react-bootstrap'
import { getUser, logout } from '@/lib/auth'

function Topbar({ title, onMenuToggle }) {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    getUser().then(setUser)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.replace('/admin/login')
  }

  const initial = user?.email?.[0]?.toUpperCase() || 'A'

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__start">
        <button
          type="button"
          className="admin-topbar__menu"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="admin-topbar__title">{title}</h1>
      </div>
      <Dropdown align="end">
        <Dropdown.Toggle variant="light" className="admin-topbar__user">
          <span className="admin-topbar__avatar">{initial}</span>
          <span className="d-none d-sm-inline">{user?.email || 'Admin'}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.ItemText className="text-muted small">Signed in as<br />{user?.email}</Dropdown.ItemText>
          <Dropdown.Divider />
          <Dropdown.Item as={Link} href="/admin/account">
            Account settings
          </Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </header>
  )
}

export default Topbar
