import type { Metadata } from 'next'
import './globals.css'
import NavBar from '../components/NavBar'

export const metadata: Metadata = {
  title: 'OAA Console - Open Attestation Authority',
  description: 'Open Attestation Authority - STEM Apprenticeship Engine with LLM Stack Interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white antialiased" style={{ margin: 0, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
