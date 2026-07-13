export default function AdminFilterPanel({ search, children }) {
  return (
    <div className="admin-filter-panel">
      {search}
      {children}
    </div>
  )
}
