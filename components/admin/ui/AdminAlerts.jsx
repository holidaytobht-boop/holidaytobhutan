import { Alert } from 'react-bootstrap'

export default function AdminAlerts({ error, success }) {
  return (
    <>
      {error ? <Alert variant="danger" className="admin-alert mb-0">{error}</Alert> : null}
      {success ? <Alert variant="success" className="admin-alert mb-0">{success}</Alert> : null}
    </>
  )
}
