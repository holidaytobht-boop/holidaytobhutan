import { Card } from 'react-bootstrap'

export default function AdminTableCard({ title, emptyMessage, children }) {
  const isEmpty = !children

  return (
    <Card className="admin-table-card">
      {title ? <Card.Header className="admin-table-card__header">{title}</Card.Header> : null}
      <Card.Body className="p-0">
        {isEmpty && emptyMessage ? <p className="admin-table-card__empty">{emptyMessage}</p> : children}
      </Card.Body>
    </Card>
  )
}
