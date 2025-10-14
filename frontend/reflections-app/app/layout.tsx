import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lab7 OAA Console',
  description: 'Open Attestation Authority - STEM Apprenticeship Engine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
