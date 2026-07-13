import NotFoundContent from '@/components/site/NotFoundContent'

export default function NotFound() {
  return (
    <NotFoundContent
      title="Page not found"
      message="Sorry, we couldn't find the page you were looking for. It may have been moved or removed."
      backHref="/"
      backLabel="Back to home"
    />
  )
}
