import { Spinner } from 'react-bootstrap'

export default function AdminLoading({ label = 'Loading…' }) {
  return (
    <div className="admin-loading">
      <Spinner animation="border" variant="primary" />
      <p className="admin-loading__text">{label}</p>
    </div>
  )
}
