import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'

export const metadata = {
  title: 'Holiday to Bhutan',
  description: 'Authentic travel experiences across the Kingdom of Bhutan',
  icons: {
    icon: '/images/white_logo_short.svg',
    shortcut: '/images/white_logo_short.svg',
    apple: '/images/white_logo_short.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: 'document.documentElement.classList.add("js")',
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
