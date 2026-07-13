export default function AdminEmptyState({ title, description, children }) {
  return (
    <div className="admin-empty">
      <p className="admin-empty__title">{title}</p>
      {description ? <p className="admin-empty__desc">{description}</p> : null}
      {children ? <div className="admin-empty__actions">{children}</div> : null}
    </div>
  )
}
