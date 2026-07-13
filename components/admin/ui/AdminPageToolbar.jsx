export default function AdminPageToolbar({ children, actions, className = '' }) {
  return (
    <div className={`admin-page-toolbar d-flex justify-content-between align-items-center flex-wrap gap-2 ${className}`.trim()}>
      <div className="admin-page-toolbar__body flex-grow-1 min-w-0">{children}</div>
      {actions ? (
        <div className="admin-page-toolbar__actions d-flex flex-wrap align-items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}
