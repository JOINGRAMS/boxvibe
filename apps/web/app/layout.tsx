import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'BoxVibe — The Shopify of Meal Plans',
    template: '%s | BoxVibe',
  },
  description:
    'The white-labeled, AI-powered platform for meal subscription businesses in the GCC.',
  openGraph: {
    title: 'BoxVibe — The Shopify of Meal Plans',
    description:
      'The white-labeled, AI-powered platform for meal subscription businesses in the GCC.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
