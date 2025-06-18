import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import React from 'react'
import { AuthProvider } from '@/lib/auth-context'
import { ScrollSpyProvider } from '@/lib/scroll-spy-context'
import { Header } from '@/components/layout/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FakeStore MCP',
  description: 'FakeStore MCP - Model Context Protocol shopping application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ScrollSpyProvider>
            <div className="min-h-screen bg-background">
              <Header />
              <main>
                {children}
              </main>
            </div>
          </ScrollSpyProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 