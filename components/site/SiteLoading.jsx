export default function SiteLoading() {
  return (
    <div className="page-skeleton" aria-hidden="true">
      <div className="page-skeleton__hero" />
      <div className="container section-pad">
        <div className="page-skeleton__line page-skeleton__line--lg" />
        <div className="page-skeleton__line" />
        <div className="page-skeleton__line page-skeleton__line--sm" />
        <div className="page-skeleton__grid">
          <div className="page-skeleton__card" />
          <div className="page-skeleton__card" />
          <div className="page-skeleton__card" />
        </div>
      </div>
    </div>
  )
}
